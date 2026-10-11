const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { saveGuildSettings, getGuildSettings } = require('../../data');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setuptickets')
    .setDescription('Set up the ticket system for your server')
    .addChannelOption((option) =>
      option.setName('category').setDescription('The category to create tickets in').setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const category = interaction.options.getChannel('category');
    const settings = getGuildSettings(interaction.guild.id);
    settings.ticketCategoryId = category.id;
    saveGuildSettings(interaction.guild.id, settings);

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('create_ticket')
        .setLabel('Create Ticket')
        .setStyle(ButtonStyle.Primary),
    );

    await interaction.channel.send({ content: 'Click the button below to create a support ticket.', components: [button] });
    await interaction.reply({ content: `✅ Ticket system set up in <#${category.id}>.`, ephemeral: true });
  },
};
