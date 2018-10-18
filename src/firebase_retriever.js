/*
 * Copyright 2018 eBay Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

const request = require('request');
const { google } = require('googleapis');

const firebaseRetriever = function() {
  var self = {};

  self.retrieveData = async function(fbConsoleConfig) {
      console.log('getting data for ' + fbConsoleConfig.name);
      try {
        const token = await getAccessToken(fbConsoleConfig.key)
        return await checkConfigChanges(fbConsoleConfig, token);
      } catch(e) {
          console.log("Error received when retrieving data from firebase\n" + e);
      }
  };

  function checkConfigChanges(consoleConfig, token) {
    return new Promise((resolve, reject) => {
      var url = "https://firebaseremoteconfig.googleapis.com/v1/projects/" + consoleConfig.id + "/remoteConfig"
      request.get(url, (error, response, body) => {
        if (body && response.statusCode >= 200 && response.statusCode < 300) {
            resolve(body);
          } else if (body) {
            reject(body);
          } else {
            reject(error);
          }
      }).auth(null, null, true, token)
    });
  }

  function getAccessToken(key) {
    return new Promise((resolve, reject) => {
      var jwtClient = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        ["https://www.googleapis.com/auth/firebase.remoteconfig"],
        null
      );
      jwtClient.authorize(function(err, tokens) {
        if (err) {
          reject(err);
          return;
        }
        resolve(tokens.access_token);
      });
    });
  }

  return self;
}();

module.exports = firebaseRetriever;
