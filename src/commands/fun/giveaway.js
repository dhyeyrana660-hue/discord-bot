const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getGiveaways, saveGiveaways } = require('../../data');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Start a giveaway')
    .addStringOption((option) =>
      option.setName('prize').setDescription('What is being given away').setRequired(true)
    )
    .addIntegerOption((option) =>
      option.setName('duration').setDescription('Duration in seconds').setRequired(true)
    )
    .addIntegerOption((option) =>
      option.setName('winners').setDescription('Number of winners').setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const prize = interaction.options.getString('prize');
    const duration = interaction.options.getInteger('duration');
    const winnerCount = interaction.options.getInteger('winners');

    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('🎉 GIVEAWAY')
      .setDescription(`Prize: **${prize}**\nWinners: **${winnerCount}**`)
      .setFooter({ text: 'React with 🎉 to enter!' })
      .setTimestamp(Date.now() + duration * 1000);

    const message = await interaction.channel.send({ embeds: [embed] });
    await message.react('🎉');

    const giveaways = getGiveaways(interaction.guild.id);
    giveaways.push({
      messageId: message.id,
      channelId: interaction.channel.id,
      prize,
      winners: winnerCount,
      endTime: Date.now() + duration * 1000,
    });
    saveGiveaways(interaction.guild.id, giveaways);

    await interaction.reply({ content: `✅ Giveaway started for ${prize}!`, ephemeral: true });

    setTimeout(async () => {
      const reactions = await message.reactions.cache.get('🎉')?.users.fetch();
      if (!reactions || reactions.size < 2) {
        return message.reply('Not enough participants for the giveaway!');
      }

      const participants = [...reactions.values()].filter((user) => !user.bot);
      const winners = [];

      for (let i = 0; i < Math.min(winnerCount, participants.length); i++) {
        const winner = participants[Math.floor(Math.random() * participants.length)];
        winners.push(winner);
        participants.splice(participants.indexOf(winner), 1);
      }

      const winnerEmbed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('🎉 Giveaway Results')
        .setDescription(`**Prize:** ${prize}\n**Winners:** ${winners.map((w) => `<@${w.id}>`).join(', ')}`)
        .setTimestamp();

      message.reply({ embeds: [winnerEmbed] });
    }, duration * 1000);
  },
};
