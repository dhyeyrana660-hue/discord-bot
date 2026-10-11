const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a member by giving them the Muted role')
    .addUserOption((option) =>
      option.setName('user').setDescription('User to mute').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('reason').setDescription('Reason for the mute').setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    if (!interaction.memberPermissions.has(PermissionFlagsBits.ModerateMembers)) {
      return interaction.reply({ content: 'You do not have permission to mute members.', ephemeral: true });
    }

    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = interaction.guild.members.cache.get(targetUser.id) || await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: 'That user is not in this server.', ephemeral: true });
    }

    let mutedRole = interaction.guild.roles.cache.find((role) => role.name.toLowerCase() === 'muted');

    if (!mutedRole) {
      mutedRole = await interaction.guild.roles.create({
        name: 'muted',
        color: '#808080',
        permissions: [],
        reason: 'Muted role for moderation management',
      });
    }

    await member.roles.add(mutedRole, reason);
    await interaction.reply({ content: `✅ ${targetUser.tag} has been muted. Reason: ${reason}` });
  },
};
