class Cycle {
  constructor(array) {
    //if (!Array.isArray(array)){throw}
    this.array = array
    this.index = -1
  }
  next() {
    this.index += 1
    if (this.index >= this.array.length) {this.index = 0}
    return this.array[this.index]
  }
}

const AWS = require('aws-sdk')
const Stream = require('stream')
const Speaker = require('speaker')
const Lame = require('lame');

// Create an Polly client
const Polly = new AWS.Polly({
  signatureVersion: 'v4',
  region: 'us-east-1'
})

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

const names = new Cycle(['Nicole', 'Brian', 'Joanna', 'Geraint', 'Amy', 'Russell', 'Raveena', 'Joey']);

const bufferStream = new Stream.PassThrough()
bufferStream.pipe(Decoder).pipe(Player)

exports.speak = text => {
  let params = {
    'Text': text,
    'OutputFormat': 'mp3',
    'VoiceId': names.next()
  }

  Polly.synthesizeSpeech(params, (err, data) => {
    if (err) {
      console.log(err.code)
    } else if (data && data.AudioStream instanceof Buffer) {
      bufferStream.write(data.AudioStream)
    }
  })
}
