const functions = require('firebase-functions');

var express = require('express'); // web server application
var app = express(); // webapp
app.use(express.static('public')); // find pages in public directory

const firebase = require("firebase");
// Required for side-effects
require("firebase/database");

// Initialize Firebase
var config = {
  apiKey: API_KEY,
  authDomain: "bookalive-270fb.firebaseapp.com",
  databaseURL: "https://bookalive-270fb.firebaseio.com",
  projectId: "bookalive-270fb",
  storageBucket: "bookalive-270fb.appspot.com",
  messagingSenderId: "360140283914"
};
firebase.initializeApp(config);

var db = firebase.database();

app.get('/students', function(req, res) {
  db.ref('/students').once('value').then(function(snapshot) {
    res.send(snapshot.val());
  });
})

app.get('/studentScores/:studentId', function(req, res) {
  db.ref('/quizResults/' + req.params.studentId).once('value').then(function(snapshot) {
    res.send(snapshot.val());
  });
})

exports.app = functions.https.onRequest(app);
