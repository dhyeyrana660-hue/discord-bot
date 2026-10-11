const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { saveGuildSettings, getGuildSettings } = require('../../data');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setlogs')
    .setDescription('Set the channel used for server logs')
    .addChannelOption((option) =>
      option.setName('channel').setDescription('The logging channel').setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const settings = getGuildSettings(interaction.guild.id);
    settings.logChannelId = channel.id;
    saveGuildSettings(interaction.guild.id, settings);

    await interaction.reply({ content: `✅ Log channel set to <#${channel.id}>.`, ephemeral: true });
  },
};
