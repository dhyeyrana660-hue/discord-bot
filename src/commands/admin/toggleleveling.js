const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { saveGuildSettings, getGuildSettings } = require('../../data');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('toggleleveling')
    .setDescription('Enable or disable the leveling system')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const settings = getGuildSettings(interaction.guild.id);
    settings.levelingEnabled = !settings.levelingEnabled;
    saveGuildSettings(interaction.guild.id, settings);

    const status = settings.levelingEnabled ? 'enabled' : 'disabled';
    await interaction.reply({ content: `✅ Leveling system ${status}.`, ephemeral: true });
  },
};
