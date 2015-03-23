# slack-bot
Simplifies sending bot messages to slack.
Slack-bot utilizes incoming webhooks in Slack to send messages. You can add the incoming webhooks integration and get your unique webhook url at: https://YOUR_TEAMS_SLACK_URL/services/new/incoming-webhook.

##### Usage
```javascript
npm install slack-bot (--save)

var slackBot = require('slack-bot')(YOUR_WEBHOOK_URL);
```
##### Functionality
To send a message, call the .send function:
```javascript
slackBot.send(messageObject, callback);
```

The callback is optional and is passed three arguments:
* An error object, if applicable
* The response object
* The response body

A simple callback example:
```javascript
slackBot.send(messageObject, function(err, res, body) {
  if (err) return next(err);
  console.log(body);
});
```

The simplest message object:
```javascript
var messageObject = {
    text: 'This message will appear in Slack!'
};
```
SlackBot defaults to the #general channel and to the username "Slack Bot" if those properties aren't passed in as in the example above, but can easily be set to whatever you like:
```javascript
var messageObject = {
    text: 'OMG look at this thing',
    channel: '#hackers', // Can also be '@someone' for a direct message
    username: 'Alert Bot'
};
```
The other most commonly passed in property is to provide either an icon_emoji or an icon_url to replace the avatar of the bot sending the message:
```javascript
var messageObject = {
    text: 'Put… the bunny… back… in the box.',
    channel: '#onetruegod',
    username: 'Nic Cage',
    
    icon_emoji: ':niccage:' // You can upload custom emojis in your team settings
    // OR
    icon_url: 'http://i.imgur.com/VVoeZ.gif'
};
```
The message object can also take additonal parameters. An overview can be found here: https://api.slack.com/incoming-webhooks

For some advanced message formatting information: https://api.slack.com/docs/formatting

How to send rich messages to slack (with good examples of messsages): https://api.slack.com/docs/attachments