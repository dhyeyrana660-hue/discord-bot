const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { saveGuildSettings, getGuildSettings } = require('../../data');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setgoodbye')
    .setDescription('Set the channel where goodbye messages are sent')
    .addChannelOption((option) =>
      option.setName('channel').setDescription('The goodbye channel').setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const settings = getGuildSettings(interaction.guild.id);
    settings.goodbyeChannelId = channel.id;
    saveGuildSettings(interaction.guild.id, settings);

    await interaction.reply({ content: `✅ Goodbye channel set to <#${channel.id}>.`, ephemeral: true });
  },
};
