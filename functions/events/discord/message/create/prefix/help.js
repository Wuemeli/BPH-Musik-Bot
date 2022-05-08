const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.channels['@0.2.0'].messages.create({
  channel_id: `${context.params.event.channel_id}`,
  content: ` `,
  embeds: [{
    "type": "rich",
    "title": "Available commands",
    "description": [
      `\`!play <query>\`: Play or search for a track`,
      `\`!play\` Resume a paused track or play the latest track from the queue if the player is disconnected`,
      `\`!pause\`: Pause the currently playing track`,
      `\`!disconnect\`: Disconnect the bot from the voice channel`,
      `\`!queue\`: Same as !nowplaying`,
      `\`!enqueue <query>\`: Add a track to the queue`,
      `\`!skip\`: Skip currently playing track and play the next track in the queue`,
      `\`!clearqueue\`: Clear the current queue`,
      `\`!help\`: Bring up this help menu`
    ].join('\n'),
    "color": 0x00aaaa
  }]
});