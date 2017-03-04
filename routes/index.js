var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

router.post('/receive', function(req, res) {
	console.log(req.body);
    var twilio = require('twilio');
    var twiml = new twilio.TwimlResponse();
    twiml.message('The Robots are coming! Head for the hills!');
    res.writeHead(200, {
        'Content-Type': 'text/xml'
    });
    res.end(twiml.toString());
});

router.get('/send', function(req, res, next) {
    var accountSid = 'AC997a7365d51e302b0ac56c961df9a625'; // Your Account SID from www.twilio.com/console
    var authToken = '9fcf4b49fab472543ed5950509246ed3'; // Your Auth Token from www.twilio.com/console

    var twilio = require('twilio');
    var client = new twilio.RestClient(accountSid, authToken);

    client.messages.create({
        body: 'Hello from Node',
        to: '+14153164883', // Text this number
        from: '+15042266869 ' // From a valid Twilio number
    }, function(err, message) {
        console.log(message.sid);
    });
});

module.exports = router;