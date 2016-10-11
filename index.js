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
var _id;
var _qid;
var evaluation;
var topicId;
var topicName;
var topicType;
var teacherId;
var teacherName;
var teacherCode;
var longStarttime;
var longEndtime;
var longSeconds;

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

            if (text == 'Informatie' || text == 'Informatie') {
                sendWebsiteMessage(sender)

            }
            if (text == 'Start test' || text == 'Hello' || text == 'yo' || text == 'hallo' || text == 'Hallo' || text == 'heey' || text == 'hey' || text == 'Hey' || text == 'hi' || text == 'Yo' || text == 'hoi' || text == 'Hoi') {

                sendTextMessage(sender, 'Welkom! typ uw code in om de test te starten :|]')
            }
            if (text == 'Vrendly' || text == 'vrendly') {

                sendjeromMessage(sender, 'hier is een foto van jerom, wilt u meer afbeeldingen typ Geert')
            }
            if ( text == 'factuur' || text == 'Factuur'){
                sendPayMessage(sender)
            }


            if (text == 'Ja' || text == 'ja') {
                sendDetails(recipient);
                sendWebsiteMessage(sender, "Oke! dankuwel voor het invullen van de vragenlijst. Totziens!!")
            }

            if (text == 'Nee' || text == 'nee') {
                vragensessie = true
                vraag = 0
                sendTextMessage(sender, 'De vragen dienen te worden beantwoord met cijfer van 1 tot en met 10', function (error, response, body) {
                    if (error) {
                        console.log('Error sending messages: ', error)
                    } else if (response.body.error) {
                        console.log('Error: ', response.body.error)
                    } else {
                        sendGenericMessage(sender)
                    }
                })
            }
            if (text == 'restart' || text == 'Restart') {
                sendTestfinishedMessage(sender)
            }


//---------------------code word hier gestart door een regular expression. deze if word uitgevoerd hierna--------------------

            if (text.match(/^[a-zA-Z]{3,}-[0-9]{3,}/g)) {
                console.log('werkt ')

                sessies[recipient].vragensessie = true;
                sessies[recipient].vraag = 0;
                sendTextMessage(sender, 'De evaluatie is gestart', function (error, response, body) {
                    longStarttime = System.currentTimeMillis();
                    if (error) {
                        console.log('Error sending messages: ', error)
                    } else if (response.body.error) {
                        console.log('Error: ', response.body.error)
                    }
                    else {
                        authenticateCode(text)
                            .then(function (accessToken) {
                                sessies[recipient].accessToken = accessToken;
                                var decoded = jwt_decode(accessToken);
                                var evaluationId = decoded.evaluationId;
                                _id = evaluationId;
                                return getEvaluationData(evaluationId, accessToken);
                            })
                            .then(function (questionSet) {
                                askQuestion(questionSet[sessies[recipient].vraag], sender);
                            })
                            .catch(function (error) {
                                console.log(error);
                            })
                    }
                })
            }

            if(waitForCode) {
                waitForCode = false;
                console.log("code is getypt", text)
                startVragen(text);
            }
            // questionset is opgehaald, allee vragen die goed worden beantwoord zullen in een array worden gezet, de rest word genegeerd.
            if (sessies[recipient].vragensessie && questionSet) {


                if (text > 10) {
                    sendTextMessage(sender, 'error, antwoord onbekend!')
                }
                if (text < 11 || text == "Eens" || text == "Oneens" || text == "Zeer weinig" || text == "Weinig" || text == "Neutraal" || text == "Veel" || text == "Zeer veel" || text == "slecht" || text == "Slecht" || text == "Zeer slecht" || text == "Goed" || text == "Zeer Goed" || text == "Volledig mee oneens" || text == "Volledig mee eens") {

                    sessies[recipient].vraag++;
                    sessies[recipient].answers.push(
                    {
                        questionId: _qid,
                        questionSet: _id,
                        answer: text,
                        score: text
                    });
                    _qid ++;
                    console.log(' answers zijn',sessies[recipient].answers);
                    // moet gereset worden + verzonden.
                }

                if (questionSet[sessies[recipient].vraag]) {
                    askQuestion(questionSet[sessies[recipient].vraag], sender);
                }

                if (sessies[recipient].vraag >= questionSet.length) {
                    sendKlaarMessage(sender, 'alle vragen zijn beantwoord, bent u zeker over uw antwoorden?')
                    longEndtime = System.currentTimeMillis();
                    longSeconds = (endTime - startTime) / 1000;
                    console.log('tijd', longSeconds)
                }

            }
            if (event.message = null) {
                sendTextMessage(sender, 'Het bericht word niet herkent, probeer het opnieuw of typ Help.')
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
        //----------------------------------postback word hier gerealiseerd-------------------------------------
        if (event.postback) {
            var text = JSON.stringify(event.postback.payload)

            if (text === "\"Testresultaten\"") {

                var antwoorden = '';
                for (var i = 0; i < sessies[recipient].answers.length; i++) {
                    antwoorden += 'Q' + (i + 1) + ':' + ' ' + sessies[recipient].answers[i] + '\n';
                }
                console.log(' antwoorden', sessies);

                sendTextMessage(sender, antwoorden);

                console.log('antwoorden', antwoorden);

            }
            else if (text === "\"USER_DEFINED_PAYLOAD\"") {
                sendTextMessage(sender, 'Vul u authenticatie code in om de test te starten')

            }
            else if (text === "\"klacht indienen\"") {
                sendTextMessage(sender, 'jerom is niet zo goed in zijn hoofd')
            }

        }
    }
    res.sendStatus(200);
});
//--------------------------------facebook token----------------------------------------
var token = "EAAH6aBRRwRIBAAztsST3yW36UMjwAXW18gx5jfDDHGL0fgzI9zja5TPBtUiVXIVS9zaZASfaSXOJCqb0ZBXzWQF1LUWiZBbcRXqcPTz1atCTvQFF4cvodOJ7dmlTJQMFIAsL1uxiJtFjasn4ls4Ex2WeZA3rPrRKmXhMcQf9IQZDZD"

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
    sendTextMessage(messageData);
}

