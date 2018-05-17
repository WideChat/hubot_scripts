var apiai = require('apiai');
var app = apiai(process.env.API_AI_CLIENT_ACCESS_TOKEN);

module.exports = (robot) => {
    robot.respond(/(.*)/i, function(msg) {
        var query = msg.match[1];
        var sessionId = "session-" + msg.message.user["id"];
        var request = app.textRequest(query, {
          'sessionId': sessionId
        });

        request.on('response', function(response) {
            //console.log(response);
            //console.log(response.result.fulfillment.speech);
            console.log(response.result.metadata.intentName);

            // Text
            if (response.result.fulfillment.speech) {
                msg.send(response.result.fulfillment.speech);
            }

            var messages = response.result.fulfillment.messages;
            // Attachments and richMessages
            for (var i = 0; i < messages.length; i++) {
                if (messages[i].payload && messages[i].payload.attachments) {
                    robot.adapter.customMessage({
                        rid: msg.message.user["roomID"],
                        attachments: messages[i].payload.attachments,
                    })
                }
                // Rich messages
                if (messages[i].payload && messages[i].payload.richMessage) {
                    robot.adapter.customMessage({
                        rid: msg.message.user["roomID"],
                        richMessage: messages[i].payload.richMessage
                    })
                }
            }

        });

        request.on('error', function(error) {
        console.log(error);
        });

        request.end();
    })
}
