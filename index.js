var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()
var _ = require('lodash');
var vraag = 0;
var vragensessie = false;

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'vrendly_bot_will') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function () {
    console.log('running on port', app.get('port'))
})




app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            if (text == 'hello'){
                sendWebsiteMessage(sender)

            }
            else if (text == 'haai'){
                sendGenericMessage(sender)

            }
                        if (text == 'start') {
                vragensessie = true
                vraag = 0
                sendTextMessage(sender, 'De vragen dienen te worden beantwoord met cijfer van 1 tot en met 10'),
                sendTextMessage(sender, 'vraag 1: De docent toonde voldoende kennis over de lesstof.')
            }
            if (vragensessie) {

                if (text > 10) {
                    sendTextMessage(sender, 'error, antwoord onbekend!')
                }
                if (text < 11) {

                    vraag = vraag + 1
                    console.log(text)
                }
                if (vraag == 1) {
                    sendTextMessage(sender, 'vraag 2: De docent legde de lesstof begrijpelijk uit.')


                }
                if (vraag == 2) {
                    sendTextMessage(sender, 'alle vragen beantwoord,, doei')
                    vragensessie = false

                }
            }

            // if (text < 11 ) {
            //     sendTextMessage(sender, 'vraag 2: De docent legde de lesstof begrijpelijk uit.')
            //     if ( text > 10) {
            //         sendTextMessage(sender, 'error, antwoord onbekend!'),
            //             sendTextMessage(sender, 'vraag 1: De docent toonde voldoende kennis over de lesstof.')
            //     }
            // }


function StartTest()
{
    sendTextMessage(sender, 'De vragen dienen te worden beantwoord met cijfer van 1 tot en met 10'),
    sendTextMessage(sender, 'vraag 1: De docent toonde voldoende kennis over de lesstof.')
}








        //     else if (text === 'Website') {
        //         sendWebsiteMessage(sender)
        //         continue
        //     }
        //     // else if(afsluitingen(text) == true) {
        //     //     sendTextMessage(sender, 'tot ziens, dankuwel voor het chatten');
        //     //     continue
        //     // }
        //     else if (text === ('hello' ||'Hello' , 'Hi' , 'hi')) {
        //         sendTextMessage(sender, ' Hello! Im BotVrendly, how can i help you?');
        //         continue
        //     }
        //     else if (text.toString() === ('doei' || 'Doei' || 'dag' || 'Dag' || 'Bye' || 'bye' || 'doeg' || 'Doeg' || 'Totziens' || 'totziens')) {
        //         sendTextMessage(sender, "Thank you, have a nice day!!");
        //         continue
        //     }
        //     else if (text === 'help') {
        //         sendTextMessage(sender, '-Website\n-Generic\n-hi\n-doei');
        //         continue
        //     }
           // sendTextMessage(sender, "Ik ben nog niet zo slim!: " + text.substring(0, 200))
        }
        if (event.postback) {
            text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: " + text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})


var token = "EAAH6aBRRwRIBAAztsST3yW36UMjwAXW18gx5jfDDHGL0fgzI9zja5TPBtUiVXIVS9zaZASfaSXOJCqb0ZBXzWQF1LUWiZBbcRXqcPTz1atCTvQFF4cvodOJ7dmlTJQMFIAsL1uxiJtFjasn4ls4Ex2WeZA3rPrRKmXhMcQf9IQZDZD"


function sendTextMessage(sender, text) {
    messageData = {
        text: text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


// function sendGenericMessage(sender) {
//     messageData = {
//         "attachment": {
//             "type": "template",
//             "payload": {
//                 "template_type": "Start",
//                 "elements": [{
//                     "title": "First card",
//                     "subtitle": "Element #1 of an hscroll",
//                     "buttons": [{
//                         "type": "web_url",
//                         "url": "https://www.oculus.com/",
//                         "title": "web url"
//                     }, {
//                         "type": "postback",
//                         "title": "Postback",
//                         "payload": "Payload for first element in a generic bubble",
//                     }],
//                 }, ],
//                 }
//             }
//         }
//     }
//     request({
//         url: 'https://graph.facebook.com/v2.6/me/messages',
//         qs: {access_token: token},
//         method: 'POST',
//         json: {
//             recipient: {id: sender},
//             message: messageData,
//         }
//     }, function (error, response, body) {
//         if (error) {
//             console.log('Error sending messages: ', error)
//         } else if (response.body.error) {
//             console.log('Error: ', response.body.error)
//         }
//     })




// function sendWebsiteMessage(sender) {
//     messageData = {
//         "attachment": {
//             "type": "template",
//             "payload": {
//                 "template_type": "button",
//                 "text":"Hello, do you wanna start the test?",
//                 "buttons":[
//                             {
//                                 "type":"postback",
//                                 "title":"ja",
//                                 "payload" : "StartTest"
//                             },
//                             {
//                               "type":"postback",
//                               "title":"Nee",
//                               "payload" : "StartTest"
//
//                             },
//
//                           ]
//                         }
//                       }
//                     }
//     request({
//         url: 'https://graph.facebook.com/v2.6/me/messages',
//         qs: {access_token: token},
//         method: 'POST',
//         json: {
//             recipient: {id: sender},
//             message: messageData,
//         }
//     }, function (error, response, body) {
//         if (error) {
//             console.log('Error sending messages: ', error)
//         } else if (response.body.error) {
//             console.log('Error: ', response.body.error)
//         }
//     })
//
// }




function sendWebsiteMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": 'vraag 1: De docent toonde voldoende kennis over de lesstof.',

                    "buttons":  [{
                        "type": "postback",
                        "title": "web url",
                        "payload": "StartTest"
                    }],
                        "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "StartTest",
                    }],
                }, ]
            }
        }
    }


    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })

}




function sendGenericMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "template": "here are some!",
            "buttons": [
                "eff",
                "efsef",
                "sefse",
                "fsef",
                "sefse",
                "fsef",
                "sef"
            ]
        }
    }


    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}






// 'use strict'
//
// var express = require('express')
// var bodyParser = require('body-parser')
// var request = require('request')
//
// var Config = require('./config')
// var FB = require('./connectors/facebook')
// var Bot = require('./bot')
//
// var request = require('request');

//Lets try to make a HTTPS GET request to modulus.io's website.
//All we did here to make HTTPS call is changed the `http` to `https` in URL.
// request('https://modulus.io', function (error, response, body) {
//     //Check for error
//     if(error){
//         return console.log('Error:', error);
//     }
//
//     //Check f
//     // or right status code
//     if(response.statusCode !== 200){
//         return console.log('Inval' +
//             'id Status Code Returned:', response.statusCode);
//     }
//
//     //All is good. Print the body
//     console.log(body); // Show the HTML for the Modulus homepage.
//
// });
// LETS MAKE A SERVER!
// var app = express()
// app.set('port', (process.env.PORT) || 5000)
// // SPIN UP SERVER
// app.listen(app.get('port'), function () {
//     console.log('Running on port', app.get('port'))
//
// })
// // PARSE THE BODY
// app.use(bodyParser.json());


// index page
// app.get('/', function (req, res) {
//     res.send('hello world i am a chat bot')
// })
//
// // for facebook to verify
// app.get('/webhook/', function (req, res) {
//     console.log('read1')
//     if (req.query['hub.verify_token'] === Config.FB_VERIFY_TOKEN) {
//         res.send(req.query['hub.challenge'])
//     }
//     res.send('Error, wrong token')
// })
//
// //
//
// to send messages to facebook
// app.post('/webhook/', function (req, res) {
//     console.log('read')
//     var entry = FB.getMessageEntry(req.body)
//     IS THE ENTRY A VALID MESSAGE?
//     if (entry && entry.message) {
//         if (entry.message.attachments) {
//              NOT SMART ENOUGH FOR ATTACHMENTS YET
//             FB.newMessage(entry.sender.id, "That's interesting!")
//         } else {
//             SEND TO BOT FOR PROCESSING
//             Bot.read(entry.sender.id, entry.message.text, function (sender, reply) {
//                 FB.newMessage(sender, reply)
//             })
//         }
//     }
//
//     res.sendStatus(200)
// })
//










































// const token = "EAAH6aBRRwRIBAAztsST3yW36UMjwAXW18gx5jfDDHGL0fgzI9zja5TPBtUiVXIVS9zaZASfaSXOJCqb0ZBXzWQF1LUWiZBbcRXqcPTz1atCTvQFF4cvodOJ7dmlTJQMFIAsL1uxiJtFjasn4ls4Ex2WeZA3rPrRKmXhMcQf9IQZDZD"






