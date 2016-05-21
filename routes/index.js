var express = require('express');
var router = express.Router();
var api_key = 'key-d956cf5597f0751aaac1d4593ad6b990';
var domain = 'sandboxae45f31018c7420aa1a8f72e463e52c8.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });



});

module.exports = router;