var express = require('express');
var router = express.Router();
var api_key = 'key-d956cf5597f0751aaac1d4593ad6b990';
var domain = 'tival.se';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var StringBuilder = require('../services/stringBuilder.js');

var firebase = require('firebase');
var FBconfig = {
  apiKey: "AIzaSyD5B_DssWCtBgWn_2-Cy0LhTZGeErAYAJE",
  authDomain: "100meter.firebaseapp.com",
  databaseURL: "https://100meter.firebaseio.com",
  storageBucket: "project-8799195801841300390.appspot.com",
};
firebase.initializeApp(FBconfig);


/* GET home page. */
router.post('/', function(req, res, next) {

  res.render('index', { title: 'App'});

  var confirmLink = "https://tival.se/#/confirmation/"+req.body.projectKey + "/" + req.body.customerKey;

  var customerInfoRef = firebase.database().ref("projects").child(req.body.projectKey).child("sessionCarts").child(req.body.customerKey);
  var projectSettingsRef = firebase.database().ref("projects").child(req.body.projectKey).child("projectSettings");

  var userData = null;
  var projectData = null;

  customerInfoRef.once("value", function(snapshot) {
    userData = snapshot.val();
    onComplete();
  });

  projectSettingsRef.once("value", function(snapshot) {
    projectData = snapshot.val();
    onComplete();
  });

  function onComplete() {
    if (userData && projectData)
    {
      createHtml(userData, projectData);
    }
  }

  function createHtml(userData, projectData){
    var body = new StringBuilder();


    var user = userData.customerInfo;
    var cart = userData.cart;

    //sendEmail(user, body);
  }

  function sendEmail(user, body) {

    console.log(user.email);
    var data = {
      from: 'Tival <no-reply@tival.se>',
      to: user.email,
      cc: 'salmin89@hotmail.com;pe_lias@msn.com',
      subject: 'Tival orderbekräftelse',
      html:"<h1>TIVAL ORDERBEKRÄFTELSE</h1> Ladda ner <a href='"+ confirmLink +"'>bekräftelse</a>"
    };

    mailgun.messages().send(data, function (error, body) {
      console.log(body);
    });
  }

});

module.exports = router;