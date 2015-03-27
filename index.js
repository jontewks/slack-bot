'use strict';

var request = require('request');

module.exports = function(url) {
  if (!url) {
    return cb('You didn\'t pass a url to slack-bot');
  }

  function postToSlack(message, cb) {
    request.post({
      url: url,
      method: 'POST',
      body: JSON.stringify(message)
    }, cb);
  };

  var methods = {};
  methods.send = function(message, cb) {
    // Set defaults
    message = message || {};
    message.text = message.text || 'You didn\'t pass in a text field silly.';
    message.channel = message.channel || '#general';
    message.username = message.username || 'Slack Bot';

    if (typeof(message.channel) === 'string') {
      postToSlack(message, function(err, res, body) {
        return cb ? cb(err, res, body) : null;
      });
    } else {
      var channels = message.channel;
      var responses = {};
      var returned = 0;
      var errors = null;

      channels.forEach(function(channel) {
        // Clone message object in order to overwrite channel each time
        var newMessage = {};
        for (var key in message) {
          newMessage[key] = message[key];
        }
        newMessage.channel = channel;

        postToSlack(newMessage, function(err, res, body) {
          returned++;
          
          // Add to responses object
          responses[channel] = {
            err: err,
            res: res,
            body: body
          };

          // If err, add channel name error array
          if (err) {
            if (!errors) {
              errors = [channel];
            } else {
              errors.push(channel)
            }
          }

          if (returned === message.channel.length) {
            return cb ? cb(errors, responses) : null;
          }
        });
      });
    }
  };

  return methods;
};
