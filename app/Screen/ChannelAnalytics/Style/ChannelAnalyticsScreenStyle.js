import {StyleSheet} from 'react-native'
import AppStyle from '../../../Styles/AppStyle'
import colors from '../../../Styles/Colors'

export default StyleSheet.create({
    ...AppStyle,
    statsWrapper: {
        padding: 10,
        flex: 1.2,
        alignItems: 'center'
    },
    statsValue: {
        fontSize: 17,
        fontWeight: "700"
    },
    statsDescription: {
        color: colors.textGray,
        fontSize: 12
    },
    pickerWrapper: {
        flex: 2,
        paddingRight: 10,
    },
    chartWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    contentAnalyticsPicker: {
        marginVertical: 5
    },
    backgroundWhite: {
        backgroundColor: colors.white
    },
    greenBarWrapper:{
        flex: 0,
        flexDirection: 'row',
        backgroundColor: colors.LinkColor
    },
    pickerWrapper:{
        flex: 1,
        alignSelf: 'flex-end',
    },
    pickerTextStyle:{
        color: '#fff'
    }
})