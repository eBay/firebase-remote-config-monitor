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

const firebaseDiff = require('./../diff_config.js');
const firebaseHistory = require('./../history_reader.js');
const configAnalyzer = require('./../config_analyzer.js');
const assert = require('assert');
const sinon = require('sinon');


describe('Config Analyzer tests', function() {
  var diffStub;
  var historyReadStub;
  var historySaveStub;

  beforeEach(function() {
    historySaveStub = sinon.stub(firebaseHistory, "saveConfig");
    historyReadStub = sinon.stub(firebaseHistory, "readLastConfig");
    diffStub = sinon.stub(firebaseDiff, "findDifferences");
  });

  afterEach(function(){
    firebaseHistory.saveConfig.restore();
    firebaseHistory.readLastConfig.restore();
    firebaseDiff.findDifferences.restore();
  });

  it('should return empty, and not save, if no conditions or parameters found', function() {
    const results = configAnalyzer.findDiffs(project, emptyConfig);
    assert.equal(0, results.length);
    sinon.assert.notCalled(historySaveStub)
  });

  it('should return empty, and not save, if config identical to last history', function() {
    historyReadStub.returns(someConfig)
    const results = configAnalyzer.findDiffs(project, someConfig);
    assert.equal(0, results.length);
    sinon.assert.notCalled(historySaveStub)
  });

  it('should return empty array with isNewProject set to true and save if no config history found,', function() {
    const results = configAnalyzer.findDiffs(project, someConfig);
    assert.equal(0, results.length);
    assert(results.isNewProject);
    sinon.assert.calledOnce(historySaveStub);
    sinon.assert.calledWith(historySaveStub, project.name, someConfig);
  });

  it('should send in the parsed config values to the find differences function', function() {
    historyReadStub.returns(someOtherConfig)
    configAnalyzer.findDiffs(project, someConfig);
    sinon.assert.calledOnce(diffStub);
    sinon.assert.calledWith(diffStub, JSON.parse(someOtherConfig), JSON.parse(someConfig));
  });

  it('should return the response of the diff and save file when differences found', function() {
    historyReadStub.returns(someOtherConfig)
    diffStub.returns(someDiffs)
    var results = configAnalyzer.findDiffs(project, someConfig);
    assert.equal(someDiffs, results);
    sinon.assert.calledOnce(historySaveStub);
    sinon.assert.calledWith(historySaveStub, project.name, someConfig);
  });


});


const project =  { name: 'Test Project' };
const someCondition = { name: "someCondition", components: [] };
const someCondition1 = { name: "someCondition1", components: [] };

const someParameter = { name: "someParam", values: [] };
const someParameter1 = { name: "someParam1", values: [] };

const emptyConfig = JSON.stringify({ conditions: [], parameters: [] });
const someConfig = JSON.stringify({
  conditions: [someCondition, someCondition1],
  parameters: [someParameter, someParameter1] });

const someOtherConfig = JSON.stringify({
  conditions: [someCondition],
  parameters: [someParameter, someParameter1] });

const someDiffs = ["diff1", "diff2"];
