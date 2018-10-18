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

const fs = require('fs');

const historyReader = function() {
  var self = {};

  self.saveConfig = function (projectName, configText) {
    const projectDir = getDir(projectName)
    const fileName = projectDir + new Date().toISOString() + ".json";
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir);
    }
    fs.writeFileSync(fileName, configText);
  };

  self.readLastConfig = function(projectName) {
    const projectDir = getDir(projectName);
    if (fs.existsSync(projectDir)) {
      var files = fs.readdirSync(projectDir);
      files.sort(function(a, b) {
               return fs.statSync(projectDir + b).mtime.getTime() -
                      fs.statSync(projectDir + a).mtime.getTime();
      });
      if (files.length > 0) {
         return fs.readFileSync(projectDir + files[0], 'utf8');
      }
    }
    return "";
  }

  function getDir(name) {
    if (!fs.existsSync("./history")) {
      fs.mkdirSync("./history");
    }
    return "./history/" + name + "/";
  }

  return self;
}();

module.exports = historyReader;
