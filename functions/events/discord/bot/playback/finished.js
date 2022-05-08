const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const helpers = require('../../../../../helpers/shared.js');

let nextTrack = await helpers.dequeueTrack(context.params.event);
if (nextTrack) {
  await helpers.play(context.params.event, nextTrack.youtube_link, false)
}
