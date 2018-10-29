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

const firebaseRetriever = require('./firebase_retriever.js');
const slackPoster = require('./slack_poster.js');
const firebaseDiff = require('./rc_config_diff.js');

const monitorRunner = function() {
  var self = {};
  self.run = async function(project, version, updateUser) {
     try {
      if (version === 1) {
        slackPoster.postFirstVersionSeen(project)
      } else {
        const newConfig = await firebaseRetriever.retrieveData(project, version);
        const oldConfig = await firebaseRetriever.retrieveData(project, version - 1);
        const diffResults = firebaseDiff.findDifferences(JSON.parse(oldConfig), JSON.parse(newConfig));
        slackPoster.postDiffs(project, version, updateUser, diffResults);
      }
    } catch (e) {
      console.log("error encountered:\n" + e);
    }
  }
  return self;
}();

module.exports = monitorRunner;
