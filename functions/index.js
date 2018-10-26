const functions = require('firebase-functions');
const admin = require('firebase-admin');
const runner = require("./src/monitor_runner.js")

admin.initializeApp({credential: admin.credential.applicationDefault()});

exports.sendRCChangesToSlack = functions.remoteConfig.onUpdate(version => {
  return runner.run(functions.firebaseConfig(), version.versionNumber, version.updateUser);
});
