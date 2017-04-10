const AWS = require('aws-sdk')
const Stream = require('stream')
const Speaker = require('speaker')
const Lame = require('lame');

const Lex = new AWS.LexRuntime({
  apiVersion: '2016-11-28',
  signatureVersion: 'v4',
  region: 'us-east-1'
})

exports.ask = text => {
  let params = {
    botAlias: 'dev', /* required */
    botName: 'HeyOffice', /* required */
    contentType: 'text/plain; charset=utf-8', /* required */
    inputStream: text, /* required */
    userId: 'office', /* required */
    accept: 'text/plain; charset=utf-8',
    sessionAttributes: {
      someKey: 'STRING_VALUE',
      /* anotherKey: ... */
    }
  };

  return new Promise(function (resolve, reject) {
    Lex.postContent(params, function(err, data) {
      if (err) reject(err); // an error occurred
      else resolve(data); // successful response
    });
  });
}

// Create the Speaker instance
const Player = new Speaker({
  channels: 1,
  bitDepth: 16,
  sampleRate: 22050
})

const Decoder = new Lame.Decoder({
  channels: 1,
  bitDepth: 16,
  sampleRate: 22050,

  bitRate: 128,
  outSampleRate: 22050,
  mode: Lame.MONO
});

exports.askSound = stream => {
  let params = {
    botAlias: 'dev', /* required */
    botName: 'HeyOffice', /* required */
    contentType: 'audio/l16; rate=16000; channels=1', /* required */
    inputStream: stream, /* required */
    userId: 'office', /* required */
    accept: 'audio/mpeg',
    sessionAttributes: {
      someKey: 'STRING_VALUE',
      /* anotherKey: ... */
    }
  };

  Lex.postContent(params, function(err, data) {
    if (err) {
      console.log("******* error");
      console.log(err);
    } // an error occurred
    else {
      console.log("******* data");
      console.log(data);

      Decoder.pipe(Player)
      Decoder.end(data.audioStream)
    } // successful response
  });
}
