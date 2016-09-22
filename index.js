var express = require('express')
var bodyParser = require('body-parser')
var request = require('request-promise')
var app = express()
var _ = require('lodash');
var Promise = require('bluebird');
var vraag = 0;
var vragensessie = false;
var cijferArray = new Array();

var questionSet;

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

            text = event.message.text;
            if (text == 'Informatie' || text == 'Informatie'){
                sendWebsiteMessage(sender)

            }
            if (text == 'test'){
                getEvaluation56(sender)
            }
            if (text == 'Start test' || text == 'Hello' || text == 'yo' || text == 'hallo' || text == 'Hallo' || text == 'heey' || text == 'hey' || text == 'Hey' || text == 'hi' || text == 'Yo' || text == 'hoi'|| text == 'Hoi'){

                sendOnderwijsMessage(sender)
            }
            if ( text == 'Informatica' || text == 'Pshychologie' || text == 'Communicatie'|| text == 'Pabo' || text == 'Scheikunde' ){
                sendModuleMessage(sender)
            }


            if ( text == 'Bierpong' || text == 'Breien' || text == 'Java Beginners'|| text == 'Sterrekunde'|| text == 'Aapies kijken'){
                sendInformaticaMessage(sender)
            }

            if ( text == 'Jaap Hoogeveen' || text == 'Arend Appel' || text == 'Tinus Hendrikus' || text == 'Jerommeke Arends' || text == 'Truus Huus') {
                sendStartMessage(sender)
            }

            if (text == 'testresultaten' || text == 'Testresultaten'){
                sendTextMessage(sender, 'Vraag: 1 - antwoord:' + ' ' + cijferArray[1-1])
                sendTextMessage(sender, 'Vraag: 2 - antwoord:' + ' ' + cijferArray[1])
                sendTextMessage(sender, 'Vraag: 3 - antwoord:' + ' ' + cijferArray[2])
                sendTextMessage(sender, 'Vraag: 4 - antwoord:' + ' ' + cijferArray[3])
                sendTextMessage(sender, 'Vraag: 5 - antwoord:' + ' ' + cijferArray[4])
                sendTextMessage(sender, 'Vraag: 6 - antwoord:' + ' ' + cijferArray[5])
                sendTextMessage(sender, 'Vraag: 7 - antwoord:' + ' ' + cijferArray[6])
                sendTextMessage(sender, 'Vraag: 8 - antwoord:' + ' ' + cijferArray[7])
                sendTextMessage(sender, 'Vraag: 9 - antwoord:' + ' ' + cijferArray[8])
            }
            if (text == 'Ja' || text == 'ja'){
                sendWebsiteMessage(sender, "Oke! dankuwel voor het invullen van de vragenlijst. Totziens!!")
            }
            if (text == 'Nee' || text == 'nee'){
                vragensessie = true
                vraag = 0
                sendTextMessage(sender, 'De vragen dienen te worden beantwoord met cijfer van 1 tot en met 10', function (error, response, body)
                {
                    if (error) {
                        console.log('Error sending messages: ', error)
                    } else if (response.body.error) {
                        console.log('Error: ', response.body.error)
                    }else{
                        sendGenericMessage(sender)
                    }
                })
            }
            if (text == 'restart' || text == 'Restart'){
                sendTestfinishedMessage(sender)
            }
            // if (text == 'haai'){
            //     sendGenericMessage(sender)
            //
            // }
            if (text == 'Start') {
                vragensessie = true;
                vraag = 0;
                sendTextMessage(sender, 'De vragen dienen te worden beantwoord met cijfer van 1 tot en met 10', function (error, response, body)
                 {
                    if (error) {
                        console.log('Error sending messages: ', error)
                    } else if (response.body.error) {
                        console.log('Error: ', response.body.error)
                    }else{
                        getEvaluation56(sender).then(function(questionSet) {
                            askQuestion(questionSet[vraag], sender);
                        });
                    }
                })
            }
            if (vragensessie && questionSet) {

                if (text > 10) {
                    sendTextMessage(sender, 'error, antwoord onbekend!')
                }
                if (text < 11 || text == "Eens" || text == "Oneens" || text == "Zeer weinig" || text == "Weinig" || text == "Neutraal" || text == "Veel" || text == "Zeer veel"){
                    vraag = vraag + 1
                    cijferArray.push(text);
                    console.log(cijferArray);
                }

                if(questionSet[vraag]){
                    askQuestion(questionSet[vraag], sender);
                }

                if (vraag >= questionSet.length) {
                    sendKlaarMessage(sender, 'alle vragen zijn beantwoord, bent u zeker over uw antwoorden?')
                    vragensessie = false
                }

            }
            if (event.message = null){
                sendTextMessage(sender, 'Het bericht word niet herkent, probeer het opnieuw of typ Help.')
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





function sendKlaarMessage(sender) {
    messageData = {
        "text": "Alle vragen zijn beantwoord, bent u zeker over uw antwoorden?",
        "quick_replies": [
            {
                "content_type": "text",
                "title": "Ja",
                "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
            },
            {
                "content_type": "text",
                "title": "Nee",
                "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
            }]
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

        }
        else if (event.postback && event.postback.payload) {
            payload = event.postback.payload;

            if (payload = 'Testresultaten') {

                var antwoorden = '';
                for (var i = 0; i < cijferArray.length; i++) {
                    antwoorden += 'Vraag' + (i + 1) + '- antwoord:' + ' ' + cijferArray[i] + '\n';
                }

                sendTextMessage(sender, antwoorden);

                console.log('antwoorden', antwoorden);
                // sendTextMessage(sender, 'Vraag: 1 - antwoord:' + ' ' + cijferArray[1-1])
                //     .then(function(callBack) {
                //         sendTextMessage(sender, 'Vraag: 2 - antwoord:' + ' ' + cijferArray[1])
                //     })
                //

                // sendTextMessage(sender, 'Vraag: 2 - antwoord:' + ' ' + cijferArray[1])
                // sendTextMessage(sender, 'Vraag: 3 - antwoord:' + ' ' + cijferArray[2])
                // sendTextMessage(sender, 'Vraag: 4 - antwoord:' + ' ' + cijferArray[3])
                // sendTextMessage(sender, 'Vraag: 5 - antwoord:' + ' ' + cijferArray[4])
                // sendTextMessage(sender, 'Vraag: 6 - antwoord:' + ' ' + cijferArray[5])
                // sendTextMessage(sender, 'Vraag: 7 - antwoord:' + ' ' + cijferArray[6])
                // sendTextMessage(sender, 'Vraag: 8 - antwoord:' + ' ' + cijferArray[7])
                // sendTextMessage(sender, 'Vraag: 9 - antwoord:' + ' ' + cijferArray[8])
            }

        }
    }
    res.sendStatus(200);
});


