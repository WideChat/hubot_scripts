'use strict';

var languages = [
  'af',
  'sq',
  'ar',
  'az',
  'eu',
  'bn',
  'be',
  'bg',
  'ca',
  'zh-CN',
  'zh-TW',
  'hr',
  'cs',
  'da',
  'nl',
  'en',
  'eo',
  'et',
  'tl',
  'fi',
  'fr',
  'gl',
  'ka',
  'de',
  'el',
  'gu',
  'ht',
  'iw',
  'hi',
  'hu',
  'is',
  'id',
  'ga',
  'it',
  'ja',
  'kn',
  'ko',
  'la',
  'lv',
  'lt',
  'mk',
  'ms',
  'mt',
  'no',
  'fa',
  'pl',
  'pt',
  'ro',
  'ru',
  'sr',
  'sk',
  'sl',
  'es',
  'sw',
  'sv',
  'ta',
  'te',
  'th',
  'tr',
  'uk',
  'ur',
  'vi',
  'cy',
  'yi'
];

function getCode (language, basic) {
  var lang = (language || '').toLowerCase();
  return languages.indexOf(lang) === -1 ? basic : lang;
}

function yandexTranslate (robot) {
  var choices = languages.sort().join('|');
  var pattern = '' +
    '(?: traducir|traduc[ie]|translate|tr|t)' +
    '(?: (' + choices + '))?' +
    '(?:[\s-]+(' + choices + '))?' +
    '(.*)';

  var testPattern = '(?!(@[a-z]*)) (.*)'
  //var rparts = new RegExp(pattern, 'i');
  var rparts = new RegExp(testPattern, 'gi');

  robot.respond(rparts, request);

  function request (command) {
    //var input = command.match[3].trim();
    var input = command.match[2].trim();
    //var term = '"' + input + '"';
    //var one = command.match[1];
    //var two = command.match[2];
    //var origin = getCode(two ? one : 'auto', 'auto');
    var origin = 'en';
    //var target = getCode(two ? two : one, 'en');
    var target = 'es';
    //var lang = origin === 'auto' ? target : origin + '-' + target;
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