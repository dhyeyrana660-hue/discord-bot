const { SlashCommandBuilder } = require('discord.js');
const { getUserBalance, saveUserBalance } = require('../../data');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily reward'),
  async execute(interaction) {
    const now = Date.now();
    const user = getUserBalance(interaction.guild.id, interaction.user.id);
    const cooldown = 24 * 60 * 60 * 1000;

    if (user.lastDaily && now - user.lastDaily < cooldown) {
      const remaining = Math.ceil((cooldown - (now - user.lastDaily)) / 60000);
      return interaction.reply({ content: `⏳ You already claimed your daily reward. Try again in about ${remaining} minutes.`, ephemeral: true });
    }

    const reward = 200;
    user.balance = (user.balance || 0) + reward;
    user.lastDaily = now;
    saveUserBalance(interaction.guild.id, interaction.user.id, user);

    await interaction.reply({ content: `✅ You claimed your daily reward: **${reward}** coins.`, ephemeral: true });
  },
};
