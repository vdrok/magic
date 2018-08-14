import { StyleSheet } from 'react-native'
import AppStyle from '../../../Styles/AppStyle'
import colors from '../../../Styles/Colors'
import style from "../../CampaignAnalyticsTabs/Style/CampaignAnalyticsTabStyle";

export default StyleSheet.create({
    ...AppStyle,
    postWrapper: {
        flexDirection: 'row',
        flex: 1,
        flexWrap: 'wrap',
        alignItems: 'stretch'
    },
    postRow: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        marginLeft: 25
    },
    elementWrapper:{
        marginBottom: 30,
    },
    lastChildWrapper: {
        backgroundColor: colors.BackgroundColor,
        zIndex: 1
    },
    marginTopCampaign:{
        paddingTop: 23,
    },
    grayLine: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 16,
        width: 1,
        backgroundColor: colors.boxBorder,
    },
    grayLineLast: {
        position: 'absolute',
        top: 0,
        left: 16,
        width: 1,
        height: 40,
        backgroundColor: colors.boxBorder,
    },
    mediaIconWrapper: {
        backgroundColor: colors.elementBackground,
        paddingBottom: 10,
        paddingTop: 16,
        zIndex: 1,
    },
    mediaIcon: {
        width: 14,
        height: 14
    },
    iconPlay:{
        alignSelf: 'center',
        flex: 0,
        backgroundColor: colors.transparent,
    },
    circle: {
        position: 'absolute',
        left: 4,
        top: 0,
        zIndex: 2,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.boxBorder
    },
    thumbnailWrapper: {
        flex: 1,
    },
    thumbnail: {
        width: 140,
        height: 140,
        justifyContent: 'center',
    },
    textContent: {
        flex: 1,
        marginLeft: 5
    },
    dateText: {
        marginBottom: 10,
        marginTop: 5,
        fontSize: 12,
        color: colors.textGray
    },
    grayColorStatus: {
        color: colors.textGray,
        fontSize: 12,
    },
    greenColorStatus: {
        color: colors.LinkColor,
        fontSize: 12,
    },
    checkIcon: {
        color: colors.LinkColor
    },
    statusIcon: {
        fontSize: 15
    },
    bottomContentWrapper: {
        backgroundColor: 'transparent',
        borderColor: colors.boxBorder,
        borderWidth: 1,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        paddingLeft: 30
    },
    bottomContentTitle: {
        fontSize: 11,
        fontWeight: 'bold'
    },
    bottomContentText: {
        fontSize: 11
    },
    approvalButton:{
        marginLeft: 'auto'
    },
    campaignButton: {
        backgroundColor: '#e8e8e8',
        paddingHorizontal: 8,
        paddingVertical: 3,
        position: 'absolute',
        top: 0,
        right: 0
    },
    blackText:{
        color: colors.black,
    },
    whiteText:{
        color: colors.white,
    },
    flex1:{
        flex: 1
    },
    statusText: {
        position: 'absolute',
        right: 0,
        top: 4
    },
    pickerBackButton: {
        color: colors.backButton
    },
    titleBarTextWrapper: {
        alignItems: "flex-start",
        flex: 1,
        justifyContent: "center"
    },
    pickerTextStyle: {
        marginRight: -19,
        marginTop: 10
    },
    pickerItemTextStyle: {
        flex: 1
    },
    actionButtonText:{
        color: colors.white,
        paddingHorizontal: 15,
    }
});