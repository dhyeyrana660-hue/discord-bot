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
      { name: '/setwelcome', description: 'Set the welcome channel.' },
      { name: '/setgoodbye', description: 'Set the goodbye channel.' },
      { name: '/setautorole', description: 'Set the auto-assign role.' },
      { name: '/setlogs', description: 'Set the logging channel.' },
      { name: '/reactionrole', description: 'Create a reaction role.' },
      { name: '/setuptickets', description: 'Set up the ticket system.' },
      { name: '/closeticket', description: 'Close a ticket.' },
      { name: '/balance', description: 'Check your coin balance.' },
      { name: '/daily', description: 'Claim your daily reward.' },
      { name: '/work', description: 'Earn coins by working.' },
      { name: '/level', description: 'Check your current level.' },
      { name: '/leaderboard', description: 'View the XP leaderboard.' },
      { name: '/toggleleveling', description: 'Enable/disable the leveling system.' },
      { name: '/play', description: 'Play music from YouTube.' },
      { name: '/pause', description: 'Pause music playback.' },
      { name: '/skip', description: 'Skip the current track.' },
      { name: '/stop', description: 'Stop music and disconnect.' },
      { name: '/giveaway', description: 'Start a giveaway.' },
      { name: '/announce', description: 'Send an announcement.' },
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
