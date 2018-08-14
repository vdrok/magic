// for web compatibility we overide variables
import Config from 'react-native-config'

process.env.API_URL = Config.API_URL
process.env.FACEBOOK_APP_ID = Config.FACEBOOK_APP_ID
process.env.ONESIGNAL_APP_ID = Config.ONESIGNAL_APP_ID
