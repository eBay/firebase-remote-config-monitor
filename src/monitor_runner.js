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

const configReader = require("./config_reader.js")
const firebaseRetriever = require('./firebase_retriever.js');
const configAnalyzer = require('./config_analyzer.js');
const slackPoster = require('./slack_poster.js');

const monitorRunner = function() {
  var self = {};
  self.run = async function() {
    var configuration = configReader.readConfig();
    const projects = configuration.projects;

    for(var i = 0; i < projects.length; i++) {
      try {

        project = projects[i];
        var remoteConfig = await firebaseRetriever.retrieveData(project);
        var diffResults = configAnalyzer.findDiffs(project, remoteConfig);
        slackPoster.postResult(project, diffResults, configuration.slack.webHookUrl);
      } catch (e) {
        console.log("error encountered for project " + project.name + "\n" + e);
      }
    }
  }
  return self;
}();

module.exports = monitorRunner;
