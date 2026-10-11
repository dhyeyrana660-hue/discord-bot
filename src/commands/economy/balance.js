const { SlashCommandBuilder } = require('discord.js');
const { getUserBalance, saveUserBalance } = require('../../data');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your current coin balance'),
  async execute(interaction) {
    const balance = getUserBalance(interaction.guild.id, interaction.user.id);
    await interaction.reply({ content: `💰 Your balance is **${balance.balance || 0}** coins.`, ephemeral: true });
  },
};
