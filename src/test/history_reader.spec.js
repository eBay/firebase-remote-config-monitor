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
const assert = require('assert');
const historyReader = require('./../history_reader');
const historyCleaner = require('./history_cleaner.spec');
const projectName = "Test";
const otherProjectName = "Test2";
const someConfigText = " { 'this': 'is sweet' }";
const someOtherConfigText = " { 'this': 'is even sweeter' }";

describe('History reader tests', function() {

  after(function() {
      historyCleaner.cleanup([projectName, otherProjectName]);
  });

  beforeEach(function() {
    historyCleaner.cleanup([projectName, otherProjectName]);
  });

  it('should return empty results for reading history for new project', function() {
    assert.equal("", historyReader.readLastConfig(projectName));
  });

  it('should return contents of saved file when read for project', function() {
    historyReader.saveConfig(projectName, someConfigText)
    assert.equal(someConfigText, historyReader.readLastConfig(projectName));
  });

  it('should return only history for given project', function() {
    historyReader.saveConfig(projectName, someConfigText)
    historyReader.saveConfig(otherProjectName, someOtherConfigText)
    assert.equal(someConfigText, historyReader.readLastConfig(projectName));
    assert.equal(someOtherConfigText, historyReader.readLastConfig(otherProjectName));
  });

  it('should return most recent history for project', function(done) {
    historyReader.saveConfig(projectName, someConfigText)
    setTimeout(() => { // add a slight delay to ensure the 2nd file has a later timestamp than the 1st
      historyReader.saveConfig(projectName, someOtherConfigText);
      assert.equal(someOtherConfigText, historyReader.readLastConfig(projectName));
      done();
    }, 10);
  });
});
