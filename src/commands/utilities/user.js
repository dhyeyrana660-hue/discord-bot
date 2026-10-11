const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Show user profile information'),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle(`${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'ID', value: user.id, inline: true },
        { name: 'Bot', value: user.bot ? 'Yes' : 'No', inline: true },
        { name: 'Joined Server', value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>` : 'Unknown', inline: true }
      );

    await interaction.reply({ embeds: [embed] });
  },
};
