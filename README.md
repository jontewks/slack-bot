# slack-bot
Simplifies sending bot messages to slack.
Slack-bot utilizes incoming webhooks in Slack to send messages. You can add the incoming webhooks integration and get your unique webhook url at: https://YOUR_TEAMS_SLACK_URL/services/new/incoming-webhook.

### Usage
```javascript
npm install slack-bot (--save)

var slackBot = require('slack-bot')(YOUR_WEBHOOK_URL);
```
### Functionality
##### Sending a message
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
slackBot.send({
  text: 'This message will appear in Slack!'
}, callback);
```
SlackBot defaults to the #general channel and to the username "Slack Bot" if those properties aren't passed in as in the example above, but can easily be set to whatever you like:
```javascript
slackBot.send({
  text: 'OMG look at this thing',
  channel: '#hackers', // Can also be '@someone' for a direct message
  username: 'Alert Bot'
}, callback);
```
The other most commonly passed in property is to provide either an icon_emoji or an icon_url to replace the avatar of the bot sending the message:
```javascript
slackBot.send({
  text: 'Put… the bunny… back… in the box.',
  channel: '#onetruegod',
  username: 'Nic Cage',
    
  icon_emoji: ':niccage:' // You can upload custom emojis in your team settings
  // OR
  icon_url: 'http://i.imgur.com/VVoeZ.gif'
}, callback);
```
The message object can also take additonal parameters. An overview can be found here: https://api.slack.com/incoming-webhooks

For some advanced message formatting information: https://api.slack.com/docs/formatting

How to send rich messages to slack (with good examples of messsages): https://api.slack.com/docs/attachments

### Fancy Features
##### Multiple recipients
Slack-bot can also take an array of channels in the message object in order to send the same message to several people or several channels (or a mix of people and channels) all at once.
```javascript
slackBot.send({
  text: 'Do not go outside, zombies are out there!',
  channel: ['#general', '@jon', '@charles'],
  username: 'Zombot',
  icon_emoji: ':zombie:'
}, callback);
```
In this case, the same message will be sent to the general channel, and to jon and charles as direct messages. When sending a message to multiple channels, the callback receives two arguments. The first argument is the error argument. If no errors occurred, the first argument will be `null`. If one or more errors occurred, the first argument will be an array of channel names where the errors occurred. The second argument is an object whose keys are each channel the message was sent to, and the value is an object with keys err, res, and body containing the values returned from that particular `POST`. If we were to send the above message to those three channels and no errors occurred, the object that would be returned to the callback would look like this:
```javascript
{
  '#general' : {
    err: null,
    res: RESPONSE_OBJECT,
    body: 'ok'
  },
  '@jon': {
    err: null,
    res: RESPONSE_OBJECT,
    body: 'ok'
  },
  '@charles': {
    err: null,
    res: RESPONSE_OBJECT,
    body: 'ok'
  }
}
```

It is important to note that any errors that occur when sending to multiple channels will not stop the sending of the message to the other channels. That way if an error occurs half way through, it won't stop the message from going to the remaining channels.

The reason the error argument passed to the callback is an array of channel names is so you can easily access all the errors that occurred in the returned object by using the values in the array as the keys in the object:
```javascript
slackBot.send(messageObjectToMultipleChannels, function(err, object) {
  if (err) {
    err.forEach(function(channel) {
      console.log(object[channel].err);
    });
  }
});
```