function startVragen(userInput)
{
    text = userInput
    sessies[recipient].vragensessie = true;
    sessies[recipient].vraag = 0;
    authenticateCode(getAuthenticateCode(userInput))
        .then(function (accessToken) {
            var decoded = jwt_decode(accessToken);
            var evaluationId = decoded.evaluationId;
            return getEvaluationData(evaluationId, accessToken);
        })
        .then(function (questionSet) {
            askQuestion(questionSet[sessies[recipient].vraag], sender);
        })
        .catch(function (error) {
            console.log(error);
        })
}



// code uit de text halen
function getAuthenticateCode(userInput){
    console.log('code word opgevraagt');
    var woordenArray = ["code",':',"mijn","is"];
    for (var i = 0; i < woordenArray.length; i++){
        userInput = userInput.replace(woordenArray[i],'')
    }
    console.log('hier is de code', userInput);
    return userInput;
}


// code
function getEvaluation(code) {
    console.log("yoooooooooooooooop")
    authenticateCode(code)
        .then(function (result) {
            var accessToken = result;
            console.log('access ontvangen')
            console.log(accessToken);
            var decoded = jwt_decode(accessToken);
            console.log(decoded);
            var evaluationId = decoded.evaluationId;
            return getEvaluationData(evaluationId, accessToken)
        }).then(function (result) {
        console.log(result);
        askQuestion(question, sender)
    })
}
// evaluren met code word gevraagd met die code. als het goed gaat krijg je Acces token terug. anders een error
// bij terugkrijgen van de acces token word die ge returned.
function authenticateCode(code) {
    return request({
        url: 'https://staging-api-portal.evalytics.nl/auth/code?code=' + code,
        method: 'POST'
    }).then(function (result) {
        var data = JSON.parse(result);
        return data.accessToken;
    }).catch(function (error) {
        console.log(error);
    })


}
// hierin word de assay aangevraagd zodat deze in het rest van de code gebruikt kan worden.  de token is een token die je terugkrijgt nadat je je eerste token meegeeft op de site van evalytics. deze code geeft je de vragen terug.
function getEvaluationData(id, accessToken) {
    return request({
        url: 'https://staging-api-portal.evalytics.nl/evaluation/getDetails/' + id,
        method: 'GET',
        headers: {
            ['access-token']: accessToken
        }
    }).then(function (result) {
        var data = JSON.parse(result);
        evaluation = data.results[0];
        console.log('evaluatie2', evaluation);
        console.log ('evaluatie', data);
        console.log('code kw', result);

        var openQuestions = [];
        _.forEach(evaluation.blocks[0].questionSets, function (questionset) {
            questionSet = questionset.questions;
            _qid = questionSet[0].id;
            console.log(questionSet);
        });

        topicId = evaluation.topic.id;
        topicName = evaluation.topic.name;
        topicType = evaluation.topic.type;
        teacherId =  evaluation.blocks[0].data.teachers[0].id;
        teacherName =  evaluation.blocks[0].data.teachers[0].name;
        teacherCode =  evaluation.blocks[0].data.teachers[0].data.code;

        console.log('topic evaluatie', topicId, topicName, topicType, ',', teacherName, teacherCode, teacherId);
        return questionSet;
    }).catch(function (error) {
        console.log(error);
    });
}

