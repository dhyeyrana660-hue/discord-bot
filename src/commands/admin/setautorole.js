const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { saveGuildSettings, getGuildSettings } = require('../../data');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setautorole')
    .setDescription('Set the role automatically assigned to new members')
    .addRoleOption((option) =>
      option.setName('role').setDescription('Role to assign').setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const role = interaction.options.getRole('role');
    const settings = getGuildSettings(interaction.guild.id);
    settings.autoRoleId = role.id;
    saveGuildSettings(interaction.guild.id, settings);

    await interaction.reply({ content: `✅ Auto role set to <@&${role.id}>.`, ephemeral: true });
  },
};
