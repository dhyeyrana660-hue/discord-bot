const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Show server information'),
  async execute(interaction) {
    const guild = interaction.guild;

    const embed = new EmbedBuilder()
      .setColor('#FEE75C')
      .setTitle(`${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: 'Members', value: `${guild.memberCount.toString()}`, inline: true },
        { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
        { name: 'Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true },
        { name: 'Boosts', value: `${guild.premiumSubscriptionCount ?? 0}`, inline: true },
        { name: 'Verification', value: `${guild.verificationLevel}`, inline: true }
      );

    await interaction.reply({ embeds: [embed] });
  },
};
