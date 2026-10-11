const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current track'),
  async execute(interaction) {
    const queue = interaction.client.musicQueues.get(interaction.guild.id);
    if (!queue || !queue.player) {
      return interaction.reply({ content: 'There is no music playing right now.', ephemeral: true });
    }

    queue.player.stop();
    await interaction.reply({ content: '⏭️ Track skipped.', ephemeral: true });
  },
};
