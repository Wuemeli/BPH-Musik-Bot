const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const helpers = require('../../../../../../helpers/shared.js')

await helpers.clearQueue(context.params.event);
await helpers.sendPlayerUpdate(context.params.event, null, []);