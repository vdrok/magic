import { StyleSheet } from 'react-native'
import AppStyle from '../../../Styles/AppStyle'
import colors from '../../../Styles/Colors'

export default StyleSheet.create({
    ...AppStyle,
    pickerWrapper: {
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    picker: {
        marginBottom: 0,
        paddingBottom: 5,
        flex: 1,
        borderBottomWidth: 0,
        borderBottomColor: colors.textGray,
    },
    pickerArrow: {
        position: "absolute",
        right: 10,
        top: 9,
    },
    pickerBackButton: {
        color: colors.backButton
    }
})