const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available bot commands'),
  async execute(interaction) {
    const commands = [
      { name: '/ping', description: 'Check the bot latency.' },
      { name: '/server', description: 'View server info.' },
      { name: '/user', description: 'View your profile info.' },
      { name: '/stick', description: 'Create and pin a sticky message in this channel.' },
      { name: '/unstick', description: 'Unpin the stickied message in this channel.' },
      { name: '/kick', description: 'Kick a member.' },
      { name: '/ban', description: 'Ban a member.' },
      { name: '/mute', description: 'Mute a member.' },
      { name: '/clear', description: 'Delete messages in bulk.' },
    ];

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('🤖 Bot Commands')
      .setDescription('Here are the available commands for this server.')
      .addFields(
        commands.map((cmd) => ({
          name: cmd.name,
          value: cmd.description,
          inline: false,
        }))
      );

    await interaction.reply({ embeds: [embed] });
  },
};
