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
const yellow = "#DDA511";
const red = "#DD2222";
const green = "#22DD22";

const slackPoster = function() {
  var self = {};

  self.postResult = function(project, diffs, slackUrl) {
    if (!diffs) {
      return
    }
    if (diffs.isNewProject) {
      postMonitoringBegun(project, slackUrl);
    } else if (diffs && diffs.length > 0) {
      postDiffs(project, diffs, slackUrl);
    }
  };

  function postDiffs(project, diffs, slackUrl) {
    var attachments = diffs.map(createSlackAttachment);
    const postPayload = {
      text: "*" + project.name + "* had " + diffs.length + " change" + (diffs.length > 1 ? "s" : "") + " in firebase console: https://console.firebase.google.com/project/" + project.id,
      attachments: attachments
    };

    sendToSlack(slackUrl, postPayload)
  }

  function postMonitoringBegun(project, slackUrl) {
    const postPayload = {
      text: "Change monitoring begun for " + project.name + " in firebase console: https://console.firebase.google.com/project/" + project.id
    };

    sendToSlack(slackUrl, postPayload);
  }

  function sendToSlack(slackUrl, payload) {
    request.post(slackUrl,
      {
        form: { payload: JSON.stringify(payload) }
      }, function (error, response, body) {
            if (error || response.statusCode !== 200) {
              console.log(response.statusCode);
              console.log(error);
            }
        }
    );
  }

  function createSlackAttachment(diff) {
    var name;
    var payload;
    if (diff.payload instanceof Array && diff.payload.length > 1) {
      name = diff.payload[0].name;
      diff.payload.forEach(x => delete x["name"])
      payload = "*from*\n" + JSON.stringify(diff.payload[0], null, "\t") + "\n*to*\n" +JSON.stringify(diff.payload[1], null, "\t")
    } else {
      name = diff.payload.name;
      delete diff.payload["name"];
      payload =  JSON.stringify(diff.payload, null, "\t")
    }
    var color = yellow;
    if (diff.type.indexOf("Deleted") >= 0) {
      color = red;
    } else if (diff.type.indexOf("Added") >= 0) {
      color = green;
    }
    return {
      fallback: diff.type,
      color: color,
      pretext: "*" + diff.type + ": " + name + "*",
      fields: [
        {
          "value": payload
        }
      ]
    };
  }
  return self;
}();

module.exports = slackPoster;
