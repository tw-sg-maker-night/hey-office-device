require('dotenv').config();

import record from 'node-record-lpcm16'
import lex from './lex'
import toArray from 'stream-to-array'

const mic = record.start({
  threshold: 0,
  sampleRate: 16000
});

console.log("recording...")
setTimeout(function () {
  console.log("stop.");
  record.stop();
}, 3000);

toArray(mic).then(data => {
  console.log("sending to lex");
  lex.askSound(Buffer.concat(data));
})
