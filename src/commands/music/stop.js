const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop music and disconnect from the voice channel'),
  async execute(interaction) {
    const queue = interaction.client.musicQueues.get(interaction.guild.id);
    if (!queue || !queue.player) {
      return interaction.reply({ content: 'There is no music playing right now.', ephemeral: true });
    }

    queue.player.stop();
    if (queue.connection) queue.connection.destroy();
    interaction.client.musicQueues.delete(interaction.guild.id);
    await interaction.reply({ content: '⏹️ Music stopped and disconnected.', ephemeral: true });
  },
};
