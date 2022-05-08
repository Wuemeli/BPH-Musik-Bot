const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const helpers = require('../../../../../../helpers/shared.js')

let response = await lib.discord.voice['@0.0.1'].channels.disconnect({
  guild_id: `${context.params.event.guild_id}`
});
await lib.discord.channels['@0.2.0'].messages.create({
  channel_id: `${context.params.event.channel_id}`,
  content: ` `,
  embeds: [{
    "type": "rich",
    "description": `Disconnected from <#${process.env.RADIO_VOICE_CHANNEL}>!`,
    "color": 0xaa0000
  }]
});