var token = "EAAH6aBRRwRIBAAztsST3yW36UMjwAXW18gx5jfDDHGL0fgzI9zja5TPBtUiVXIVS9zaZASfaSXOJCqb0ZBXzWQF1LUWiZBbcRXqcPTz1atCTvQFF4cvodOJ7dmlTJQMFIAsL1uxiJtFjasn4ls4Ex2WeZA3rPrRKmXhMcQf9IQZDZD"


function sendTextMessage(sender, text, callback) {
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
    }, callback)
}


function sendOnderwijsMessage(sender) {
    messageData = {
        "text": "Heey! welcome, op welke studie zit u?",
        "quick_replies": [
            {
                "content_type": "text",
                "title": "Informatica",
                "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
            },
            {
                "content_type": "text",
                "title": "Pshychologie",
                "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
            },
            {
                "content_type": "text",
                "title": "Communicatie",
                "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
            },
            {
                "content_type": "text",
                "title": "Pabo",
                "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
            },
            {
                "content_type": "text",
                "title": "Scheikunde",
                "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
            }]
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

function getEvaluation56(sender){
    return request({
        url: 'https://staging-api-portal.evalytics.nl/evaluation/getDetails/56',
        qs: {access_token: token},
        method: 'GET',
        headers: {
            ['access-token']: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJtaXNzaW9ucyI6eyJldmFsdWF0aW9uIjp7ImdldERldGFpbHMiOnRydWUsInBvc3RBbnN3ZXJzIjp0cnVlfX0sImNvZGUiOiJqb3JkaWlzZ2VrIiwiZXZhbHVhdGlvbklkIjoiNTYiLCJzdWIiOjE0LCJpYXQiOjE0NzQ0NjgxMzAsImV4cCI6MTQ3NDU1NDUzMCwiYXVkIjpbInd3dy5ldmFseXRpY3MubmwiXSwiaXNzIjoiRXZhbHl0aWNzIn0.pX9RSd6Qx1ttEqnKfhIl2A9Tawa695eOFwY3skqE018'
        }
    }).then(function(result){
        var data = JSON.parse(result);
        var evaluation = data.results[0];

        var openQuestions = [];
        _.forEach(evaluation.blocks[0].questionSets, function(questionset){
            questionSet = questionset.questions;
            console.log(questionSet);
        });

        return questionSet;
    }).catch(function(error){
        console.log(error);
    });
}

function askQuestion(question, sender) {
    var quickReplies = [];

    if(question.scale.input === 'rating') {
var i = 1;
        _.times(question.scale.scaleNl.max, function(value){
            quickReplies.push({
                content_type: 'text',
                title: i++ ,
                payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED'
            })
        });

        // 1 t/m 10 afhandeling

    } else if(question.scale.input === 'boolean') {
        // Ja/nee afhandeling
        quickReplies.push({
            content_type: 'text',
            title: scale.value,
            payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED'
        })

    } else if(question.scale.input === 'singleChoice'){
        // Open vraag
        quickReplies.push({
            content_type: 'text',
            title: scale.value,
            payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED'
    }
    else if(question.scale.input === 'text'){

    }
    else {
        console.log('jsdbaksjdb');
        question.scale.scalenNl.forEach(function(question) {
            quickReplies.push({
                content_type: 'text',
                title: scale.value,
                payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED'
            })
            console.log('jajajajaaajajajajaj');
        });
    }

    // quick_replies: [{
    //     content_type: 'text',
    //     title: '1',
    //     payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED'
    // }, {
    //     content_type: 'text',
    //     title: '2',
    //     payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED'
    // }]

    var messageData = {
        text: question.questionNl,
        quick_replies: quickReplies
    };

    console.log('message', messageData);

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

    function  sendInformaticaMessage(sender) {
    messageData = {
        "text": "Welke leraar wilt u beoordelen?",
        "quick_replies": [
            {
                "content_type": "text",
                "title": "Arend Appel",
                "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
            },
            {
                "content_type": "text",
                "title": "Jaap Hoogeveen",
                "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
            },
            {
                "content_type": "text",
                "title": "Truus Huus",
                "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
            },
            {
                "content_type": "text",
                "title": "Tinus Hendrikus",
                "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
            },
            {
                "content_type": "text",
                "title": "Jerommeke Arends",
                "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
            }]
    };

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
function  sendModuleMessage(sender) {
    messageData = {
        "text": "Om welke Module gaat het?",
        "quick_replies": [
            {
                "content_type": "text",
                "title": "Bierpong",
                "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
            },
            {
                "content_type": "text",
                "title": "Java Beginners",
                "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
            },
            {
                "content_type": "text",
                "title": "Breien",
                "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
            },
            {
                "content_type": "text",
                "title": "Aapies kijken",
                "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
            },
            {
                "content_type": "text",
                "title": "Sterrekunde",
                "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
            }]
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

function sendStartMessage(sender) {
    messageData = {
    "text": "Wilt u de Test starten?",
        "quick_replies": [
        {
            "content_type": "text",
            "title": "Start",
            "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
        },
        {
            "content_type": "text",
            "title": "Stop",
            "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
        }]
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



    function sendWebsiteMessage(sender) {
        messageData = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Dankuwel voor het invullen van de test!",
                        "subtitle": "U antwoorden kunt u inkijken door te drukken op testresultaten. Wilt u meer weten over Evalytics, bekijk dan onze website!",
                        "image_url": "https://www.surf.nl/binaries/article/content/gallery/surf/nieuws/evalytics-forbidden-fruit.png",
                        "buttons": [{
                            "type": "web_url",
                            "url": "http://www.evalytics.nl/",
                            "title": "Webiste Evalytics"
                        },

                            {
                                "type": "postback",
                                "title": "Testresultaten",
                                "payload": "sasdasdasd"
                            },],
                    },
                    ]
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

    function sendTestfinishedMessage(sender) {
        messageData = {
            "text": "Ben u niet zeker over uw antwoorden kies voor nee, zowel kies voor ja",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "Ja",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "Nee",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                }]
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


// quickreplie buttons aanmaak. Zijn er 10 want er cijfers gaan van 1 t/m 10

    function sendGenericMessage(sender, callback) {
        messageData = {
            "text": "vraag 1: De docent toonde voldoende kennis over de lesstof.",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "1",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "2",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                },
                {
                    "content_type": "text",
                    "title": "3",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "4",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                },
                {
                    "content_type": "text",
                    "title": "5",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "6",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                },
                {
                    "content_type": "text",
                    "title": "7",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "8",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                },
                {
                    "content_type": "text",
                    "title": "9",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "10",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                }
            ]
        }


        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token: token},
            method: 'POST',
            json: {
                recipient: {id: sender},
                message: messageData,
            }
        }, callback)
    }

    function sendGeneric1Message(sender) {
        messageData = {
            "text": "Vraag 2: De docent legde de lesstof begrijpelijk uit.",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "1",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "2",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                },
                {
                    "content_type": "text",
                    "title": "3",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "4",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                },
                {
                    "content_type": "text",
                    "title": "5",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "6",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                },
                {
                    "content_type": "text",
                    "title": "7",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "8",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                },
                {
                    "content_type": "text",
                    "title": "9",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "10",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                }
            ]
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

    function sendGeneric2Message(sender, callback) {
        messageData = {
            "text": "vraag 3: De docent gaf op een inspirerende en stimulerende manier les.",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "1",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "2",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                },
                {
                    "content_type": "text",
                    "title": "3",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "4",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                },
                {
                    "content_type": "text",
                    "title": "5",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "6",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                },
                {
                    "content_type": "text",
                    "title": "7",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "8",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                },
                {
                    "content_type": "text",
                    "title": "9",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "10",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                }
            ]
        }


        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token: token},
            method: 'POST',
            json: {
                recipient: {id: sender},
                message: messageData,
            }
        }, callback)
    }

    function sendGeneric3Message(sender, callback) {
        messageData = {
            "text": "vraag 4: In hoeverre heeft de docent bijgedragen aan het behalen van de omschreven leerdoelen?",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "Zeer weinig",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "Weinig",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                },
                {
                    "content_type": "text",
                    "title": "Neutraal",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "Veel",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                },
                {
                    "content_type": "text",
                    "title": "Zeer veel",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },

            ]
        }


        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token: token},
            method: 'POST',
            json: {
                recipient: {id: sender},
                message: messageData,
            }
        }, callback)
    }

    function sendGeneric4Message(sender, callback) {
        messageData = {
            "text": "vraag 5: In welke mate toonde de docent zich betrokken bij het leerproces van de studenten?",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "Zeer weinig",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "Weinig",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                },
                {
                    "content_type": "text",
                    "title": "Neutraal",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "Veel",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                },
                {
                    "content_type": "text",
                    "title": "Zeer veel",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
            ]
        }


        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token: token},
            method: 'POST',
            json: {
                recipient: {id: sender},
                message: messageData,
            }
        }, callback)
    }

    function sendGeneric5Message(sender, callback) {
        messageData = {
            "text": "vraag 6: De leerdoelen van deze module waren helder geformuleerd.",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "1",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "2",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                },
                {
                    "content_type": "text",
                    "title": "3",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "4",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                },
                {
                    "content_type": "text",
                    "title": "5",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "6",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                },
                {
                    "content_type": "text",
                    "title": "7",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "8",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                },
                {
                    "content_type": "text",
                    "title": "9",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "10",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                }
            ]
        }


        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token: token},
            method: 'POST',
            json: {
                recipient: {id: sender},
                message: messageData,
            }
        }, callback)
    }

    function sendGeneric6Message(sender, callback) {
        messageData = {
            "text": "vraag 7: De voor deze module vastgestelde leerdoelen heb ik behaald",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "1",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "2",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                },
                {
                    "content_type": "text",
                    "title": "3",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "4",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                },
                {
                    "content_type": "text",
                    "title": "5",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "6",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                },
                {
                    "content_type": "text",
                    "title": "7",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "8",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                },
                {
                    "content_type": "text",
                    "title": "9",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "10",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                }
            ]
        }


        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token: token},
            method: 'POST',
            json: {
                recipient: {id: sender},
                message: messageData,
            }
        }, callback)
    }

    function sendGeneric7Message(sender, callback) {
        messageData = {
            "text": "vraag 8: De module droeg bij aan de ontwikkeling van mijn vaardigheden",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "1",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "2",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                },
                {
                    "content_type": "text",
                    "title": "3",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "4",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                },
                {
                    "content_type": "text",
                    "title": "5",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "6",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                },
                {
                    "content_type": "text",
                    "title": "7",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "8",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                },
                {
                    "content_type": "text",
                    "title": "9",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "10",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                }
            ]
        }


        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token: token},
            method: 'POST',
            json: {
                recipient: {id: sender},
                message: messageData,
            }
        }, callback)
    }

    function sendGeneric8Message(sender, callback) {
        messageData = {
            "text": "vraag 9: De tijd die ik aan de module heb besteed komt overeen met het aantal studiepunten van de module",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "Eens",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                },
                {
                    "content_type": "text",
                    "title": "Oneens",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
                }
            ]
        }
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token: token},
            method: 'POST',
            json: {
                recipient: {id: sender},
                message: messageData,
            }
        }, callback)
    }



// 'use strict'
//
// var express = require('express')
// var bodyParser = require('body-parser')
// var request = require('request')
//
// var Config = require('./config')
// var FB = require('./connectors/askQuestionfacebook')
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
