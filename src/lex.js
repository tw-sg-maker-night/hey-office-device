const AWS = require('aws-sdk')

const Lex = new AWS.LexRuntime({
  apiVersion: '2016-11-28',
  signatureVersion: 'v4',
  region: 'us-east-1'
})

exports.ask = text => {
  let params = {
    botAlias: 'dev', /* required */
    botName: 'HeyOffice', /* required */
    inputText: text, /* required */
    userId: 'office', /* required */
    sessionAttributes: {
      someKey: 'STRING_VALUE',
      /* anotherKey: ... */
    }
  };

  return new Promise(function (resolve, reject) {
    Lex.postText(params, function(err, data) {
      if (err) reject(err); // an error occurred
      else resolve(data); // successful response
    });
  });
}
