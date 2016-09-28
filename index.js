var express = require('express')
var bodyParser = require('body-parser')
var request = require('request-promise')
var jwt_decode = require('jwt-decode');
var app = express()
var _ = require('lodash');
var Promise = require('bluebird');
var waitForCode = false;
var questionSet;
var sessies = {};

var self = this;

var token = "EAAH6aBRRwRIBAAztsST3yW36UMjwAXW18gx5jfDDHGL0fgzI9zja5TPBtUiVXIVS9zaZASfaSXOJCqb0ZBXzWQF1LUWiZBbcRXqcPTz1atCTvQFF4cvodOJ7dmlTJQMFIAsL1uxiJtFjasn4ls4Ex2WeZA3rPrRKmXhMcQf9IQZDZD"

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
    messaging_events = req.body.entry[0].messaging;
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i];
        console.log(event);
        var sender = event.sender.id;
        var recipient = sender;
        if (sessies[recipient] == null || sessies[recipient] == undefined) {
            sessies[recipient] = {};
            sessies[recipient].answers = [];
            console.log('self.sender is ', sessies)
        }
        if (event.message && event.message.text) {

            text = event.message.text;

            if (text == 'Start test' || text == 'Hello' || text == 'yo' || text == 'hallo' || text == 'Hallo' || text == 'heey' || text == 'hey' || text == 'Hey' || text == 'hi' || text == 'Yo' || text == 'hoi' || text == 'Hoi') {

                sendOnderwijsMessage(sender)
            }
            if (text == 'Informatica' || text == 'Pshychologie' || text == 'Communicatie' || text == 'Pabo' || text == 'Scheikunde') {
                sendModuleMessage(sender)
            }


            if (text == 'Bierpong' || text == 'Breien' || text == 'Java Beginners' || text == 'Sterrekunde' || text == 'Aapies kijken') {
                sendInformaticaMessage(sender)
            }

            if (text == 'Jaap Hoogeveen' || text == 'Arend Appel' || text == 'Tinus Hendrikus' || text == 'Jerommeke Arends' || text == 'Truus Huus') {
                sendStartMessage(sender)
            }

            if (text == 'testresultaten' || text == 'Testresultaten') {
                sendTextMessage(sender, 'Vraag: 1 - antwoord:' + ' ' + cijferArray[1 - 1])
                sendTextMessage(sender, 'Vraag: 2 - antwoord:' + ' ' + cijferArray[1])
                sendTextMessage(sender, 'Vraag: 3 - antwoord:' + ' ' + cijferArray[2])
                sendTextMessage(sender, 'Vraag: 4 - antwoord:' + ' ' + cijferArray[3])
                sendTextMessage(sender, 'Vraag: 5 - antwoord:' + ' ' + cijferArray[4])
                sendTextMessage(sender, 'Vraag: 6 - antwoord:' + ' ' + cijferArray[5])
                sendTextMessage(sender, 'Vraag: 7 - antwoord:' + ' ' + cijferArray[6])
                sendTextMessage(sender, 'Vraag: 8 - antwoord:' + ' ' + cijferArray[7])
                sendTextMessage(sender, 'Vraag: 9 - antwoord:' + ' ' + cijferArray[8])
            }
            if (text == 'Ja' || text == 'ja') {
                sendWebsiteMessage(sender, "Oke! dankuwel voor het invullen van de vragenlijst. Totziens!!")
            }
            if (text == 'Nee' || text == 'nee') {
                vragensessie = true;
                vraag = 0;
                sendTextMessage(sender, 'De vragen dienen te worden beantwoord met cijfer van 1 tot en met 10', function (error, response, body) {
                    if (error) {
                        console.log('Error sending messages: ', error)
                    } else if (response.body.error) {
                        console.log('Error: ', response.body.error)
                    } else {
                        sendGenericMessage(sender);
                    }
                })
            }

            if (text.match(/^[a-zA-Z]{3,}-[0-9]{3,}/g)) {
                console.log('werkt ');
                var tokenAndId;
                Promise.all([authenticateCode(text)])
                    .then(function (result) {
                        return tokenAndId = result[0];
                    })
                    .then(function(tokenAndId){
                        getEvaluationData(tokenAndId.evaluationId, tokenAndId.accessToken)
                    })
                    .then(function (questionSet) {
                        startVragen(questionSet, recipient);
                    });
            } else {
                sendTextMessage(sender, 'Foute code boii', function () {
                });
            }

        }

        if (text == 'Start') {
            sessies[recipient].vragensessie = true;
            sessies[recipient].vraag = 0;
            sendTextMessage(recipient, 'Vul u authenticatie code in om de test te starten', function (error, response, body) {
                if (error) {
                    console.log('Error sending messages: ', error)
                } else if (response.body.error) {
                    console.log('Error: ', response.body.error)
                }

            })
        }

        if (sessies[recipient].vragensessie && questionSet) {

            if (text > 10) {
                sendTextMessage(sender, 'error, antwoord onbekend!')
            }
            if (text < 11 || text == "Eens" || text == "Oneens" || text == "Zeer weinig" || text == "Weinig" || text == "Neutraal" || text == "Veel" || text == "Zeer veel" || text == "slecht" || text == "Zeer slecht" || text == "Goed" || text == "Zeer Goed" || text == "Volledig mee oneens" || text == "Volledig mee eens") {
                sessies[recipient].vraag++;
                sessies[recipient].answers.push(text);
                console.log(' answers zijn', sessies[recipient].answers);
                // moet gereset worden + verzonden.
            }

            if (questionSet[sessies[recipient].vraag]) {
                askQuestion(questionSet[sessies[recipient].vraag], sender);
            }

            if (sessies[recipient].vraag >= questionSet.length) {
                sendKlaarMessage(sender, 'alle vragen zijn beantwoord, bent u zeker over uw antwoorden?')
            }

        }
        if (event.message = null) {
            sendTextMessage(sender, 'Het bericht word niet herkent, probeer het opnieuw of typ Help.')
        }
    }
})


    function sendTextMessage(sender, text, callback) {
        messageData = {
            text: text
        };
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

    function startVragen(questionSet, recipient) {
        sessies[recipient].vragensessie = true;
        sessies[recipient].vraag = 0;
        askQuestion(questionSet[sessies[recipient].vraag], sender);
    }


// evaluren met code word gevraagd met die code. als het goed gaat krijg je Acces token terug. anders een error
// bij terugkrijgen van de acces token word die ge returned.
    function authenticateCode(code) {
        return request({
            url: 'https://staging-api-portal.evalytics.nl/auth/code?code=' + code,
            method: 'POST'
        }).then(function (accessToken) {
            var decoded = jwt_decode(accessToken);
            var evaluationId = decoded.evaluationId;
            return {
                evaluationId: evaluationId,
                accessToken: accessToken
            };
        })


    }

// hierin word de assay aangevraagd zodat deze in het rest van de code gebruikt kan worden.  de token is een token die je terugkrijgt nadat je je eerste token meegeeft op de site van evalytics. deze code geeft je de vragen terug.
    function getEvaluationData(id, accessToken) {
        console.log('we gaan nu een call maken om de details te vragen', id, accessToken);
        return request({
            url: 'https://staging-api-portal.evalytics.nl/evaluation/getDetails/' + id,
            method: 'GET'//,
            // headers: {
            //     ['access-token']: 'JWT '+accessToken
            // }
        }).then(function (result) {
            var data = JSON.parse(result);
            var evaluation = data.results[0];

            var openQuestions = [];
            _.forEach(evaluation.blocks[0].questionSets, function (questionset) {
                questionSet = questionset.questions;
                console.log(questionSet);
            });

            return questionSet;
        }).catch(function (error) {
            console.log(error);
        });
    }

// in deze functie worden de question soorten beschreven en verteld wat ze moeten uitvoeren.

    function askQuestion(question, sender) {
        var quickReplies = [];

        if (question.scale.input === 'rating') {
            var i = 1;
            _.times(question.scale.scaleNl.max, function (value) {
                quickReplies.push({
                    content_type: 'text',
                    title: i++,
                    payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED'
                })
            });

            // 1 t/m 10 afhandeling

        } else if (question.scale.input === 'boolean') {

            quickReplies.push({
                content_type: 'text',
                title: scale.value,
                payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED'

            })
            // Ja/nee afhandeling

        } else if (question.scale.input === 'text') {
            // Open vraag
            input.push
        }


        else {
            question.scale.scaleNl.forEach(function (scale) {
                quickReplies.push({
                    content_type: 'text',
                    title: scale.value,
                    payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED'
                })
                // afhandeling de onbekende vragen.
            });
        }

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

    function sendInformaticaMessage(sender) {
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

    function sendModuleMessage(sender) {
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





