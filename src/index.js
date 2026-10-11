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
} = require('discord.js');

const config = require('./config');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

client.commands = new Collection();

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

client.on('interactionCreate', async (interaction) => {
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

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith(config.defaultPrefix)) {
    return;
  }

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

client.login(config.token);
