const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const helpers = require('../../../../../../helpers/shared.js')

let searchString = context.params.event.content.split(' ').slice(1).join(' ').trim();
let currentQueue = await helpers.enqueueTrack(context.params.event, searchString);
await helpers.sendPlayerUpdate(context.params.event, null, currentQueue);