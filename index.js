/**
 * Created by William on 30/08/16.
 */
var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()
var str = 'Welcome in ChatBot!';
console.log(str);

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
// app.get('/', function (req, res) {
//     res.send('Hello world, I am a chat bot')
// })

// index
app.get('/', function (req, res) {
    res.send('hello world i am a secret bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})
app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            sendTextMessage(sender, "Wat lief dat je dat vraagt, " + text.substring(0, 200))
        }
    }
    res.sendStatus(200)
})

var token= "EAAJdlf5ub0MBAH8u4wPNVoiL93lqO1Nth9ypwdj8nhlMCzUNLTAHcBGGPwZBCw5p36SZClTZA9h9UZCVAnIZCSxG9R6Ohw0gWBWx6X02wIVZBiHEej6mSUkNdImRC6ZCFxvYrKRi8Gd5ZC6t0lLQuOAcZCqTdCudRZAcHmWvIlfg6nfwZDZD"

function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}