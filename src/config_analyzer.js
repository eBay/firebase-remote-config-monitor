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

const firebaseDiff = require('./diff_config.js');
const firebaseHistory = require('./history_reader.js');

const configProcessor = function() {
  var self = {}

  self.findDiffs = function (project, configText) {
    const config = JSON.parse(configText)

    // no conditions or properties found, so do not save this config
    if (config.conditions.length > 0 || config.parameters.length > 0) {
       return compareAndSaveNewConfig(project, configText);
    }
    return [];
  }

  function compareAndSaveNewConfig(project, configText) {
    const lastConfigText = firebaseHistory.readLastConfig(project.name);
    //text is unchanged so short circuit and don't save the new config.
    if (lastConfigText === configText) {
      return [];
    }

    var response = [];
    if (lastConfigText) {
      response = firebaseDiff.findDifferences(JSON.parse(lastConfigText), JSON.parse(configText));
    } else {
      response.isNewProject = true;
    }
    firebaseHistory.saveConfig(project.name, configText);
    return response;
  }

  return self;
}();

module.exports = configProcessor;
