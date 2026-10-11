const fs = require('node:fs');
const path = require('node:path');
const {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
  EmbedBuilder,
  ActivityType,
  Partials,
} = require('discord.js');

const config = require('./config');
const { getGuildSettings, saveGuildSettings, getUserBalance, saveUserBalance, getUserLevel, saveUserLevel } = require('./data');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.commands = new Collection();
client.musicQueues = new Map();
client.userCooldowns = new Map();

const commands = [];

function loadCommands(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      loadCommands(fullPath);
      continue;
    }

    if (!entry.name.endsWith('.js')) continue;

    const command = require(fullPath);

    if (!command || !command.data || !command.execute) {
      continue;
    }

    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
  }
}

loadCommands(path.join(__dirname, 'commands'));

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  client.user.setPresence({
    activities: [{ name: 'your server', type: ActivityType.Watching }],
    status: 'online',
  });

  const rest = new REST({ version: '10' }).setToken(config.token);

  try {
    console.log('Refreshing application (/) commands...');

    if (config.guildId) {
      await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), {
        body: commands,
      });
    } else {
      await rest.put(Routes.applicationCommands(config.clientId), {
        body: commands,
      });
    }

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
});

client.on('guildMemberAdd', async (member) => {
  const settings = getGuildSettings(member.guild.id);

  if (settings.autoRoleId) {
    const role = member.guild.roles.cache.get(settings.autoRoleId);
    if (role) await member.roles.add(role).catch(() => {});
  }

  if (settings.welcomeChannelId) {
    const channel = member.guild.channels.cache.get(settings.welcomeChannelId);
    if (channel) {
      const welcomeEmbed = new EmbedBuilder()
        .setColor('#57F287')
        .setTitle('Welcome!')
        .setDescription(`Welcome to **${member.guild.name}**, <@${member.id}>! We hope you enjoy your time here.`)
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .setTimestamp();

      channel.send({ embeds: [welcomeEmbed] }).catch(() => {});
    }
  }
});

client.on('guildMemberRemove', async (member) => {
  const settings = getGuildSettings(member.guild.id);

  if (settings.goodbyeChannelId) {
    const channel = member.guild.channels.cache.get(settings.goodbyeChannelId);
    if (channel) {
      const goodbyeEmbed = new EmbedBuilder()
        .setColor('#ED4245')
        .setTitle('Goodbye')
        .setDescription(`${member.user.tag} has left the server.`)
        .setTimestamp();

      channel.send({ embeds: [goodbyeEmbed] }).catch(() => {});
    }
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;

  const settings = getGuildSettings(message.guild.id);

  // Anti-spam check
  const userId = message.author.id;
  const now = Date.now();
  const cooldowns = client.userCooldowns.get(userId) || [];
  const recentMessages = cooldowns.filter((time) => now - time < 5000);

  if (recentMessages.length >= 5) {
    const logChannel = message.guild.channels.cache.get(settings.logChannelId);
    if (logChannel) {
      const spamEmbed = new EmbedBuilder()
        .setColor('#FEE75C')
        .setTitle('Anti-Spam Triggered')
        .setDescription(`<@${userId}> was flagged for spam.`)
        .setTimestamp();

      logChannel.send({ embeds: [spamEmbed] }).catch(() => {});
    }
    return message.reply({ content: 'Please stop spamming!', ephemeral: true }).catch(() => {});
  }

  recentMessages.push(now);
  client.userCooldowns.set(userId, recentMessages);

  // Leveling XP gain
  if (settings.levelingEnabled) {
    const xpGain = Math.floor(Math.random() * 15) + 5;
    const level = getUserLevel(message.guild.id, userId);
    level.xp = (level.xp || 0) + xpGain;

    const xpNeeded = (level.level || 1) * 100;
    if (level.xp >= xpNeeded) {
      level.level = (level.level || 1) + 1;
      level.xp = 0;
      saveUserLevel(message.guild.id, userId, level);
      message.reply({ content: `🎉 ${message.author}, you've leveled up to level **${level.level}**!` }).catch(() => {});
    } else {
      saveUserLevel(message.guild.id, userId, level);
    }
  }

  // Prefix commands
  if (!message.content.startsWith(config.defaultPrefix)) return;

  const args = message.content.slice(config.defaultPrefix.length).trim().split(/\s+/);
  const commandName = args.shift()?.toLowerCase();

  if (!commandName) return;

  const command = client.commands.get(commandName) ||
    [...client.commands.values()].find((cmd) => cmd.aliases?.includes(commandName));

  if (!command) return;

  try {
    await command.execute(message, args, client);
  } catch (error) {
    console.error(error);
  }
});

client.on('messageDelete', async (message) => {
  if (!message.guild || message.author?.bot) return;

  const settings = getGuildSettings(message.guild.id);
  const logChannel = message.guild.channels.cache.get(settings.logChannelId);
  if (!logChannel) return;

  const logEmbed = new EmbedBuilder()
    .setColor('#FEE75C')
    .setTitle('Message Deleted')
    .setDescription(`A message from <@${message.author.id}> was deleted in <#${message.channel.id}>.`)
    .addFields(
      { name: 'Content', value: message.content || 'No content', inline: false },
    )
    .setTimestamp();

  logChannel.send({ embeds: [logEmbed] }).catch(() => {});
});

client.on('messageUpdate', async (_, newMessage) => {
  if (!newMessage.guild || newMessage.author?.bot) return;

  const settings = getGuildSettings(newMessage.guild.id);
  const logChannel = newMessage.guild.channels.cache.get(settings.logChannelId);
  if (!logChannel) return;

  const logEmbed = new EmbedBuilder()
    .setColor('#5865F2')
    .setTitle('Message Updated')
    .setDescription(`A message from <@${newMessage.author.id}> was edited in <#${newMessage.channel.id}>.`)
    .addFields(
      { name: 'New Content', value: newMessage.content || 'No content', inline: false },
    )
    .setTimestamp();

  logChannel.send({ embeds: [logEmbed] }).catch(() => {});
});

client.on('guildBanAdd', async (ban) => {
  const settings = getGuildSettings(ban.guild.id);
  const logChannel = ban.guild.channels.cache.get(settings.logChannelId);
  if (!logChannel) return;

  const embed = new EmbedBuilder()
    .setColor('#ED4245')
    .setTitle('Member Banned')
    .setDescription(`${ban.user.tag} was banned.`)
    .setTimestamp();

  logChannel.send({ embeds: [embed] }).catch(() => {});
});

client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;
  if (!reaction.message.guild) return;

  const settings = getGuildSettings(reaction.message.guild.id);
  const reactionRoles = settings.reactionRoles || {};
  const messageReactionRoles = reactionRoles[reaction.message.id] || [];

  const match = messageReactionRoles.find((entry) => entry.emoji === reaction.emoji.name || entry.emoji === reaction.emoji.id);
  if (!match) return;

  const member = reaction.message.guild.members.cache.get(user.id) || await reaction.message.guild.members.fetch(user.id).catch(() => null);
  if (!member) return;

  const role = reaction.message.guild.roles.cache.get(match.roleId);
  if (!role) return;

  await member.roles.add(role).catch(() => {});
});

