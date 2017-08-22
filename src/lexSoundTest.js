require('dotenv').config();

import record from 'node-record-lpcm16'
import lex from './lex'
import toArray from 'stream-to-array'

// import vad from 'voice-activity-detection'
// import { AudioContext } from 'web-audio-api'
//
// const audioContext = new AudioContext()



const mic = record.start({
  threshold: 0,
  sampleRate: 16000
});

// vad(audioContext, mic , {
//   onVoiceStart: function() {
//     console.log("I can hear you!!")
//   },
//   onVoiceStop: function() {
//     console.log("Where is your beautiful voice?")
//   }
// })
//
// console.log("Talk!")


console.log("recording...")
setTimeout(function () {
  console.log("stop.");
  record.stop();
}, 3000);

console.log("sending to lex");
lex.askSound(mic);
