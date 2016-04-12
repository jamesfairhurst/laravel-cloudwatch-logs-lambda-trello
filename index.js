var zlib = require('zlib');
var https = require('https');
var querystring = require('querystring');
var trelloApiKey, trelloToken, trelloListId, totalRequests, completedRequests;

trelloApiKey = '';
trelloToken  = '';
trelloListId = '';

function processLogEvent(logEvent, context) {
    var date = new Date(logEvent.timestamp);

    // Nasty way to grab log type & message (need to learn regular expressions!!)
    var split1 = logEvent.message.split(']');
    var split2 = split1[1].trim().split(':');
    var split3 = split2[0].split('.');

    var logTitle = split2[0].trim();
    var logMessage = logEvent.message.split('\n')[0].trim();
    var logType = split3[1];

    postToTrello(logTitle, logMessage, logType, context);
}

function postToTrello(logTitle, logMessage, logType, context) {
    var payloadStr = {
        "idList": trelloListId,
        "name": logMessage,
        "due": null,
        "urlSource": null,
    };

    var postData = querystring.stringify(payloadStr);

    var options = {
        hostname: 'api.trello.com',
        port: 443,
        path: '/1/cards?key=' + trelloApiKey + '&token=' + trelloToken,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    };

    var postReq = https.request(options, function(res) {
        var chunks = [];
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            return chunks.push(chunk);
        });
        res.on('end', function() {
            var body = chunks.join('');

            if (res.statusCode < 400) {
                console.info('Message posted successfully');
            } else if (res.statusCode < 500) {
                console.error("Error posting message to Trello API: " + res.statusCode + " - " + res.statusMessage);
            } else {
                console.error("Server error when processing message: " + res.statusCode + " - " + res.statusMessage);
            }

            if (completedRequests++ == totalRequests - 1) {
                context.succeed('DONE');
            }
        });
        return res;
    });

    postReq.write(postData);
    postReq.end();
}

exports.handler = function(event, context) {
    var payload = new Buffer(event.awslogs.data, 'base64');
    zlib.gunzip(payload, function(e, result) {
        if (e) {
            context.fail(e);
        } else {
            result = JSON.parse(result.toString('utf8'));
            console.log("Decoded payload: ", JSON.stringify(result));

            completedRequests = 0;
            totalRequests = result.logEvents.length;

            result.logEvents.forEach(function (logEvent) {
                processLogEvent(logEvent, context);
            });
        }
    });
};