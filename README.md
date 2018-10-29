# Firebase Remote Config Monitor

Firebase Cloud Function built on node 8 which will automatically post any changes to Firebase Remote Config to Slack.

>**Project Name** had 2 changes \
**Condition Added: SampleCondition**\
Firebase User
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
version 23

## Usage

To use this, you must deploy this as a Firebase Cloud Function.   For details on enabling Cloud Functions for Firebase, see [Google's documentation](https://firebase.google.com/docs/functions/).  This function will automatically subscribe to Remote Config's [onUpdate function](https://firebase.google.com/docs/functions/rc-events) and post changes any changes to remote config to the specified Slack channel.

## Setup Steps

This app is powered by a combination of Cloud Functions for Firebase and the Firebase Remote Config API.  You will need to be an administrator on your Firebase Console account to perform the following steps.

### Enable Firebase Remote Config API

This app uses the Firebase Remote Config API which must be enabled on your google API project prior to running the app.  

* Visit the Google APIs dashboard at: https://console.developers.google.com/apis/dashboard
* Select the project you wish to enable this for, (this will be the same name as your Firebase Console project)
* Select `Firebase Remote Config API` from the list of APIs
* Enable this API
  * Note: this may take a few minutes to take effect.

If you do not have this enabled, or the update has not had time to take effect, you will receive an error in the Cloud Function's logs when this function attempts to run.

### Generate a Slack webhook URL

This app will post to the webhook URL defined within the config file.  The payloads this app creates are crafted for Slack.  

To create a Incoming webhook follow the steps detailed by Slack at https://api.slack.com/incoming-webhooks

You need to modify the [slack_config.json](/functions/slack_config.json) file with the webhook created.  You also will add the display name for the project you would like to see when the function posts to slack.  The config should look like:

```json
{
	"slackWebHookUrl": "https://hooks.slack.com/services/your/webhook/url",
	"siteDisplayName": "Your Project's Display Name"
}
```


### Cloud function Installation

To deploy your cloud function follow the steps [documented by Google](https://firebase.google.com/docs/functions/get-started) from the commandline in the base project directory.  Be sure to select lanaguage `Javascript` and do not overrwrite the index.js or package.json file when prompted.

The last step should be running the command
`firebase deploy --only functions`
which will deploy your function to firebase.

To see the function in action, go to the Remote Config section of your firebase console, and then make and publish a change to your remote config values.

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
