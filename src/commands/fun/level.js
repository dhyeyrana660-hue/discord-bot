const { SlashCommandBuilder } = require('discord.js');
const { getUserLevel } = require('../../data');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('level')
    .setDescription('Check your current level'),
  async execute(interaction) {
    const level = getUserLevel(interaction.guild.id, interaction.user.id);
    const xpNeeded = (level.level || 1) * 100;
    const progress = Math.round(((level.xp || 0) / xpNeeded) * 100);

    await interaction.reply({
      content: `📊 Your level: **${level.level || 1}** | XP: **${level.xp || 0}/${xpNeeded}** (${progress}%)`,
      ephemeral: true,
    });
  },
};
