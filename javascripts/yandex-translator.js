/*
export ROCKETCHAT_URL=export ROCKETCHAT_URL=https://ear-hotchat2.herokuapp.com:443
export ROCKETCHAT_ROOM=''
export LISTEN_ON_ALL_PUBLIC=true
export RESPOND_TO_DM=true
export ROCKETCHAT_PASSWORD=translator
export ROCKETCHAT_AUTH=password
export ROCKETCHAT_USESSL=true
export ROCKETCHAT_USER=translator
export YANDEX_TRANSLATE_API_KEY=trnsl.1.1.20180516T174613Z.66b4fcd2bcaf40b3.2b0cea996df5d603a1c869878d57be498bbe51eb
*/

'use strict';

function yandexTranslate (robot) {
  var pattern = '(?!(@[a-z]*)) (.*)'
  var rparts = new RegExp(pattern, 'i');

  robot.respond(rparts, request);

  function request (command) {
    var input = command.match[2].trim();

    // Query to detect which language the message is in, either spanish or english
    var q_detect = {
      key: process.env.YANDEX_TRANSLATE_API_KEY,
      text: input,
      hint: ['es', 'en']
    };

    command
      .http('https://translate.yandex.net/api/v1.5/tr.json/detect')
      .query(q_detect)
      .header('User-Agent', 'Mozilla/5.0')
      .get()(detect);

    function detect (err, res, body) {
      var parsed = parse(body);
      if (parsed) {
        console.log("this is the parsed body: " + JSON.stringify(parsed));
        var origin = parsed.lang;
      } else {
        command.send("Sorry, could not detect the language of origin.");
      }

      var target = ( origin == 'en' ? 'es' : 'en');
      var lang = origin + '-' + target
      var q = {
        key: process.env.YANDEX_TRANSLATE_API_KEY,
        lang: lang,
        text: input
      };

      command
        .http('https://translate.yandex.net/api/v1.5/tr.json/translate')
        .query(q)
        .header('User-Agent', 'Mozilla/5.0')
        .get()(response);
    }

    function response (err, res, body) {
      var parsed = parse(body);
      if (parsed) {
        command.send(parsed.text);
      }
    }
  }
}

function parse (json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return { text: 'No.' };
  }
}

module.exports = yandexTranslate;
