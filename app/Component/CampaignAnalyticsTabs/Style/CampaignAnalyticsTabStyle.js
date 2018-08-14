import { StyleSheet } from 'react-native'
import AppStyle from '../../../Styles/AppStyle'
import colors from '../../../Styles/Colors'

export default StyleSheet.create({
    ...AppStyle,
    tabContainer: {
        height: 80,
        borderBottomWidth: 0
    },
    tab: {
        borderColor: colors.textGray,
        backgroundColor: colors.white
    },
    borderRight: {
        borderRightWidth: 1,
        borderRightColor: colors.textGray,
    },
    borderTop: {
        borderTopWidth: 1,
        borderTopColor: colors.textGray,
    },
    tabUnderline: {
        height: 0
    },
    activeTab: {
        backgroundColor: colors.white
    },
    tabText: {
        color: colors.black,
        fontWeight: "700",
        fontSize: 13
    },
    activeTabText:{
        color: colors.LinkColor,
    },
    picker: {
        backgroundColor: colors.LinkColor,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    pickerBackButton: {
        color: colors.backButton
    },
    pickerWrapper: {
        flexDirection: "row", borderBottomWidth: 0, paddingRight: 15,
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    pickerStyle: {
        textAlign: 'right',
        flex: 1,
        color: '#ffffff',
    },
    pickerArrow: {
        position: "absolute",
        right: 0,
        top: 9
    },
    channelHeader: {
        fontSize: 16,
        marginLeft: 5
    }
})