// in deze functie worden de question soorten beschreven en verteld wat ze moeten uitvoeren.

function askQuestion(question, sender) {
    var quickReplies = [];
console.log('id madda', question.id);
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
        quick_replies: quickReplies,

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

//------------------------------answers versturen------------------------------

function sendAnswers(payload, accessToken){
    request({
    url: 'https://staging-api-portal.evalytics.nl/evaluation/postAnswers/',
    method: 'POST',
    headers: {
        ['access-token']: accessToken
    },
    data: payload
}, function (error, response, body) {
    if (error) {
        console.log('Error sending messages: ', error)
    } else if (response.body.error) {
        console.log('Error: ', response.body.error)
    }
})
}

//-------------------------------------senden gegevens EVA test--------------------------------------------
function sendDetails(recipient){


    // evaluation
    // duration
    // evaluationblocks
    var payload = [];
    payload.id = _id;
    payload.topic = {
        "id": topicId,
        "name": topicName,
        "type": topicType
    };

    var antwoorden = [];
    //vullen van antwoorden
    for(var i = 0; i < sessies[recipient].answers.length; i++) {
        antwoorden.push({
            "answer": sessies[recipient].answers[i].answer,
            "score": sessies[recipient].answers[i].score,
            "question": sessies[recipient].answers[i].questionId,
            "teachers": [
                {
                "id": teacherId,
                "block":_id,
                "name": teacherName,
                "code": teacherCode
            }
            ]
        })
    }

    payload.answers = antwoorden;

    var send = [];
    send['evaluation'] = 10;
    send['duration'] = longSeconds;
    send['evaluationBlocks'] = payload;

    console.log('awnsers', send);

    sendAnswers(send, sessies[recipient].accessToken);
}


//------------------------------------verzonden gegevens-------------------------------------------------
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
    sendTextMessage(messageData);
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
function sendPayMessage(sender) {
    messageData = {
        "attachment":{
                "type":"template",
                "payload":{
                    "template_type":"generic",
                    "elements":[
                        {
                            "title":"Welcome to Peter\'s Hats",
                            "item_url":"https://petersfancybrownhats.com",
                            "image_url":"https://petersfancybrownhats.com/company_image.png",
                            "subtitle":"We\'ve got the right hat for everyone.",
                    "buttons": [
                        {
                            "type": "payment",
                            "title": "buy",
                            "payload": "DEVELOPER_DEFINED_PAYLOAD",
                            "payment_summary": {
                                "currency": "USD",
                                "payment_type": "FIXED_AMOUNT",
                                "merchant_name": "Peter's Apparel",
                                "requested_user_info": [
                                    "shipping_address",
                                    "contact_name",
                                    "contact_phone",
                                    "contact_email"
                                ],
                                "price_list": [
                                    {
                                        "label": "Subtotal",
                                        "amount": "29.99"
                                    },
                                    {
                                        "label": "Taxes",
                                        "amount": "2.47"
                                    }
                                ]
                            }
                        }
                    ]
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: id ="(+31)654902460"},
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

function sendjeromMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "vrendly test",
                    "subtitle": "Ziet er weer prima uit",
                    "image_url": "https://files.slack.com/files-pri/T03BPURV8-F2MQG7NGL/ancient_invoice.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://beta.vrendly.nl/app/#/overview/open",
                        "title": "Klacht indienen"
                    }, {
                        "type": "postback",
                        "title": "Meer informatie",
                        "payload": "Payload_1"
                    }],
                }]
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
function sendFactuurMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Factuur 1:",
                    "subtitle": "Crediteur: Google",
                    "image_url": "https://files.slack.com/files-pri/T03BPURV8-F2MQG7NGL/ancient_invoice.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.oculus.com/",
                        "title": "Factuur inzien"
                    }, {
                        "type": "postback",
                        "title": "Direct betalen",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Fatuur 2:",
                    "subtitle": "Crediteur: Jerom Kok",
                    "image_url": "https://files.slack.com/files-pri/T03BPURV8-F2MQG7NGL/ancient_invoice.jpg",
                    "buttons": [{
                        "type": "postback",
                        "title": "Factuur inzien",
                        "payload": "Payload for second element in a generic bubble"
                    },{
                        "type": "postback",
                        "title": "Direct Betalen",
                        "payload": "Payload for first element in a generic bubble",
                    }]
                }]
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
                            "payload": "Testresultaten"
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

function sendGenericMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "First card",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.oculus.com/",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Second card",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
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



