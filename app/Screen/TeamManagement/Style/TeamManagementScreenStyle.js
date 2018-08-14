import {StyleSheet} from 'react-native'
import AppStyle from '../../../Styles/AppStyle'
import Colors from '../../../Styles/Colors'


export default StyleSheet.create({
    ...AppStyle,
    headerLogo: {
        height: 25,
        width: 25,
        marginLeft: 5,
        marginRight: 15
    },
    headerWrapper: {
        minHeight: 100
    },
    headerTitle: {
        padding: 8,
        fontSize: 16,
        fontWeight: "bold"
    },
    button: {
        position: 'absolute',
        zIndex: 20,
        right: 8,
        bottom: 10,
    },
    loader: {
        flex: 1,
        width: '100%'
    },
    list: {
        paddingBottom: 60,
    },
})