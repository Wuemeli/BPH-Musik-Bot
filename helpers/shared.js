const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const ytdl = require('ytdl-core');
const yts = require('yt-search')

module.exports = {
  play: async (event, searchString, sendErrorToChannel) => {
    try {
      let youtubeLink;
      if (!searchString) {
        throw new Error('No search string provided.');
      }
      if (!searchString.includes('youtube.com')) {
        let results = await yts(searchString);
        if (!results?.all?.length) {
          throw new Error('No results found for your search string. Please try a different one.');
        }
        youtubeLink = results.all[0].url;
      } else {
        youtubeLink = searchString;
      }
      let downloadInfo = await ytdl.getInfo(youtubeLink);
      return lib.discord.voice['@0.0.1'].tracks.play({
        channel_id: `${process.env.RADIO_VOICE_CHANNEL}`,
        guild_id: `${event.guild_id}`,
        download_info: downloadInfo
      });
    } catch (e) {
      console.log(e);
      if (sendErrorToChannel) {
        if (e.message.includes('410')) {
          e.message = `Failed to download track from YouTube. Please try again later.`
        }
        await lib.discord.channels['@0.2.0'].messages.create({
          channel_id: `${event.channel_id}`,
          content: ` `,
          embeds: [{
            "type": "rich",
            "title": `Failed to play track!`,
            "description": e.message,
            "color": 0xaa0000
          }]
        });
      }
    }
  },
  sendPlayerUpdate: async (event, currentTrack, currentQueue) => {
    let embeds = [];
    if (currentTrack) {
      embeds.push({
        "type": "rich",
        "description": [
          `${currentTrack.paused ? 'Paused' : 'Playing'} in <#${process.env.RADIO_VOICE_CHANNEL}>:`,
          '',
          `**${currentTrack.media_display_name || 'Nothing playing'}**`
        ].join('\n'),
        "color": currentTrack.paused ? 0xaa0000 : 0x00aa00
      });
    }
    if (currentQueue) {
      let queueMessage = [
        'Playing next:',
        ''
      ];
      if (currentQueue.length) {
        queueMessage = queueMessage.concat(currentQueue.map((track) => {
          return `**• ${track.media_display_name}**`;
        }).slice(0, 10));
      } else {
        queueMessage = queueMessage.concat([
          `**No tracks in queue. Add one with \`!enqueue <query>\`!**`
        ]);
      }
      embeds.push({
        type: 'rich',
        description: queueMessage.join('\n'),
        color: 0x0000aa
      });
    }
    await lib.discord.channels['@0.2.0'].messages.create({
      channel_id: `${event.channel_id}`,
      content: ` `,
      embeds: embeds
    });
  },
  enqueueTrack: async (event, searchString) => {
    let queueKey = `${event.guild_id}:musicQueue`;
    let currentQueue = await lib.utils.kv['@0.1.16'].get({
      key: queueKey,
      defaultValue: []
    });
    try {
      let video;
      if (searchString.includes('youtube.com')) {
        let url = new URL(searchString);
        video = await yts({ 
          videoId: url.searchParams.get('v') 
        });
      } else {
        let results = await yts(searchString);
        if (!results?.all?.length) {
          throw new Error('No results found for your search string. Please try a different one.');
        }
        video = results.all[0];
      }
      currentQueue.push({
        youtube_link: video.url,
        media_display_name: video.title
      });
      await lib.utils.kv['@0.1.16'].set({
        key: queueKey,
        value: currentQueue
      });
    } catch (e) {
      console.log(e);
      if (e.message.includes('410')) {
        e.message = `Failed to download track from YouTube. Please try again later.`
      }
      await lib.discord.channels['@0.2.0'].messages.create({
        channel_id: `${event.channel_id}`,
        content: ` `,
        embeds: [{
          "type": "rich",
          "title": `Failed to queue track!`,
          "description": e.message,
          "color": 0xaa0000
        }]
      });
      throw e;
    }
    return currentQueue;
  },
  dequeueTrack: async (event) => {
    let queueKey = `${event.guild_id}:musicQueue`;
    let currentQueue = await lib.utils.kv['@0.1.16'].get({
      key: queueKey,
      defaultValue: []
    });
    if (currentQueue.length) {
      await lib.utils.kv['@0.1.16'].set({
        key: queueKey,
        value: currentQueue.slice(1)
      });
    }
    return currentQueue[0];
  },
  clearQueue: async (event) => {
    let queueKey = `${event.guild_id}:musicQueue`;
    await lib.utils.kv['@0.1.16'].clear({
      key: queueKey
    });
  },
  retrieveQueue: async (event) => {
    let queueKey = `${event.guild_id}:musicQueue`;
    return lib.utils.kv['@0.1.16'].get({
      key: queueKey,
      defaultValue: []
    });
  }
}