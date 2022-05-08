const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const helpers = require('../../../../../../helpers/shared.js')

let searchString = context.params.event.content.split(' ').slice(1).join(' ').trim();
if (searchString) {
  let newTrack = await helpers.play(context.params.event, searchString, true);
  await helpers.sendPlayerUpdate(context.params.event, newTrack);
} else {
  let currentTrack = await lib.discord.voice['@0.0.1'].tracks.retrieve({
    guild_id: `${context.params.event.guild_id}`
  });
  if (!currentTrack?.paused) {
    await helpers.sendPlayerUpdate(context.params.event, currentTrack);
  } else if (currentTrack?.media_url) {
    let resumedTrackData = await lib.discord.voice['@0.0.1'].tracks.resume({
      guild_id: `${context.params.event.guild_id}`
    });
    await helpers.sendPlayerUpdate(context.params.event, resumedTrackData);
  } else {
    let nextTrack = await helpers.dequeueTrack(context.params.event);
    if (nextTrack) {
      await helpers.play(context.params.event, nextTrack.youtube_link, true);
    } else {
      return lib.discord.channels['@0.2.0'].messages.create({
        channel_id: `${context.params.event.channel_id}`,
        content: ` `,
        embeds: [{
          "type": "rich",
          "description": `No items in the current queue. Please provide a YouTube link or search term to play a track.`,
          "color": 0xaa0000
        }]
      });
    }
  }
}