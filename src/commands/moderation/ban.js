const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server')
    .addUserOption((option) =>
      option.setName('user').setDescription('User to ban').setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('Reason for the ban')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    if (!interaction.memberPermissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({ content: 'You do not have permission to ban members.', ephemeral: true });
    }

    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!targetUser) {
      return interaction.reply({ content: 'Please mention a valid user.', ephemeral: true });
    }

    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (member && interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
      return interaction.reply({ content: 'You cannot ban someone with the same or higher role than you.', ephemeral: true });
    }

    await interaction.guild.members.ban(targetUser, { reason });

    await interaction.reply({ content: `✅ ${targetUser.tag} has been banned. Reason: ${reason}` });
  },
};
