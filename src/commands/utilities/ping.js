const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot latency'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });

    const latency = sent.createdTimestamp - interaction.createdTimestamp;

    const embed = new EmbedBuilder()
      .setColor('#57F287')
      .setTitle('🏓 Pong!')
      .addFields(
        { name: 'Latency', value: `${latency}ms`, inline: true },
        { name: 'API', value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true }
      );

    await interaction.editReply({ content: '', embeds: [embed] });
  },
};
