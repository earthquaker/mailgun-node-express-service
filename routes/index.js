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

    // The confirmation-link
  var confirmLink = "https://tival.se/#/confirmation/"+req.body.projectKey + "/" + req.body.customerKey;

    // References
  var customerInfoRef = firebase.database().ref("projects").child(req.body.projectKey).child("sessionCarts").child(req.body.customerKey);
  var projectSettingsRef = firebase.database().ref("projects").child(req.body.projectKey).child("projectSettings");


  //Globals
  var global = {
    userData: null,
    projectData: null
  };

    // Get Customer info
  customerInfoRef.once("value", function(snapshot) {
    global.userData = snapshot.val();
    onComplete();
  });

    // Get projectSettings info
  projectSettingsRef.once("value", function(snapshot) {
    global.projectData = snapshot.val();
    onComplete();
  });

    // Checks if we have both global dependencies
  function onComplete() {
    if (global.userData && global.projectData)
    {
      createHtml();
    }
  }

    // Creates the whole HTML-body for the email
  function createHtml(){

    var htmlBody = "<h1>Orderbekräftelse</h1>" +
        "<h3>" + global.projectData.projectName + "</h3>" +
        "<br><div><b>Lägenhetsnummer: </b>" + (global.userData.customerInfo.appartmentnumber ? global.userData.customerInfo.appartmentnumber : "")  + "</div>" +
        "<div><b>Upprättad datum:</b> " + (global.userData.customerInfo.date ? global.userData.customerInfo.date : "") + "</div>";

    htmlBody += "<br>";
    htmlBody += generateCustomerInfo();

    htmlBody += "<br><br>";
    htmlBody += generateCartSummary();

    htmlBody += "<br><br>";
    htmlBody += "<a href='" + confirmLink + "'>Spara som PDF</a>";
    sendEmail(htmlBody);
  }

    // Generates the whole summary table
    // Returns: the html-string
  function generateCartSummary() {

    var cart = global.userData.cart;
    var body = "";

      // Headings
    body += "<table style='width: 1024px; text-align: left;border-collapse: collapse;'>" +
        "<tr style='border-bottom: 1px solid #000'>" +
        "<th style='width: 25%;'>Tillval</th>" +
        "<th style='width: 50%;'></th>" +
        "<th style='width: 25%;text-align: right;'>Belopp</th>" +
        "</tr>";

      // Each category /Huvudkategori
      // ARRAY
    for (var category in cart) {

      body += "<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
      body += "<tr>";
      body += "<th>" + (cart[category].categoryTitle ? cart[category].categoryTitle : "") + "</th>";
      body += "<th></th>";
      body += "<th></th>";
      body += "</tr>";

        // Each Category Item /Underkategori
        // Array
      for (var categoryItem in cart[category]) {

          //categoryItem == title of the categories
        if (categoryItem != "categoryTitle") {

          body += "<tr>";
            // Category
            body += "<td>" + (cart[category][categoryItem].categoryItemTitle ? cart[category][categoryItem].categoryItemTitle : "") + "</td>";
            // Title
            body += "<td>" + (cart[category][categoryItem].title ? cart[category][categoryItem].title : "") + "</td>";
            // Price
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

    // Generates the customer and company table
    // Returns: the html-string
  function generateCustomerInfo() {

      // This is kaos. Pls no look
      var webadress = global.projectData.companyWebsite ? global.projectData.companyWebsite : "";
      var webadressUrl = global.projectData.companyWebsite ? global.projectData.companyWebsite : "#";
    var body = "<table style='width: 1024px; text-align: left;border-collapse: collapse;'>" +
                  "<tr>" +
                    "<th style='width: 50%;'>Kund</th>" +
                    "<th style='width: 50%;'>" + global.projectData.companyName + "</th>" +
                  "</tr>" +
                  "<tr>" +
                    "<td>" + (global.userData.customerInfo.name ? global.userData.customerInfo.name : "") + "</td>" +
                    "<td>" + (global.projectData.companyStreet ? global.projectData.companyStreet : "") + "</td>" +
                  "</tr>" +
                  "<tr>" +
                    "<td>" + (global.userData.customerInfo.phone ? global.userData.customerInfo.phone : "") + "</td>" +
                    "<td>" + (global.projectData.companyZip && global.projectData.companyCity ? global.projectData.companyZip + " " + global.projectData.companyCity : "") + "</td>" +
                  "</tr>" +
                  "<tr>" +
                    "<td>" + (global.userData.customerInfo.email ? global.userData.customerInfo.email : "") + "</td>" +
                    "<td>" + (global.projectData.companyPhone ? global.projectData.companyPhone : "") + "</td>" +
                  "</tr>" +
                  "<tr>" +
                    "<td></td>" +
                    "<td><a href='" + webadressUrl + "'></a>" + webadress + "</td>" +
                  "</tr>" +
                "</table>";
    return body;
  }


    // Sets the email
  function sendEmail(htmlBody) {
    var data = {
      from: 'Tival <no-reply@tival.se>',
      to: global.userData.customerInfo.email,
      bcc: global.projectData.projectEmail,
      subject: global.projectData.projectName + ' orderbekräftelse',
      html: htmlBody
    };

    mailgun.messages().send(data, function (error, body) {
      console.log(body);

        //Spara i firebase, typ
    });
  }

});

module.exports = router;