var express = require('express');
var router = express.Router();
var api_key = 'key-d956cf5597f0751aaac1d4593ad6b990';
var domain = 'tival.se';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

/* GET home page. */
router.post('/', function(req, res, next) {

  res.render('index', { title: 'App'});

  var confirmLink = "https://tival.se/#/confirmation/"+req.body.key;

  // Send mail
  var data = {
    from: 'Tival <no-reply@tival.se>',
    to: 'pe_lias@msn.com',
    cc: 'salmin89@hotmail.com',
    subject: 'Tival orderbekräftelse',
    html:"<h1>TIVAL ORDERBEKRÄFTELSE</h1> Ladda ner <a href='"+ confirmLink +"'>bekräftelse</a>"
  };

  mailgun.messages().send(data, function (error, body) {
    console.log(body);
  });

});

module.exports = router;