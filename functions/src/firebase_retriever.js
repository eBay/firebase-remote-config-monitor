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
const admin = require('firebase-admin');
const request = require('request');
const { google } = require('googleapis');

const firebaseRetriever = function() {
  var self = {};

  self.retrieveData = async function(project, version) {
      const token = await getAccessToken();
      return await getRemoteConfigData(project, token.access_token, version);
  };

  function getRemoteConfigData(project, token, version) {
    return new Promise((resolve, reject) => {
      var url = `https://firebaseremoteconfig.googleapis.com/v1/projects/${project.projectId}/remoteConfig?versionNumber=${version}`
      request.get(url, (error, response, body) => {
        if (body && response.statusCode >= 200 && response.statusCode < 300) {
            resolve(body);
          } else if (body) {
            console.log("rejected token " + JSON.stringify(token));
            reject(body);
          } else {
            reject(error);
          }
      }).auth(null, null, true, token)
    });
  }

  function getAccessToken() {
    return admin.credential
       .applicationDefault()
       .getAccessToken()
  }

  return self;
}();

module.exports = firebaseRetriever;
