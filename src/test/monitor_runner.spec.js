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

const configReader = require("./../config_reader.js");
const firebaseRetriever = require('./../firebase_retriever.js');
const configAnalyzer = require('./../config_analyzer.js');
const slackPoster = require('./../slack_poster.js');
const historyCleaner = require('./history_cleaner.spec');
const runner = require('./../monitor_runner.js');
const assert = require('assert');
const sinon = require('sinon');
const fs = require('fs');

describe('Firebase Monitor - Integration Test', function() {
  var retrieverStub;
  var slackPosterStub;

  before(function() {
    sinon.stub(configReader, "readConfig").returns(config);
    retrieverStub = sinon.stub(firebaseRetriever, "retrieveData");

    retrieverStub.withArgs(config.projects[0]).onCall(0)
    .returns(JSON.stringify(project1FirstRetrieve))
      .onCall(1).returns(JSON.stringify(project1SecondRetrieve));

    retrieverStub.withArgs(config.projects[1])
      .onCall(0).returns(JSON.stringify(project2FirstRetrieve))
      .onCall(1).returns(JSON.stringify(project2SecondRetrieve));
    slackPosterStub = sinon.stub(slackPoster, "postResult");
  });

  after(function(){
    configReader.readConfig.restore();
    firebaseRetriever.retrieveData.restore();
    slackPoster.postResult.restore();
  });

  afterEach(function() {
    historyCleaner.cleanup(config.projects.map((project) => { return project.name; }));
  });

  it('should first save, and notify that new project monitored, then post differences when new data seen.', async function() {
    await runner.run();
    assertSlackPostedForNewProject(0, config.projects[0]);
    assertSlackPostedForNewProject(1, config.projects[1]);
    await runner.run();
    assertSlackPostedChangesForProject(2, config.projects[0], "Condition Deleted");
    assertSlackPostedChangesForProject(2, config.projects[0], "Parameter Deleted");
    assertSlackPostedChangesForProject(3, config.projects[1], "Condition Added");
    assertSlackPostedChangesForProject(3, config.projects[1], "Parameter Added");
  });

  function assertSlackPostedForNewProject(postCount, project) {
    var args = slackPosterStub.getCall(postCount);
    assert.equal(args.args[0], project);
    assert(args.args[1].isNewProject)
  }

  function assertSlackPostedChangesForProject(postCount, project, expected) {
    var args = slackPosterStub.getCall(postCount);
    assert.equal(args.args[0], project);
    assert(JSON.stringify(args.args[1]).match(expected))
  }
});

const config = {
    projects: [
      {
        name: "Demo 1",
        id: "default-demo-1"
      },
      {
        name: "Demo 2",
        id: "default-demo-1"
      }],
    slack: {
      webhookUrl: "https://hooks.slack.com/123abc"
    }
}

const someCondition = { name: "someCondition" };
const someCondition1 = { name: "someCondition1" };

const someParameter = { name: "someParam", value: "true" };
const someParameter1 = { name: "someParam1", value: "false" };

const emptyConfig = JSON.stringify({ conditions: [], parameters: [] });

const project1FirstRetrieve = {
  conditions: [ someCondition, someCondition1],
  parameters: {
    "param1" : someParameter,
    "param2" : someParameter1,
  }
}

const project1SecondRetrieve = {
  conditions: [someCondition],
  parameters: {
      "param1" : someParameter,
  }
}

const project2FirstRetrieve = {
  conditions: [someCondition],
  parameters: {
      "param1" : someParameter,
  }
}

const project2SecondRetrieve = {
  conditions: [someCondition, someCondition1],
  parameters: {
    "param1" : someParameter,
    "param2" : someParameter1,
  }
}
