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

const firebaseDiff = function() {
  var self = {};

  self.findDifferences = function (oldConfig, newConfig) {
    const conditionDiffs = diffConditions(oldConfig.conditions, newConfig.conditions);
    const paramDiffs = diffParameters(oldConfig.parameters, newConfig.parameters);
    var paramGroups = [];

    for (var key in oldConfig.parameterGroups) {
      paramGroups.push(key)
    }
    for (var key in newConfig.parameterGroups) {
      paramGroups.push(key)
    }
    var allParamGroupSet = new Set(paramGroups)
    var allParamGroups = Array.from(allParamGroupSet)

    var paramGroupDiffs = [];
    var tempParamGroupDiffs;
    for (var i in allParamGroups) {
      tempParamGroupDiffs = diffParameterGroups(oldConfig.parameterGroups, newConfig.parameterGroups, allParamGroups[i]);
      paramGroupDiffs = paramGroupDiffs.concat(tempParamGroupDiffs);
    }
    var allDiffs = conditionDiffs.concat(paramDiffs).concat(paramGroupDiffs);
    return allDiffs;
  };

  function diffParameterGroups(oldValues, newValues, parameterGroup){
    var diffs = [];
    var newKeys = [];
    var oldKeys = [];

    if (typeof oldValues != 'undefined' && oldValues.hasOwnProperty(parameterGroup)) {
      for (var oldKey in oldValues[parameterGroup].parameters) {
        oldKeys.push(oldKey)
        oldValues[parameterGroup].parameters[oldKey].name = oldKey
      }
    } 

    if (typeof newValues != 'undefined' && newValues.hasOwnProperty(parameterGroup)) {
      for (var newKey in newValues[parameterGroup].parameters) {
        newKeys.push(newKey)
        newValues[parameterGroup].parameters[newKey].name = newKey
      }
    }
    newKeys.sort()
    oldKeys.sort()
    var j = 0;
    for (var i = 0; i < newKeys.length; i++) {
      const newName = newKeys[i];
      const newValue = newValues[parameterGroup].parameters[newName];
      while (oldKeys.length > j && newName > oldKeys[j]) {
        diffs.push({ type: "Parameter Deleted in group \"" + parameterGroup + "\"", payload: oldValues[parameterGroup].parameters[oldKeys[j]]})
        j++;
      }
      if (oldKeys.length > j && oldKeys[j] === newName) {
        const oldValue = oldValues[parameterGroup].parameters[oldKeys[j]]
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
            diffs.push({ type: "Parameter Changed in group \"" + parameterGroup + "\"", payload: [oldValue, newValue]})
        }
        j++;
      } else {
        diffs.push({ type: "Parameter Added in group \"" + parameterGroup + "\"", payload: newValue})
      }
    }
    while (oldKeys.length > j) {
      diffs.push({ type: "Parameter Deleted in group \"" + parameterGroup + "\"", payload: oldValues[parameterGroup].parameters[oldKeys[j]] })
      j++;
    }
    return diffs;
  };

  function diffParameters(oldValues, newValues) {
    var diffs = [];
    var newKeys = [];
    var oldKeys = [];
    for (var newKey in newValues) {
      newKeys.push(newKey)
      newValues[newKey].name = newKey
    }
    for (var oldKey in oldValues) {
      oldKeys.push(oldKey)
      oldValues[oldKey].name = oldKey
    }
    newKeys.sort()
    oldKeys.sort()
    var j = 0;
    for (var i = 0; i < newKeys.length; i++) {
      const newName = newKeys[i];
      const newValue = newValues[newName];

      while (oldKeys.length > j && newName > oldKeys[j]) {
        diffs.push({ type: "Parameter Deleted", payload: oldValues[oldKeys[j]] })
        j++;
      }
      if (oldKeys.length > j && oldKeys[j] === newName) {
        const oldValue = oldValues[oldKeys[j]]
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
            diffs.push({ type: "Parameter Changed", payload: [oldValue, newValue]})
        }
        j++;
      } else {
        diffs.push({ type: "Parameter Added", payload: newValue})
      }
    }
    while (oldKeys.length > j) {
      diffs.push({ type: "Parameter Deleted", payload: oldValues[oldKeys[j]] })
      j++;
    }
    return diffs;
  };

  function diffConditions(oldValues, newValues) {
    oldValues = setupConditions(oldValues)
    newValues = setupConditions(newValues)
    var diffs = [];

    var j = 0;
    for (let i = 0; i < newValues.length; i++) {
      const newValue = newValues[i];
      const newName = newValue.name;

      while (oldValues.length > j && newName > oldValues[j].name) {
        diffs.push({ type: "Condition Deleted", payload: oldValues[j] })
        j++;
      }
      if (oldValues.length > j && oldValues[j].name === newName) {
        const oldValue = oldValues[j]
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
            diffs.push({ type: "Condition Changed", payload: [oldValue, newValue]})
        }
        j++;
      } else {
        diffs.push({ type: "Condition Added", payload: newValue})
      }
    }
    while (oldValues.length > j) {
      diffs.push({ type: "Condition Deleted", payload: oldValues[j] })
      j++;
    }
    return diffs;
  }

  function setupConditions(conditions) {
    for (var i = 0; i < conditions.length; i++) {
      conditions[i].position = i
    }
    return conditions.sort(nameSort)
  }

  function nameSort(a,b) {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  }

  return self;
}();

module.exports = firebaseDiff;
