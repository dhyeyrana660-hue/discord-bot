const { SlashCommandBuilder } = require('discord.js');
const { getUserBalance, saveUserBalance } = require('../../data');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Earn coins by working'),
  async execute(interaction) {
    const now = Date.now();
    const user = getUserBalance(interaction.guild.id, interaction.user.id);
    const cooldown = 60 * 60 * 1000;

    if (user.lastWork && now - user.lastWork < cooldown) {
      const remaining = Math.ceil((cooldown - (now - user.lastWork)) / 60000);
      return interaction.reply({ content: `⏳ You already worked recently. Try again in about ${remaining} minutes.`, ephemeral: true });
    }

    const reward = Math.floor(Math.random() * 120) + 50;
    user.balance = (user.balance || 0) + reward;
    user.lastWork = now;
    saveUserBalance(interaction.guild.id, interaction.user.id, user);

    await interaction.reply({ content: `💼 You worked hard and earned **${reward}** coins.`, ephemeral: true });
  },
};
