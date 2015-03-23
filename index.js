'use strict';

var request = require('request');

module.exports = function(url) {
  var slackBot = {};

  slackBot.send = function(message, cb) {
    // Set defaults
    message = message || {};
    message.text = message.text || 'You didn\'t pass in a text field silly.';
    message.channel = message.channel || '#general';
    message.username = message.username || 'Slack Bot';

    request.post({
      url: url,
      method: 'POST',
      body: JSON.stringify(message)
    }, function(err, res, body) {
      return cb ? cb(arguments) : null;
    });
  };

  return slackBot;
};
