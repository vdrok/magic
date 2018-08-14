import {Dimensions, StyleSheet} from 'react-native'
import AppStyle from '../../../Styles/AppStyle'
import colors from '../../../Styles/Colors'
const win = Dimensions.get('window');
export default StyleSheet.create({
    ...AppStyle,
    notificationBar: {
        width: win.width,
        backgroundColor: colors.lightNotification,
        padding: 5,
    },
    notificationInner:{
        flex: 1,
    },
    notificationIcon:{
        flex: 0,
        marginLeft: 15,
        padding: 5,
    },
    notificationName:{
        marginLeft: 5,
    }
});