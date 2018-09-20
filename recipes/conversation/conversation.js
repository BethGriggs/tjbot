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
const tjConfig = {};

// instantiate our TJBot!
const tj = new TJBot(hardware, tjConfig, credentials);

// Twitter
const Twitter = require('twitter');

const twitterClient = new Twitter(config.twitter);

const params = {
  "user_id": "797869498757955589", // @tinycarebot user_id
  "count": 1,
  "exclude_replies": true
}

function getSaying() {
  let twitterSpeak = false;

  twitterClient.get('statuses/user_timeline', params, function(err, tweets, response) {
    if (!err && tweets.length > 0) {
      params.since_id = tweets[0].id;
      twitterSpeak = true;
      console.log(tweets[0].text.split(':')[1].trim());
      tj.speak(tweets[0].text.split(':')[1].trim());
    }

    if (!twitterSpeak) {
      const saying = getRandomSaying();
      console.log(saying)
      tj.speak(saying);
    }
  });
}

getSaying();

const frequency = 1000 * 60 * 2 // Milliseconds * Seconds * Minutes
setInterval(getSaying, frequency);

function getRandomSaying() {
  const sayingTypes = Object.keys(sayings);
  const type = Math.floor(Math.random() * sayingTypes.length);
  return sayings[sayingTypes[type]][Math.floor(Math.random() * Object.keys(sayings[sayingTypes[type]]).length)];
}
