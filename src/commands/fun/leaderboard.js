const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View the server XP leaderboard'),
  async execute(interaction) {
    const fs = require('node:fs');
    const path = require('node:path');
    const levelsFile = path.join(__dirname, '../../..', 'data', 'levels.json');

    let levels = {};
    if (fs.existsSync(levelsFile)) {
      levels = JSON.parse(fs.readFileSync(levelsFile, 'utf8'));
    }

    const guildLevels = levels[interaction.guild.id] || {};
    const sorted = Object.entries(guildLevels)
      .sort((a, b) => (b[1].level || 1) - (a[1].level || 1))
      .slice(0, 10);

    let leaderboardText = '';
    sorted.forEach((entry, index) => {
      const userId = entry[0];
      const level = entry[1].level || 1;
      leaderboardText += `**${index + 1}.** <@${userId}> - Level ${level}\n`;
    });

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('📊 XP Leaderboard')
      .setDescription(leaderboardText || 'No one is on the leaderboard yet.')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
