var express = require('express');
var router = express.Router();
var api_key = 'key-d956cf5597f0751aaac1d4593ad6b990';
var domain = 'tival.se';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
//
// var StringBuilder = require('../services/stringBuilder.js');

var formatPrice = require('../services/formatPrice.js');

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


  //Globals
  var global = {
    userData: null,
    projectData: null
  };


  customerInfoRef.once("value", function(snapshot) {
    global.userData = snapshot.val();
    onComplete();
  });

  projectSettingsRef.once("value", function(snapshot) {
    global.projectData = snapshot.val();
    onComplete();
  });

  function onComplete() {
    if (global.userData && global.projectData)
    {
      createHtml();
    }
  }

  function createHtml(){

    var htmlBody = generateCartSummary();


    sendEmail(htmlBody);
  }

  function generateCartSummary() {

    var cart = global.userData.cart;
    var body = "";

    body += "<table style='width: 1024px; text-align: left;border-collapse: collapse;'>" +
        "<tr style='border-bottom: 1px solid #000'>" +
        "<th style='width: 25%;'>Tillval</th>" +
        "<th style='width: 50%;'></th>" +
        "<th style='width: 25%;text-align: right;'>Belopp</th>" +
        "</tr>";

    for (var category in cart) {

      body += "<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
      body += "<tr>";
      body += "<th>" + cart[category].categoryTitle + "</th>";
      body += "<th></th>";
      body += "<th></th>";
      body += "</tr>";

      for (var categoryItem in cart[category]) {

        if (categoryItem != "categoryTitle") {

          body += "<tr>";
          body += "<td>" + cart[category][categoryItem].categoryItemTitle + "</td>";
          body += "<td>" + cart[category][categoryItem].title + "</td>";
          body += "<td style='text-align: right;'>" + formatPrice(cart[category][categoryItem].price) + " kr</td>";
          body += "<tr>";

        }
      }
    }

    body += "<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
    body += "<tr style='border-top: 1px solid #000'>" +
        "<td></td>" +
        "<td style='text-align: right;'><b>Total inklusive moms: </b></td>" +
        "<td style='text-align: right;'>" + formatPrice(global.userData.total) + " kr</td>" +
        "</tr>" +
        "</table>";

    return body;
  }

  function sendEmail(htmlBody) {
    var data = {
      from: 'Tival <no-reply@tival.se>',
      to: global.userData.customerInfo.email,
      cc: global.projectData.projectEmail,
      subject: global.projectData.projectName + ' orderbekräftelse',
      html: htmlBody
    };

    mailgun.messages().send(data, function (error, body) {
      console.log(body);
    });
  }

});

module.exports = router;