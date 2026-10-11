const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { saveGuildSettings, getGuildSettings } = require('../data');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setwelcome')
    .setDescription('Set the channel where join welcome messages are sent')
    .addChannelOption((option) =>
      option.setName('channel').setDescription('The welcome channel').setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const settings = getGuildSettings(interaction.guild.id);
    settings.welcomeChannelId = channel.id;
    saveGuildSettings(interaction.guild.id, settings);

    await interaction.reply({ content: `✅ Welcome channel set to <#${channel.id}>.`, ephemeral: true });
  },
};
