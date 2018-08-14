import { StyleSheet } from 'react-native'
import AppStyle from '../../../Styles/AppStyle'
import colors from '../../../Styles/Colors'

export default StyleSheet.create({
    ...AppStyle,
    channelWrapper: {
        flexDirection: "row",
        paddingVertical: 10
    },
    channelContainer: {
        flex: 1,
        marginLeft: 5,
        justifyContent: "space-between",
        alignItems: "center"
    },
    channelContent: {
        flexDirection: "row"
    },
    channelName: {
        marginLeft: 5
    },
    statsWrapper: {
        flex: 1,
        alignItems: "center"
    },
    statsValue: {
        fontSize: 17,
        fontWeight: "700"
    },
    statsDescription: {
        color: colors.textGray,
        fontSize: 12
    },
    textMargin: {
        marginLeft: 13
    },
    channelIcon:{
        marginLeft: 5,
        maxHeight: 20,
        maxWidth: 15,
    }
})