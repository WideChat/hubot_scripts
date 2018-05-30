/*
export ROCKETCHAT_URL=export ROCKETCHAT_URL=https://ear-hotchat2.herokuapp.com:443
export ROCKETCHAT_ROOM=''
export LISTEN_ON_ALL_PUBLIC=false
export RESPOND_TO_DM=true
export ROCKETCHAT_PASSWORD=vera
export ROCKETCHAT_AUTH=password
export API_AI_CLIENT_ACCESS_TOKEN=158f65db537f45c8aa94e3a92f913438
export ROCKETCHAT_USESSL=true
export ROCKETCHAT_USER=vera
*/


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
            // rich messages
            for (var i = 0; i < messages.length; i++) {
                if (messages[i].payload && messages[i].payload.attachments) {
                    robot.adapter.customMessage({
                        rid: msg.message.user["roomID"],
                        attachments: messages[i].payload.attachments,
                    })
                }
                // Rich messages
                if (messages[i].payload && messages[i].payload.type) {
                    robot.adapter.customMessage({
                        rid: msg.message.user["roomID"],
                        payload: messages[i].payload
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
