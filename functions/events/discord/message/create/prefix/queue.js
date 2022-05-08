const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const helpers = require('../../../../../../helpers/shared.js')

let currentTrack = await lib.discord.voice['@0.0.1'].tracks.retrieve({
  guild_id: `${context.params.event.guild_id}`
});
let currentQueue = await helpers.retrieveQueue(context.params.event);
await helpers.sendPlayerUpdate(context.params.event, currentTrack, currentQueue);
