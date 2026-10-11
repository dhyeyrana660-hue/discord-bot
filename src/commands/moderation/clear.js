const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Delete a number of messages from the channel')
    .addIntegerOption((option) =>
      option
        .setName('amount')
        .setDescription('How many messages to delete (1-100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');

    if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({ content: 'You do not have permission to delete messages.', ephemeral: true });
    }

    const messages = await interaction.channel.messages.fetch({ limit: amount });
    await interaction.channel.bulkDelete(messages, true);

    await interaction.reply({ content: `✅ Deleted ${messages.size} messages.`, ephemeral: true });
  },
};
