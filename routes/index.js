var express = require('express');
var router = express.Router();
var api_key = 'key-d956cf5597f0751aaac1d4593ad6b990';
var domain = 'tival.se';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var fs = require('fs');
var pdfkit = require('pdfkit');

/* GET home page. */
router.post('/', function(req, res, next) {

  res.render('index', { title: 'App'});

  // Create PDF
  doc = new pdfkit;
  doc.pipe(fs.createWriteStream(req.body.key+'pdf'));

  doc.fontsize(15).text("Test PDF", 50, 50);
  doc.text("Test Test Test...", {
    width:410,
    align:left
  });
  doc.end();

  // Send mail
  var data = {
    from: 'Tival <no-reply@tival.se>',
    to: 'pe_lias@msn.com',
    cc: 'salmin89@hotmail.com',
    subject: 'Tival orderbekräftelse',
    html:"<h1>TIVAL TITLE</h1><p>"+req.body.key+"<p>"
  };

  mailgun.messages().send(data, function (error, body) {
    console.log(body);
  });

});

module.exports = router;