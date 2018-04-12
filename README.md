Support for Yoopies
===================

Who does support today? Look at the page :)


Config
------

The config.json file should look like this:

```
{
  "port": 9601,
  "slackToken": "xoxp-*",
  "slackChannel": "#..."
}
```

* port: the port on which the webserver should listen
* slackToken: the Slack token of the user used to make Slack API calls
* channelId: the Slack channel where the information should be posted

Install
-------

```
npm install
npm start
```