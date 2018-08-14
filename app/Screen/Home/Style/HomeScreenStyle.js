import { StyleSheet } from 'react-native'
import AppStyle from '../../../Styles/AppStyle'
import colors from '../../../Styles/Colors'

export default StyleSheet.create({
    ...AppStyle,
    totalReachHeading: {
        textAlign: 'center',
        fontSize: 19,
        marginBottom: 5
    },
    reachDataWrapper: {
        flex: 1,
        alignItems: 'center'
    },
    reachBolded: {
        fontSize: 19,
        fontWeight: 'bold'
    },
    reachSmall: {
        fontSize: 14,
        color: colors.textGray
    },
    greenBarWrapper: {
        backgroundColor: colors.LinkColor,
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginTop: 0
    },
    greenBarText: {
        color: '#fff',
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        lineHeight: 30,
        fontSize: 17,
        paddingHorizontal: 5
    },
    greenBarIcon: {
        lineHeight: 30,
        color: '#fff',
    },
    rowWrapper: {
        flex: 1,
        flexDirection: 'row',
    },
    list: {
        marginTop: 20,
        marginHorizontal: 15,
        paddingBottom: 90
    },
    addCampaignButton: {
        position: 'absolute',
        right: 15,
        bottom: 20
    }
})