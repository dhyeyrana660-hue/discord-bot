const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause the current music playback'),
  async execute(interaction) {
    const queue = interaction.client.musicQueues.get(interaction.guild.id);
    if (!queue || !queue.player) {
      return interaction.reply({ content: 'There is no music playing right now.', ephemeral: true });
    }

    queue.player.pause();
    await interaction.reply({ content: '⏸️ Playback paused.', ephemeral: true });
  },
};
