const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Send an announcement embed to a channel')
    .addChannelOption((option) =>
      option.setName('channel').setDescription('Channel to announce in').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('title').setDescription('Announcement title').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('message').setDescription('Announcement message').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('color').setDescription('Embed color (hex code)').setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const title = interaction.options.getString('title');
    const message = interaction.options.getString('message');
    const color = interaction.options.getString('color') || '#5865F2';

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setDescription(message)
      .setTimestamp();

    await channel.send({ embeds: [embed] });
    await interaction.reply({ content: `✅ Announcement sent to <#${channel.id}>.`, ephemeral: true });
  },
};
