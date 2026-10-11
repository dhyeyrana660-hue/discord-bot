const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unstick')
    .setDescription('Unpin the latest sticky message in this channel')
    .addStringOption((option) =>
      option
        .setName('message_id')
        .setDescription('Optional message ID to unpin')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    let targetMessage = null;

    if (interaction.options.getString('message_id')) {
      targetMessage = await interaction.channel.messages.fetch(interaction.options.getString('message_id')).catch(() => null);
    } else {
      const pinnedMessages = await interaction.channel.messages.fetchPinned();
      targetMessage = pinnedMessages.find((msg) => msg.author.id === interaction.client.user.id && msg.embeds.some((embed) => embed.title === '📌 Sticky Message')) || null;
    }

    if (!targetMessage) {
      return interaction.reply({ content: 'No sticky message was found in this channel.', ephemeral: true });
    }

    await targetMessage.unpin();
    await interaction.reply({ content: '✅ Sticky message removed.', ephemeral: true });
  },
};
