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

const firebaseDiff = require("./../rc_config_diff.js");
const assert = require("assert");

describe("Diffing tests", () => {
  it("should produce no differences when same configs diffed", () => {
    var diffs = firebaseDiff.findDifferences(
      oneConditionOneParameter,
      oneConditionOneParameter
    );
    assert.equal(diffs.length, 0);
  });

  it("should find added parameter", () => {
    var diffs = firebaseDiff.findDifferences(
      oneCondition,
      oneConditionOneParameter
    );
    assert.equal(diffs.length, 1);
    assert.equal(diffs[0].type, "Parameter Added");
  });

  it("should find removed parameter", () => {
    var diffs = firebaseDiff.findDifferences(
      oneConditionOneParameter,
      oneCondition
    );
    assert.equal(diffs.length, 1);
    assert.equal(diffs[0].type, "Parameter Deleted");
  });

  it("should find modified parameter", () => {
    var diffs = firebaseDiff.findDifferences(
      oneParameter,
      oneModifiedParameter
    );
    assert.equal(diffs.length, 1);
    assert.equal(diffs[0].type, "Parameter Changed");
  });

  it("should find added condition", () => {
    var diffs = firebaseDiff.findDifferences(
      oneParameter,
      oneConditionOneParameter
    );
    assert.equal(diffs.length, 1);
    assert.equal(diffs[0].type, "Condition Added");
  });

  it("should find removed condition", () => {
    var diffs = firebaseDiff.findDifferences(
      oneConditionOneParameter,
      oneParameter
    );
    assert.equal(diffs.length, 1);
    assert.equal(diffs[0].type, "Condition Deleted");
  });

  it("should find modified parameter", () => {
    var diffs = firebaseDiff.findDifferences(
      oneCondition,
      oneModifiedCondition
    );
    assert.equal(diffs.length, 1);
    assert.equal(diffs[0].type, "Condition Changed");
  });

  it("should find added parameter in group", () => {
    var diffs = firebaseDiff.findDifferences(oneParameter, oneGroupParameter);
    assert.equal(diffs.length, 1);
    assert.equal(diffs[0].type, "Parameter Added");
  });

  it("should find removed parameter in group", () => {
    var diffs = firebaseDiff.findDifferences(oneGroupParameter, oneParameter);
    assert.equal(diffs.length, 1);
    assert.equal(diffs[0].type, "Parameter Deleted");
  });

  it("should find modified parameter in group", () => {
    var diffs = firebaseDiff.findDifferences(
      oneGroupParameter,
      oneGroupParameterModified
    );
    assert.equal(diffs.length, 1);
    assert.equal(diffs[0].type, "Parameter Changed");
  });
});

const oneConditionOneParameter = {
  conditions: [
    {
      name: "1stCondition",
      expression: "percent <= 10",
      tagColor: "BROWN",
    },
  ],
  parameters: {
    bSomeParameter: {
      defaultValue: {
        value: "false",
      },
    },
  },
};

const oneParameter = {
  conditions: [],
  parameters: {
    bSomeParameter: {
      defaultValue: {
        value: "false",
      },
    },
  },
};

const oneGroupParameter = {
  conditions: [],
  parameters: {
    bSomeParameter: {
      defaultValue: {
        value: "false",
      },
    },
  },
  parameterGroups: {
    group1: {
      parameters: {
        innerParameter: {
          defaultValue: {
            value: "false",
          },
        },
      },
    },
  },
};

const oneGroupParameterModified = {
  conditions: [],
  parameters: {
    bSomeParameter: {
      defaultValue: {
        value: "false",
      },
    },
  },
  parameterGroups: {
    group1: {
      parameters: {
        innerParameter: {
          defaultValue: {
            value: "true",
          },
        },
      },
    },
  },
};

const oneModifiedParameter = {
  conditions: [],
  parameters: {
    bSomeParameter: {
      defaultValue: {
        value: "true",
      },
    },
  },
};

const oneCondition = {
  conditions: [
    {
      name: "1stCondition",
      expression: "percent <= 10",
      tagColor: "BROWN",
    },
  ],
  parameters: {},
};

const oneModifiedCondition = {
  conditions: [
    {
      name: "1stCondition",
      expression: "percent <= 20",
      tagColor: "BROWN",
    },
  ],
  parameters: {},
};
