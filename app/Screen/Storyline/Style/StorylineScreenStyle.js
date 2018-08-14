import { StyleSheet } from 'react-native'
import AppStyle from '../../../Styles/AppStyle'
import colors from '../../../Styles/Colors'

export default StyleSheet.create({
    ...AppStyle,
    scrollableContainer:{
        paddingBottom: 90
    },
    campaignsHeading: {
        marginVertical: 0,
        marginHorizontal: 5
    },
    campaignName: {
        flex: 2,
        textAlign: 'left',
        fontSize: 19,
    },
    postsCount: {
        flex: 1,
        textAlign: 'right',
        fontSize: 15,
        alignSelf: 'flex-end',
        fontWeight: '100'
    },
    grayLine: {
        position: 'absolute',
        left: 32,
        top: 45,
        bottom: 0,
        width: 1,
        backgroundColor: colors.boxBorder,
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
        height: 40,
        justifyContent: 'flex-start',
        overflow: 'hidden',
    },
    greenBarText: {
        color: '#fff',
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        height: '100%',
        fontSize: 17,
        paddingHorizontal: 5
    },
    greenBarDate: {
        fontWeight: '100',
        fontSize: 14
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
        marginTop: 0,
        marginLeft: 15,
        marginRight: 0,
    },
    postList: {
        paddingRight: 15,
    },
    addCampaignButton: {
        position: 'absolute',
        right: 15,
        bottom: 20
    },
    button:{
        position: 'absolute',
        zIndex: 20,
        right: 8,
        bottom: 10,
    },
    loader:{
        flex: 1,
        height: '100%'
    },
    headerIcon:{
        fontSize: 20,
    },
    campaignsTimes:{
        color: colors.textGray
    },
    emptyList: {
        justifyContent: 'center', 
        alignItems: 'center'
    }
})