// var express = require('express')
// var bodyParser = require('body-parser')
// var request = require('request')
// var app = express()
// var _ = require('lodash');
//
//
// app.set('port', (process.env.PORT || 5000))
//
// // Process application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({extended: false}))
//
// // Process application/json
// app.use(bodyParser.json())
//
// // Index route
// app.get('/', function (req, res) {
//     res.send('Hello world, I am a chat bot')
// })
//
// // for Facebook verification
// app.get('/webhook/', function (req, res) {
//     if (req.query['hub.verify_token'] === 'vrendly_bot_will') {
//         res.send(req.query['hub.challenge'])
//     }
//     res.send('Error, wrong token')
// })
//
// // Spin up the server
// app.listen(app.get('port'), function () {
//     console.log('running on port', app.get('port'))
// })
//
// //_.indexOf([1 ,2 , 1, 2], 2);
//
//
// app.post('/webhook/', function (req, res) {
//     messaging_events = req.body.entry[0].messaging
//     for (i = 0; i < messaging_events.length; i++) {
//         event = req.body.entry[0].messaging[i]
//         sender = event.sender.id
//         if (event.message && event.message.text) {
//             text = event.message.text
//             if (text === 'Generic') {
//                 sendGenericMessage(sender)
//                 continue
//             }
//             else if (text === 'Website') {
//                 sendWebsiteMessage(sender)
//                 continue
//             }
//             // else if(afsluitingen(text) == true) {
//             //     sendTextMessage(sender, 'tot ziens, dankuwel voor het chatten');
//             //     continue
//             // }
//             else if (text.toString() === ('doei' || 'Doei' || 'dag' || 'Dag' || 'Bye' || 'bye' || 'doeg' || 'Doeg' || 'Totziens' || 'totziens')) {
//                 sendTextMessage(sender, ' Hello! Im BotVrendly, how can i help you?');
//                 continue
//             }
//             else if (text.toString() === ('doei' || 'Doei' || 'dag' || 'Dag' || 'Bye' || 'bye' || 'doeg' || 'Doeg' || 'Totziens' || 'totziens')) {
//                 sendTextMessage(sender, "Thank you, have a nice day!!");
//                 continue
//             }
//             else if (text === 'help') {
//                 sendTextMessage(sender, '-Website\n-Generic\n-hi\n-doei');
//                 continue
//             }
//             sendTextMessage(sender, "Ik ben nog niet zo slim!: " + text.substring(0, 200))
//         }
//         if (event.postback) {
//             text = JSON.stringify(event.postback)
//             sendTextMessage(sender, "Postback received: " + text.substring(0, 200), token)
//             continue
//         }
//     }
//     res.sendStatus(200)
// })
//
//
// var token = "EAAH6aBRRwRIBAAztsST3yW36UMjwAXW18gx5jfDDHGL0fgzI9zja5TPBtUiVXIVS9zaZASfaSXOJCqb0ZBXzWQF1LUWiZBbcRXqcPTz1atCTvQFF4cvodOJ7dmlTJQMFIAsL1uxiJtFjasn4ls4Ex2WeZA3rPrRKmXhMcQf9IQZDZD"
//
//
// function sendTextMessage(sender, text) {
//     messageData = {
//         text: text
//     }
//     request({
//         url: 'https://graph.facebook.com/v2.6/me/messages',
//         qs: {access_token: token},
//         method: 'POST',
//         json: {
//             recipient: {id: sender},
//             message: messageData,
//         }
//     }, function (error, response, body) {
//         if (error) {
//             console.log('Error sending messages: ', error)
//         } else if (response.body.error) {
//             console.log('Error: ', response.body.error)
//         }
//     })
// }
//
//
// function sendGenericMessage(sender) {
//     messageData = {
//         "attachment": {
//             "type": "template",
//             "payload": {
//                 "template_type": "generic",
//                 "elements": [{
//                     "title": "First card",
//                     "subtitle": "Element #1 of an hscroll",
//                     "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
//                     "buttons": [{
//                         "type": "web_url",
//                         "url": "https://www.oculus.com/",
//                         "title": "web url"
//                     }, {
//                         "type": "postback",
//                         "title": "Postback",
//                         "payload": "Payload for first element in a generic bubble",
//                     }],
//                 }, {
//                     "title": "Second card",
//                     "subtitle": "Element #2 of an hscroll",
//                     "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
//                     "buttons": [{
//                         "type": "postback",
//                         "title": "Postback",
//                         "payload": "Payload for second element in a generic bubble",
//                     }],
//                 }]
//             }
//         }
//     }
//     request({
//         url: 'https://graph.facebook.com/v2.6/me/messages',
//         qs: {access_token: token},
//         method: 'POST',
//         json: {
//             recipient: {id: sender},
//             message: messageData,
//         }
//     }, function (error, response, body) {
//         if (error) {
//             console.log('Error sending messages: ', error)
//         } else if (response.body.error) {
//             console.log('Error: ', response.body.error)
//         }
//     })
//
// }
//
//
// function sendWebsiteMessage(sender) {
//     messageData = {
//         "attachment": {
//             "type": "template",
//             "payload": {
//                 "template_type": "generic",
//                 "elements": [{
//                     "title": "Evalytics",
//                     "subtitle": "site van eva",
//                     "image_url": "https://www.surf.nl/binaries/article/content/gallery/surf/nieuws/evalytics-forbidden-fruit.png",
//                     "buttons": [{
//                         "type": "web_url",
//                         "url": "http://www.evalytics.nl/",
//                         "title": "web url"
//                     }, {
//                         "type": "postback",
//                         "title": "Postback",
//                         "payload": "Payload for first element in a generic bubble",
//                     }],
//                 },
//                     {
//                         "title": "Vrendly",
//                         "subtitle": "site van vrendly",
//                         "image_url": "https://beta.vrendly.nl/app/images/vrendly-logo-w200px.svg",
//                         "buttons": [{
//                             "type": "web_url",
//                             "url": "https://beta.vrendly.nl/app/#/login",
//                             "title": "web url"
//                         }, {
//                             "type": "postback",
//                             "title": "Postback",
//                             "payload": "Payload for second element in a generic bubble",
//                         }],
//                     }]
//             }
//         }
//     }
//     request({
//         url: 'https://graph.facebook.com/v2.6/me/messages',
//         qs: {access_token: token},
//         method: 'POST',
//         json: {
//             recipient: {id: sender},
//             message: messageData,
//         }
//     }, function (error, response, body) {
//         if (error) {
//             console.log('Error sending messages: ', error)
//         } else if (response.body.error) {
//             console.log('Error: ', response.body.error)
//         }
//     })
//
// }
//
//
//
//
//
//
//
//
//
