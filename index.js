// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Google APIs client library used to call Google Drive
var google = require('googleapis');

// Google Auth Library for Node.js
var googleAuth = require('google-auth-library');

// Request is designed to be the simplest way possible to make http calls
var request = require('request');
var express = require('express');
var app = express();
const path =require(path);
app.use('/node_modules',express.static(path.join(__dirname,'/node_modules')));

// our cloud function
// Takes a url, token and filename and fetches the file adding to Google Drive returning the file id
// More info on HTTP Triggers https://firebase.google.com/docs/functions/http-events
exports.answerTheFetch = functions.https.onRequest((req, res) => {

	var token = req.query.token;
	var filename = req.query.filename || "temp_file";

	// writing to the Firebase log https://firebase.google.com/docs/functions/writing-and-viewing-logs
	console.log(filename);

	// handling auth to write file to Drive
	var auth = new googleAuth();
	var oauth2Client = new auth.OAuth2();
	oauth2Client.setCredentials({
		access_token: token
	});

	// setting Drive access
	var drive = google.drive('v3');

	var media = {
		body: request(req.query.url)  //stream!
	};

	// create file on Drive
	drive.files.create({
			resource: {'name': filename},
			media: media,
			fields: 'id',
			auth: oauth2Client
		}, function(err, file) {
			if (err) {
				// Handle error
				console.log(err);
				res.send(err);
			} else {
				res.send(JSON.stringify({
					id: file.id
				}));
			}
	});
});

// [START addMessage]
// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
// [START addMessageTrigger]
exports.addMessage = functions.https.onRequest((req, res) => {
// [END addMessageTrigger]
  // Grab the text parameter.
  const original = req.query.text;
  // [START adminSdkPush]
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  return admin.database().ref('/messages').push({original: original}).then((snapshot) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    return res.redirect(303, snapshot.ref.toString());
  });
  // [END adminSdkPush]
});
// [END addMessage]


// [START makeUppercase]
// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
    .onCreate((snapshot, context) => {
      // Grab the current value of what was written to the Realtime Database.
      const original = snapshot.val();
      console.log('Uppercasing', context.params.pushId, original);
      const uppercase = original.toUpperCase();
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
      return snapshot.ref.parent.child('uppercase').set(uppercase);
    });
// [END makeUppercase]
// [END all]
