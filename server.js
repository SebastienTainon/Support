var http = require('http');
var url = require('url');
var fs = require('fs');
var express = require('express');
var request = require('request');
var moment = require('moment');
var bodyParser = require('body-parser');
var config = require('./config.json');
var _ = require('lodash');
var app = express();
var fileSave = 'data.json';

var listPeople = config.listPeople;
var slackToken = config.slackToken;

app.use(bodyParser.json());
moment.locale('fr');

var content = fs.existsSync(fileSave) ? fs.readFileSync(fileSave) : null;
var contentData = content ? JSON.parse(content) : {};
var supportOrder = contentData.order;
var slackUsers = {};

var writeNewOrder = function (newOrder) {
    supportOrder = newOrder;
    contentData.date = moment().format('L');
    fs.writeFile(fileSave, JSON.stringify({date: moment().format('L'), order: newOrder}));
};

request
    .get('https://slack.com/api/users.list?token=' + slackToken, function (error, response, body) {
        if (response.statusCode == 200) {
            var members = JSON.parse(body).members;
            _.each(members, function (member) {
                slackUsers[member.id] = member;
            });
        }
    });

var returnIndex = function (req, res, admin) {
    var user = listPeople[supportOrder[0]];

    var nextDays = [];
    var currentDate = moment();
    _.each(supportOrder, function (supportOrder, i) {
        if (i >= 1) {
            do {
                currentDate = moment(currentDate).add(1, 'days');
            }
            while (currentDate.day() == 0 || currentDate.day() > 5);

            nextDays.push({
                date: currentDate,
                user: listPeople[supportOrder],
                order: supportOrder
            });
        }
    });

    res.render('index.ejs', {
        user: user,
        userPicture: slackUsers[user.slackId].profile.image_192,
        nextDays: nextDays,
        admin: admin
    });
};

app.get('/', function (req, res) {
    var currentDate = moment();
    if (contentData.date != currentDate.format('L')) {
        // Rotate the orders
        var rotations = 0;
        while (contentData.date != currentDate.format('L')) {
            do {
                currentDate = moment(currentDate).subtract(1, 'days');
            }
            while (currentDate.day() == 0 || currentDate.day() > 5);
            // console.log(contentData.date, currentDate.format('L'));
            rotations++;
        }

        console.log('Making ' + rotations + ' rotation(s) to get to today');

        //[1,2,3,4] -> [3,4,1,2]
        for (var i = 0; i < rotations; i++) {
            var newOrder = supportOrder;
            newOrder.push(newOrder.shift());
        }

        writeNewOrder(newOrder);
    }

    return returnIndex(req, res, false);
});

app.get('/admin', function (req, res) {
    return returnIndex(req, res, true);
});

app.post('/up-down', function (req, res) {
    console.log(req.body);
    var direction = req.body.direction;
    var userOrder = req.body.order;

    // if [1,2,3] and direction=up and userOrder=2, we move 2 to up, then it results to [2,1,3]
    var currentUserOrder = supportOrder.indexOf(userOrder);
    var newOrder = supportOrder;
    if ('up' == direction && currentUserOrder >= 1) {
        var tmp = newOrder[currentUserOrder];
        newOrder[currentUserOrder] = newOrder[currentUserOrder - 1];
        newOrder[currentUserOrder - 1] = tmp;
        writeNewOrder(newOrder);
        res.send('ok');
    } else if ('down' == direction && currentUserOrder >= 0 && currentUserOrder < newOrder.length - 1 ) {
        var tmp2 = newOrder[currentUserOrder];
        newOrder[currentUserOrder] = newOrder[currentUserOrder + 1];
        newOrder[currentUserOrder + 1] = tmp2;
        writeNewOrder(newOrder);
        res.send('ok');
    } else {
        res.sendStatus(400).send('Bad request: unknown user or bad direction');
    }
});

app.get('/app.js', function (req, res) {
    res.sendFile('/app.js', {root: __dirname});
});

app.listen(9600, function () {
    console.log('Server listening on http://localhost:9600');
});
