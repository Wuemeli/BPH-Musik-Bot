const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const helpers = require('../../../../../../helpers/shared.js')

let trackData = await lib.discord.voice['@0.0.1'].tracks.pause({
  guild_id: `${context.params.event.guild_id}`
});
await helpers.sendPlayerUpdate(context.params.event, trackData);
