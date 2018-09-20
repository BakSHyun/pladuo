// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const express = require('express');
var firebase = require('firebase');
const http = require('http');
const urlP = require('url');

var serviceAccount = require("./pladuo-app-firebase-adminsdk-m2jlq-8eccd5eeec.json");
var config = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pladuo-app.firebaseio.com"
};
admin.initializeApp(config);

// var firebaseui = require('firebaseui');
var db = admin.database();
var auth = admin.auth();
var app = express();
var uid = auth.currentUser;

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addSchedule = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  var d = new Date();
  y =  d.getFullYear();
  m = d.getMonth();
  dd = d.getDate();
  today =y+"-"+m+"-"+dd;
  h = d.getHours();
  i = d.getMinutes();
  s = d.getSeconds();
  time_now = h+":"+i+":"+s;
  const dday = y+m+dd+h+i+s;
  const uid = req.query.uid;
  const doctor = req.query.doctor;
  const doctor_id = req.query.doctor_id;
  const s_process = req.query.process;
  const s_state = req.query.state;
  return admin.database().ref('/schedule/private/'+uid+"/"+doctor_id+"/"+dday).push({dday:today,doctor: doctor,doctor_id:doctor_id,process:s_process,state:s_state}).then((snapshot) => {
  // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  return res.redirect(303, snapshot.ref.toString());
});

});
// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  return admin.database().ref('/messages').push({original: original}).then((snapshot) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    return res.redirect(303, snapshot.ref.toString());
  });
});

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
