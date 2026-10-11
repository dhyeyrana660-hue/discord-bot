const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stick')
    .setDescription('Post and pin a sticky message in the current channel')
    .addStringOption((option) =>
      option
        .setName('message')
        .setDescription('The message to pin as sticky')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  aliases: ['sticky'],
  async execute(interaction) {
    const messageText = interaction.options.getString('message');

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('📌 Sticky Message')
      .setDescription(messageText)
      .setFooter({ text: `Posted by ${interaction.user.tag}` })
      .setTimestamp();

    const sentMessage = await interaction.channel.send({ embeds: [embed] });
    await sentMessage.pin();

    await interaction.reply({ content: '✅ Sticky message created and pinned.', ephemeral: true });
  },
};
