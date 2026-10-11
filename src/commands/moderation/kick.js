const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the server')
    .addUserOption((option) =>
      option.setName('user').setDescription('User to kick').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('reason').setDescription('Reason for the kick').setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    if (!interaction.memberPermissions.has(PermissionFlagsBits.KickMembers)) {
      return interaction.reply({ content: 'You do not have permission to kick members.', ephemeral: true });
    }

    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: 'That user is not in this server.', ephemeral: true });
    }

    if (interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
      return interaction.reply({ content: 'You cannot kick someone with the same or higher role than you.', ephemeral: true });
    }

    await member.kick(reason);
    await interaction.reply({ content: `✅ ${targetUser.tag} was kicked. Reason: ${reason}` });
  },
};
