import OneSignal from 'react-native-onesignal';
import {Platform} from "react-native";

export default class OneSignalService {

    static init() {
        OneSignal.init(process.env.ONESIGNAL_APP_ID, {
            kOSSettingsKeyAutoPrompt: false
        });
    }

    static checkPermissions(callback) {
        OneSignal.getPermissionSubscriptionState(data => {
            if (Platform.OS === 'android') {
                callback(data)
            } else {
                if (!data.hasPrompted) {
                    OneSignal.promptForPushNotificationsWithUserResponse(response => {
                        callback(response ? data : false)
                    });
                } else {
                    callback(data.notificationsEnabled ? data : false)
                }
            }
        })
    }
}