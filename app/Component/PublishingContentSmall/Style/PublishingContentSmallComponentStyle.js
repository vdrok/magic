import { StyleSheet } from 'react-native'
import AppStyle from '../../../Styles/AppStyle'
import colors from '../../../Styles/Colors'

export default StyleSheet.create({
    ...AppStyle,
    channelContainer: {
        marginLeft: 5,
        justifyContent: "space-between"
    },
    channelContent: {
        flexDirection: "row"
    },
    channelName: {
        marginLeft: 5
    },
    channelIcon:{
      marginLeft: 5,
        maxHeight: 20,
        maxWidth: 15,
    },
    publishingDate: {
        fontSize: 10,
        marginLeft: 5
    },
    innerContentWrapper: {
        paddingVertical: 10
    },
    postContentWrapper: {
        marginTop: 5
    },
    postStatus: {
        fontSize: 12,
        color: colors.textGray
    },
    textContentWrapper: {
        flex: 1,
        marginLeft: 5,
        marginRight: 10
    },
    textContent: {
        color: colors.textGray,
        fontSize: 12
    },
    thumbnailWrapper: {
        marginLeft: 10
    },
    thumbnail: {
        width: 45,
        height: 45
    }
})