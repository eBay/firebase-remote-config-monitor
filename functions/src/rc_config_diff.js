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

const firebaseDiff = (function () {
  var self = {};

  self.findDifferences = function (oldConfig, newConfig) {
    const conditionDiffs = diffConditions(
      oldConfig.conditions,
      newConfig.conditions
    );
    const paramDiffs = diffParameters(
      mergeParameterWithGroups(oldConfig.parameterGroups, oldConfig.parameters),
      mergeParameterWithGroups(newConfig.parameterGroups, newConfig.parameters)
    );
    return conditionDiffs.concat(paramDiffs);
  };

  function mergeParameterWithGroups(parameterGroups, extraParameter) {
    var parameters = extraParameter;
    if (parameterGroups) {
      for (const item in parameterGroups) {
        parameters = { ...parameters, ...parameterGroups[item].parameters };
      }
    }
    return parameters;
  }

  function diffParameters(oldValues, newValues) {
    var diffs = [];
    var newKeys = [];
    var oldKeys = [];
    for (var newKey in newValues) {
      newKeys.push(newKey);
      newValues[newKey].name = newKey;
    }
    for (var oldKey in oldValues) {
      oldKeys.push(oldKey);
      oldValues[oldKey].name = oldKey;
    }
    newKeys.sort();
    oldKeys.sort();
    var j = 0;
    for (var i = 0; i < newKeys.length; i++) {
      const newName = newKeys[i];
      const newValue = newValues[newName];

      while (oldKeys.length > j && newName > oldKeys[j]) {
        diffs.push({
          type: "Parameter Deleted",
          payload: oldValues[oldKeys[j]],
        });
        j++;
      }
      if (oldKeys.length > j && oldKeys[j] === newName) {
        const oldValue = oldValues[oldKeys[j]];
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          diffs.push({
            type: "Parameter Changed",
            payload: [oldValue, newValue],
          });
        }
        j++;
      } else {
        diffs.push({ type: "Parameter Added", payload: newValue });
      }
    }
    while (oldKeys.length > j) {
      diffs.push({ type: "Parameter Deleted", payload: oldValues[oldKeys[j]] });
      j++;
    }
    return diffs;
  }

  function diffConditions(oldValues, newValues) {
    oldValues = setupConditions(oldValues);
    newValues = setupConditions(newValues);
    var diffs = [];

    var j = 0;
    for (let i = 0; i < newValues.length; i++) {
      const newValue = newValues[i];
      const newName = newValue.name;

      while (oldValues.length > j && newName > oldValues[j].name) {
        diffs.push({ type: "Condition Deleted", payload: oldValues[j] });
        j++;
      }
      if (oldValues.length > j && oldValues[j].name === newName) {
        const oldValue = oldValues[j];
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          diffs.push({
            type: "Condition Changed",
            payload: [oldValue, newValue],
          });
        }
        j++;
      } else {
        diffs.push({ type: "Condition Added", payload: newValue });
      }
    }
    while (oldValues.length > j) {
      diffs.push({ type: "Condition Deleted", payload: oldValues[j] });
      j++;
    }
    return diffs;
  }

  function setupConditions(conditions) {
    if (!conditions) return [];
    for (var i = 0; i < conditions.length; i++) {
      conditions[i].position = i;
    }
    return conditions.sort(nameSort);
  }

  function nameSort(a, b) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  }

  return self;
})();

module.exports = firebaseDiff;
