'use strict'

var Config = require('./config')
var wit = require('./services/wit').getWit()

// LETS SAVE USER SESSIONS
var sessions = {}

var findOrCreateSession = function (fbid) {
  var sessionId

  // DOES USER SESSION ALREADY EXIST?
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbid === fbid) {
      // YUP
      sessionId = k
    }
  })

  // No session so we will create one
  if (!sessionId) {
    sessionId = new Date().toISOString()
    sessions[sessionId] = {
      fbid: fbid,
      context: {
        _fbid_: fbid
      }
    }
  }

  return sessionId
}

var read = function (sender, message, reply)
{ 	console.log('read')
	if (message === 'hello') {
		// Let's reply back hello
		message = 'Hello! I am VrendlyBot. How can i help you today? Typ Help for more info.'
		reply(sender, message)
	}
	else if (message === 'yo') {
		// Let's reply back hello
		message = 'Hello! I am VrendlyBot. How can i help you today? Typ Help for more info.'
		reply(sender, message)
	}
	else if (message === 'heey') {
		// Let's reply back hello
		message = 'Hello! I am VrendlyBot. How can i help you today? Typ Help for more info.'
		reply(sender, message)
	}
	else if (message === 'help') {
		// Let's reply back hello
		message = 'Here is some. Try these statements: (FactuurInfo), (DebiteurenInfo), (Betalingen) '
		reply(sender, message)
	}
	else if (message === 'Help') {
		// Let's reply back hello
		message = 'Here is some. Try these statements: (FactuurInfo), (DebiteurenInfo), (Betalingen) '
		reply(sender, message)
	}
	else if (message === 'Bye') {
		// Let's reply back hello
		message = 'Thanks for visiting! Hope to see you again!'
		reply(sender, message)
	}
	else if (message === 'bye') {
		// Let's reply back hello
		message = 'Thanks for visiting! Hope to see you again!'
		reply(sender, message)
	}
	else if (message === 'goodbye') {
		// Let's reply back hello
		message = 'Thanks for visiting! Hope to see you again!'
		reply(sender, message)
	}
	else if (message === 'Goodbye') {
		// Let's reply back hello
		message = 'Thanks for visiting! Hope to see you again!'
		reply(sender, message)
	}
	else if (message === 'see you later') {
		// Let's reply back hello
		message = 'Thanks for visiting! Hope to see you again!'
		reply(sender, message)
	}
	else if (message === 'See you later') {
		// Let's reply back hello
		message = 'Thanks for visiting! Hope to see you again!'
		reply(sender, message)
	}
	else {
		// Let's find the user
		var sessionId = findOrCreateSession(sender)
		// Let's forward the message to the Wit.ai bot engine
		// This will run all actions until there are no more actions left to do
		wit.runActions(
			sessionId, // the user's current session by id
			message,  // the user's message
			sessions[sessionId].context, // the user's session state
			function (error, context) { // callback
			if (error) {
				console.log('oops!', error)
			} else {
				// Wit.ai ran all the actions
				// Now it needs more messages
				console.log('Waiting for further messages')

				// Based on the session state, you might want to reset the session
				// Example:
				// if (context['done']) {
				// 	delete sessions[sessionId]
				// }

				// Updating the user's current session state
				sessions[sessionId].context = context
			}
		})
	}
};


	module.exports = {
	findOrCreateSession: findOrCreateSession,
	read: read,
};



