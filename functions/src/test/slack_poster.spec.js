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

const slackPoster = require('./..//slack_poster.js');
const configReader = require("./..//slack_config_reader.js");
const sinon = require('sinon');
const request = require('request');
const assert = require('assert');

describe('Slack posting tests', () => {
  var requestPostStub;

  beforeEach(() => {
    requestPostStub = sinon.stub(request, 'post')
    requestPostStub.yields(null, { statusCode: 200 }, null);
    sinon.stub(configReader, "readConfig").returns(config);
  });

  afterEach(() => {
    request.post.restore();
    configReader.readConfig.restore();
  });

  it('should post diffs', () =>{
    slackPoster.postDiffs(project, version, user, diffs);
    sinon.assert.calledOnce(requestPostStub)
    var requestArgs = requestPostStub.getCall(0);
    assert.equal(requestArgs.args[0], config.slackWebHookUrl);
    assert(requestArgs.args[1].form.payload.includes("had 4 changes"))
    assert(requestArgs.args[1].form.payload.includes(config.siteDisplayName))
    assert(requestArgs.args[1].form.payload.includes(project.projectId))
  });``

  it('should new monitoring for given project given project', () => {
    slackPoster.postFirstVersionSeen(project);
    sinon.assert.calledOnce(requestPostStub)
    var requestArgs = requestPostStub.getCall(0);
    assert.equal(requestArgs.args[0], config.slackWebHookUrl);
    assert(requestArgs.args[1].form.payload.includes("First version of config values seen"));
    assert(requestArgs.args[1].form.payload.includes(config.siteDisplayName))
    assert(requestArgs.args[1].form.payload.includes(project.projectId))
  });
});

const someConditionComponent = { type: "min", comparisonValue: "val1"};
const someConditionComponent1 = { type: "max", comparisonValue: "val2" };
const someConditionComponent1Altered = { type: "max", comparisonValue: "val3" };
const someConditionComponent2 = { type: "att", comparisonValue: "val2" };
const someConditionComponent3 = { type: "att", comparisonValue: "val2", randomizationKey: "key" };
const someCondition = { name: "someCondition", components: [someConditionComponent, someConditionComponent1] };
const someCondition1 = { name: "someCondition1", components: [someConditionComponent2, someConditionComponent1] };
const someCondition1WithDifferentComponent = { name: "someCondition1", components: [someConditionComponent2, someConditionComponent1, someConditionComponent3] };
const someCondition1WithAlteredComponent = { name: "someCondition1", components: [someConditionComponent2, someConditionComponent1Altered] };
const someCondition2 = { name: "someCondition2", components: [someConditionComponent2, someConditionComponent1] };

const someParamValue = { condition: "Default value", value: "(empty string)" };
const someParamValue1 = { condition: "Red Team", value: "go" };
const someParamValue2 = { condition: "Blue Team", value: "go" };
const someParamValue2WithDifferentValue = { condition: "Blue Team", value: "stop" };
const someParameter = { name: "someParam", values: [someParamValue, someParamValue1] };
const someParameter1 = { name: "someParam1", values: [someParamValue, someParamValue2] };
const someParameter1WithDifferentValue  = { name: "someParam1", values: [someParamValue, someParamValue1] };
const someParameter1WithAlteredValue = { name: "someParam1", values: [someParamValue, someParamValue2WithDifferentValue] };
const someParameter2 = { name: "someParam2", values: [someParamValue, someParamValue2] };

diffs = [{ type: "Condition Deleted", payload: someCondition2 },
         { type: "Parameter Added", payload: someParameter1 },
         { type: "Parameter Changed", payload: [ someParameter1, someParameter1WithAlteredValue]},
         { type: "Condition Changed", payload: [ someCondition1, someCondition1WithDifferentComponent] }
       ];

const config = {
    slackWebHookUrl: "https://hooks.slack.com/services/12345",
    siteDisplayName: "Project Name"
}
const version = 123;
const user = { name: "some user", email: "test@test.com" };
const project =  { projectId: 'some-project' };
