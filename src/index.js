require('dotenv').config();

import record from 'node-record-lpcm16'
import {Detector, Models} from 'snowboy'
import polly from './polly'
import lex from './lex'

let speech = require('@google-cloud/speech')({
  projectId: process.env.GOOGLE_SPEECH_PROJECT_ID,
  keyFilename: process.env.GOOGLE_SPEECH_KEYFILE
});

const models = new Models();

models.add({
  file: 'resources/snowboy.umdl',
  sensitivity: '0.5',
  hotwords : 'snowboy'
});

models.add({
  file: 'resources/alexa.umdl',
  sensitivity: '0.5',
  hotwords : 'alexa'
});

models.add({
  file: 'resources/HeyOffice.pmdl',
  sensitivity: '0.45',
  hotwords : 'hey office'
});

const detector = new Detector({
  resource: "resources/common.res",
  models: models,
  audioGain: 2.0
});

detector.on('silence', function () {
  console.log('silence');
});

detector.on('sound', function () {
  console.log('sound');
});

detector.on('hotword', function (index, hotword) {
  console.log('hotword', index, hotword);

  mic.unpipe(detector);
  let finished = false;
  const recognizeStream = speech.createRecognizeStream(request)
     .on('error', (error) => {
       console.log("hmmmm...")
       console.error(error);
     })
     .on('data', (data) => {
       console.log('data!! =D');
       console.log(data);
       if (data.endpointerType === 'END_OF_UTTERANCE') {
         mic.unpipe(recognizeStream);
         recognizeStream.end();
         mic.pipe(detector);
         finished = true;
       } else if (data.endpointerType === 'ENDPOINTER_EVENT_UNSPECIFIED' && finished) {
         let result = ""
         if (Array.isArray(data.results)) { result =  data.results[0].transcript}
         else { result = data.results }
         console.log(`#### ${result} ####`)
         lex.ask(result)
         .then(response => polly.speak(response.message))
         .catch(err => polly.speak("I am a banana!"))
         //polly.speak(result)
       }
     });

  mic.pipe(recognizeStream);

  console.log("Google is theoretically listening... don't give away your secrets!!")
});

detector.on('error', function () {
  console.log('error');
});

const mic = record.start({
  threshold: 0,
  sampleRate: 16000
});

polly.speak("Hey Office is now ready!")
mic.pipe(detector);

var request = {
  config: {
    encoding: 'LINEAR16',
    sampleRate: 16000
  },
  singleUtterance: true,
  interimResults: false,
  verbose: true
};
