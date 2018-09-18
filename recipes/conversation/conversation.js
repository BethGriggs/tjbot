/**
 * Copyright 2016-2018 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const TJBot = require('tjbot');
const config = require('./config');
const sayings = require('./sayings.json');

// obtain our credentials from config.js
const credentials = config.credentials;

// hardware capabilities that TJ needs for this recipe
const hardware = ['speaker'];

// set up TJBot's configuration
const tjConfig = {
  log: {
    level: 'verbose'
  }
};

// instantiate our TJBot!
const tj = new TJBot(hardware, tjConfig, credentials);

// Twitter
const Twitter = require('twitter');

const twitter = new Twitter({
  consumer_key: "",
  consumer_secret: "",
  access_token_key: "",
  access_token_secret: ""
});

const tinyCareBotId = "797869498757955589";

let since_id = "";
let params = {
  "user_id": tinyCareBotId,
  "count": 1,
  "exclude_replies": true
}

function getSaying() {
  let twitterSpeak = false;

  twitter.get('statuses/user_timeline', params, function(err, tweets, response) {
    if (!err && tweets.length > 0) {
      params.since_id = tweets[0].id;
      twitterSpeak = true;
      console.log(tweets[0].text.split(':')[1].trim());
      //tj.speak(tweets[0].text.split(':')[1].trim());
    }

    if (!twitterSpeak) {
      const sayingTypes = Object.keys(sayings);
      let type = Math.floor(Math.random() * Object.keys(sayings).length);

      let saying = sayings[sayingTypes[type]][Math.floor(Math.random() * Object.keys(sayings[sayingTypes[type]]).length)];
      console.log(saying)
      //tj.speak(saying);
    }
  });
}

setInterval(getSaying, 5000);
