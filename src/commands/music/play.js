const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const playdl = require('play-dl');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play music from YouTube in your current voice channel')
    .addStringOption((option) =>
      option.setName('query').setDescription('Song title or YouTube URL').setRequired(true)
    ),
  async execute(interaction) {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply({ content: 'You need to be in a voice channel to use music commands.', ephemeral: true });
    }

    const query = interaction.options.getString('query');
    const searchResult = await playdl.search(query, { limit: 1 });

    if (!searchResult || !searchResult.length) {
      return interaction.reply({ content: 'No results found for that query.', ephemeral: true });
    }

    const info = await playdl.video_basic_info(searchResult[0].url);
    const stream = await playdl.stream(info.video_details.url, { quality: 1 });
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });

    connection.subscribe(player);

    const resource = createAudioResource(stream.stream, { inputType: stream.type });
    player.play(resource);

    const queue = interaction.client.musicQueues.get(interaction.guild.id) || { player, connection };
    queue.player = player;
    queue.connection = connection;
    interaction.client.musicQueues.set(interaction.guild.id, queue);

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('🎵 Now Playing')
      .setDescription(`[${info.video_details.title}](${info.video_details.url})`)
      .setThumbnail(info.video_details.thumbnails[0]?.url || null)
      .setFooter({ text: `Requested by ${interaction.user.tag}` });

    await interaction.reply({ embeds: [embed] });
  },
};
