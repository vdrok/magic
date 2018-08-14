import { StyleSheet } from 'react-native'
import AppStyle from '../../../Styles/AppStyle'
import colors from '../../../Styles/Colors'
import sizes from '../../../Styles/Sizes'

export default StyleSheet.create({
    ...AppStyle,
    modalClose:{
        position: 'absolute',
        right: sizes.containerHorizontalPadding,
        top: 20,
        zIndex: 20,
    },
    modalHeader:{
        fontSize: 20,
        textAlign: 'center',
        paddingVertical: 30,
    },
    modalListContainer:{
        marginBottom: 20,
        marginTop: 5
    },
    modalListHeader:{
        fontSize: 17,
        paddingLeft:sizes.containerHorizontalPadding,
    },
    sectionHeader:{
        fontWeight: '500',
        alignSelf: 'center',
        marginBottom: 5,
    },
    socialIcon: {
        alignSelf: 'center',
        marginRight: 10
    },
    textHeading: {
        fontSize: 13,
        fontWeight: "600",
        paddingVertical: 5
    },
    textDescription: {
        fontSize: 12,
        color: colors.textGray
    },
    addChannelBtn: {
        backgroundColor: colors.deepSkyBlue
    },
    addInstagramWrapper: {
        alignItems: "center"
    },
    addInstagramContent: {
        width: 220
    },
    addInstagramBtn: {
        width: "100%"
    }
})