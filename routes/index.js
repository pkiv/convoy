var express = require('express');
var Uber = require('node-uber');
var twilio = require('twilio');
var router = express.Router();
var uber = new Uber({
    client_id: 'otcRybADJ6LvGTutss5Mm911lWxd1FFo',
    client_secret: 'J6ywf_hsnnGB8X_spvhqA86d83jVpTXpKnqqADAT',
    server_token: 'BO8O8N-vEFR2pduLVihzOjxBko3b7ZHIUyoSh_7j',
    redirect_uri: 'https://087af77a.ngrok.io/api/callback',
    name: 'Convoy',
    language: 'en_US', // optional, defaults to en_US
    sandbox: true // optional, defaults to false
});

router.get('/api/login', function(request, response) {
    var url = uber.getAuthorizeUrl(['history', 'profile', 'request', 'places']);
    response.redirect(url);
});

router.get('/api/callback', function(request, response) {
    uber.authorization({
        authorization_code: request.query.code
    }, function(err, access_token, refresh_token) {
        if (err) {
            console.error(err);
        } else {
            // store the user id and associated access token 
            // redirect the user back to your actual app 
            //response.redirect('/web/index.html');
            console.log(access_token);
            console.log(refresh_token);
            requestUber(access_token, refresh_token);
            response.send("OK");
        }
    });
});

var requestUber = function(access_token, refresh_token) {
    console.log("Reqeust");
    /*uber.user.getProfile(function(err, res) {
        if (err) console.log(err);
        else console.log(res);
    });*/
}

// Data structures
var numbers = {};
var convoys = {};

// Constructors for data structure items
function number() {
    this.state = "start";
    this.convoyId = null;
}

function convoy(commander) {
    this.commander = commander;
    this.members = [];
    this.cars = {};
    this.src = "";
    this.dest = "";
}

function car(captain) {
    this.captain = captain;
    this.riders = [];
    this.uber = null;
}

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
    // Your Account SID from www.twilio.com/console
    var accountSid = 'AC997a7365d51e302b0ac56c961df9a625';
    // Your Auth Token from www.twilio.com/console
    var authToken = '9fcf4b49fab472543ed5950509246ed3';

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

router.post('/convoy', function(req, res) {
    var phone = req.body.From;
    var msg = req.body.Body;
    if (!numbers[phone]) numbers[phone] = new number();
    var user = numbers[phone];
    switch (user.state) {
        case "start":
            break;
        default:
            break;
    }
});

// Put abstracted functions here
var getConvoySrc = function(convoy) {};

var getConvoyDest = function(convoy) {};


// Put helper functions here
var getOptCode = function(msg) {
    var optCode;

    switch (msg) {
        case "convoy", "to":
            optCode = 1;
            break;
        case "from":
            optCode = 2;
            break;
        case "yes":
            optCode = 3;
            break;
        case "no":
            optCode = 4;
            break;
        case "done":
            optCode = 5;
            break;
        default:
            {
                optCode = -1;
                break;
            }
    }

    return optCode;
};


var parseConvoy = function(tokenizeResponse) {
    var destination = "";
    var starting = "";
    var trigger = -1;

    for (var i = 0; i < tokenizeResponse.length; i++) {

        if (tokenizeResponse[i] === "from") {
            i++;
            trigger = 1;
        } else if (tokenizeResponse[i] === "to") {
            i++;
            trigger = 0;
        }
        if (trigger === 0) {
            destination += tokenizeResponse[i] + " ";
        } else if (trigger === 1) {
            starting += tokenizeResponse[i] + " ";;
        }
    }

    var convoy = {
        start: starting,
        end: destination
    }

    if (trigger === -1) {
        console.log("Could not find 'from' or 'convoy to'");
    } else {
        return convoy;
    }

};



// Get first word helper

module.exports = router;