# Firebase Remote Config Monitor

This supports monitoring one or more firebase consoles' remote config values and posting any changes to either conditions or parameters to Slack.

Changes will be posted to slack in the following format:

**Firebase Project Name** had 2 changes in firebase console: https://console.firebase.google.com/project/xxxxxxxxxxx \
**Condition Added: SampleCondition**\
{\
&nbsp;&nbsp;&nbsp;"expression": "device.os == 'android' && percent <= 50",\
&nbsp;&nbsp;&nbsp;"tagColor": "CYAN",\
&nbsp;&nbsp;&nbsp;"position": 23\
}\
**Parameter Added: SampleParameter**\
{\
&nbsp;&nbsp;&nbsp;"defaultValue": {\
&nbsp;&nbsp;&nbsp;"value": "true"\
},\
&nbsp;&nbsp;&nbsp;"conditionalValues": {\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"SampleCondition": {\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"value": "false"\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}\
&nbsp;&nbsp;&nbsp;}\
}

## Usage

You need to modify the [config](/config.json) file to specify which firebase project(s) you would like to monitor, as well as the slack web hook where changes will be posted.   See [Sample Config](/sample_config.json) for the a sample of the syntax.

## Setup Steps

This app is powered by Google's Firebase APIs.  You will need to be an administrator on your Firebase Console account to perform the following steps.

### Enable Firebase Remote Config API

This app uses the Firebase Remote Config API which must be enabled on your google API project prior to running the app.  

* Visit the Google APIs dashboard at: https://console.developers.google.com/apis/dashboard
* Select the project you wish to enable this for, (this will be the same name as your Firebase Console project)
* Select `Firebase Remote Config API` from the list of APIs
* Enable this API
  * Note: this may take a few minutes to take effect.

If you do not have this enabled, or the update has not had time to take effect, the following error will be shown when attempting to run the the app:

`Firebase Remote Config API has not been used in project xxxxxxxx before or it is disabled. Enable it by visiting https://
console.developers.google.com/apis/api/firebaseremoteconfig.googleapis.com/overview?project=xxxxxxxx then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry`

### Obtain an API key

To generate a private key file for your service account:

* In the Firebase console, open Settings > Service Accounts.
* Click Generate New Private Key, and confirm by clicking Generate Key.
* Take the entire JSON from the key and place as the value of the `key` object within the config file for the project you are creating.
* Note that the key in the sample config file is not a valid key, and needs to be replaced.
* https://firebase.google.com/docs/remote-config/use-config-rest


### Generate a slack webhook URL

This app will post to the webhook URL defined within the config file.  The payloads this app creates are crafted for Slack.  

To create a Incoming Webhook follow the steps detailed by Slack at https://api.slack.com/incoming-webhooks

Once you have configured your webhook, take the url generated during the process and put it into your [config.json](/config.json) file as the value to the `slack.webhookUrl` key.

### Update [config.json](src/config.json) with your project(s)' configuration

You will need to provide the following values for each project:
* **Name**: The name of the project, this will be used when posting to slack.
* **id**: This is your firebase project's id.  This value can be found in the firebase console in the settings page.
* **key**: this should be the contents of the file of downloaded from the firebase console in the `Obtain an API key` step above.

Slack Url: The slack URL for posting should be configured in the config file as defined above.  

The final config file should look similar to the [sample_config.json](/sample_config.json)

## Installation and Running

### Installation

To install the nessasary node modules, ensure node.js is installed.

After deploying the application, run the following command to install the node modules:

`npm install --production`

### Running

To run the application, ensure your [config.json](/config.json) file is fully populated and run the following command:

`node src/firebase_monitor.js`

### Frequency

This application provides value by monitoring the changes to the firebase remote config values on a periodic basis.  The quota for the api used by this application is 6,000 calls / minute / user.  Due to this it is OK to run this app quite frequently.  The recommendation is to run this application every minute to ensure near-real time reporting of firebase remote config values to slack.  A sample cron job entry to run this app every minute would look like the following:

`* * * * * node /home/user/src/firebase_monitor.js`

### Testing

Firebase Remote Config Monitor is tested with the [Mocha](https://github.com/mochajs/mocha) for scenario definition and [Sinon](https://github.com/sinonjs/sinon) for dependency injection.

```
npm install
npm test
```

## License

© 2018 eBay Inc.
Developer: Jake Hall

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. See the [LICENSE](LICENSE.md) file for more details.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
