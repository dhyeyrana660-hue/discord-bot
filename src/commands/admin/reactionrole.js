const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getGuildSettings, saveGuildSettings } = require('../../data');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reactionrole')
    .setDescription('Create a reaction role for a message')
    .addStringOption((option) =>
      option.setName('message_id').setDescription('The message ID to attach the reaction role to').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('emoji').setDescription('The emoji for the reaction').setRequired(true)
    )
    .addRoleOption((option) =>
      option.setName('role').setDescription('The role to assign when the user reacts').setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const messageId = interaction.options.getString('message_id');
    const emoji = interaction.options.getString('emoji');
    const role = interaction.options.getRole('role');

    const settings = getGuildSettings(interaction.guild.id);
    settings.reactionRoles = settings.reactionRoles || {};
    settings.reactionRoles[messageId] = settings.reactionRoles[messageId] || [];
    settings.reactionRoles[messageId].push({ emoji, roleId: role.id });
    saveGuildSettings(interaction.guild.id, settings);

    const message = await interaction.channel.messages.fetch(messageId).catch(() => null);
    if (message) {
      await message.react(emoji).catch(() => {});
    }

    await interaction.reply({ content: `✅ Reaction role created for <@&${role.id}> using ${emoji}.`, ephemeral: true });
  },
};