client.on('messageReactionRemove', async (reaction, user) => {
  if (user.bot) return;
  if (!reaction.message.guild) return;

  const settings = getGuildSettings(reaction.message.guild.id);
  const reactionRoles = settings.reactionRoles || {};
  const messageReactionRoles = reactionRoles[reaction.message.id] || [];

  const match = messageReactionRoles.find((entry) => entry.emoji === reaction.emoji.name || entry.emoji === reaction.emoji.id);
  if (!match) return;

  const member = reaction.message.guild.members.cache.get(user.id) || await reaction.message.guild.members.fetch(user.id).catch(() => null);
  if (!member) return;

  const role = reaction.message.guild.roles.cache.get(match.roleId);
  if (!role) return;

  await member.roles.remove(role).catch(() => {});
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === 'create_ticket') {
      const settings = getGuildSettings(interaction.guild.id);
      const ticketCategory = interaction.guild.channels.cache.get(settings.ticketCategoryId);

      if (!ticketCategory) {
        return interaction.reply({ content: 'Ticket system is not configured.', ephemeral: true });
      }

      const ticketChannel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        type: 0,
        parent: ticketCategory,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: ['ViewChannel'],
          },
          {
            id: interaction.user.id,
            allow: ['ViewChannel', 'SendMessages'],
          },
        ],
      }).catch(() => null);

      if (!ticketChannel) {
        return interaction.reply({ content: 'Failed to create ticket channel.', ephemeral: true });
      }

      const ticketEmbed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle('Support Ticket')
        .setDescription(`Hello <@${interaction.user.id}>, please describe your issue below.`)
        .setTimestamp();

      await ticketChannel.send({ embeds: [ticketEmbed] });
      await interaction.reply({ content: `✅ Ticket created: <#${ticketChannel.id}>`, ephemeral: true });
    }
  }

  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);

    const errorEmbed = new EmbedBuilder()
      .setColor('#ed4245')
      .setTitle('⚠️ Command failed')
      .setDescription('Something went wrong while running this command.');

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
    } else {
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
});

client.login(config.token);
