'use strict';

var request = require('request');

module.exports = function(url) {
  var slackBot = {};

  slackBot.send = function(message, cb) {
    if (!Array.isArray(message.channel)) {
      message.channel = [message.channel];
    }

    // Set defaults
    message = message || {};
    message.text = message.text || 'You didn\'t pass in a text field silly.';
    message.channel = message.channel || ['#general'];
    message.username = message.username || 'Slack Bot';

    var channels = message.channel;
    var responses = {};
    var returned = 0;

    channels.forEach(function(channel) {
      // Clone message object in order to overwrite channel several times if necessary
      var newMessage = {};
      for (var key in message) {
        newMessage[key] = message[key];
      }
      newMessage.channel = channel;

      // Send new message object off to slack
      request.post({
        url: url,
        method: 'POST',
        body: JSON.stringify(newMessage)
      }, function(err, res, body) {
        if (message.channel.length === 1) {
          return cb ? cb(err, res, body) : null;
        } else {
          returned++;
          
          responses[channel] = {
            err: err,
            res: res,
            body: body
          };

          if (returned === message.channel.length) {
            return cb ? cb(responses) : null;
          }
        }
      });
    });
  };

  return slackBot;
};
