import {StyleSheet} from 'react-native'
import AppStyle from '../../../Styles/AppStyle'
import Colors from '../../../Styles/Colors'


export default StyleSheet.create({
    ...AppStyle,
    container: {
        borderTopWidth: 1,
        borderTopColor: Colors.textGray,
        paddingVertical: 10,
        flexDirection: "row"
    },
    userDetails: {
        flex: 5,
        paddingLeft: 15
    },
    user: {
        fontWeight: "400"
    },
    role: {
        color: Colors.textGray
    },
    arrowContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    arrow: {
        color: Colors.textGray
    },
    disabled: {
        backgroundColor: Colors.lightGray
    }
})