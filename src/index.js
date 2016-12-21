require('dotenv').config();

import record from 'node-record-lpcm16'
import {Detector, Models} from 'snowboy'

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

  const recognizeStream = speech.createRecognizeStream(request)
     .on('error', (error) => {
       console.log("hmmmm...")
       console.error(error);
     })
     .on('data', (data) => {
       console.log('data!! =D');
       console.log(data);
      //  process.stdout.write(data.results)
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

mic.pipe(detector);

var request = {
  config: {
    encoding: 'LINEAR16',
    sampleRate: 16000
  },
  singleUtterance: true,
  interimResults: true,
  verbose: true
};
