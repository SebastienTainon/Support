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
  "channelId": "C*"
}
```

* port: the port on which the webserver should listen
* slackToken: the Slack token of the user used to make Slack API calls
* channelId: the Slack channel id where should be posted informations

Install
-------

```
npm install
npm start
```