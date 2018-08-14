import { StyleSheet } from 'react-native'
import AppStyle from '../../../Styles/AppStyle'
import colors from '../../../Styles/Colors'

export default StyleSheet.create({
    ...AppStyle,
    innerContentWrapper: {
        flex: 1,
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: colors.textGray
    },
    innerContent: {
        flex: 1
    },
    innerContentStyle: {
        paddingVertical: 5
    },
    statsWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    statsValue: {
        fontSize: 17,
        fontWeight: "700"
    },
    statsDescription: {
        color: colors.textGray,
        fontSize: 12
    }
})