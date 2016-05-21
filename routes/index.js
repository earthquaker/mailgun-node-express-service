var express = require('express');
var router = express.Router();
var api_key = 'key-d956cf5597f0751aaac1d4593ad6b990';
var domain = 'sandboxae45f31018c7420aa1a8f72e463e52c8.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: req.config.data.appartmentnumber });

  var data = {
    from: 'Tival <no-reply@tival.se>',
    to: 'pe_lias@msn.com',
    subject: 'Tival orderbekräftelse1',
    text: req.config.data.appartmentnumber || ''
  };

  mailgun.messages().send(data, function (error, body) {
    console.log(body);
  });

});

module.exports = router;