import colors from './Colors';
import { Platform } from 'react-native';

const AppStyle = {
    containerPadding:{
        paddingHorizontal: 5
    },
    container: {
        backgroundColor: colors.BackgroundColor
    },
    backgroundGray: {
        backgroundColor: colors.backgroundGray
    },
    fullHeight: {
        flexDirection: 'column',
        flex: 1,
    },
    horizontal:{
        flexDirection: 'row',
    },
    header_logo: {
        height: Platform.OS === 'ios' ? 25 : 90,
        width: Platform.OS === 'ios' ? 25 : 90,
        resizeMode: 'contain',
        marginLeft: 5,
    },
    headerLeftTitle: {
        fontSize: 17,
        paddingLeft: 15,
    },
    navigationLink: {
        color: colors.LinkColor
    },
    colorBlack: {
        color: colors.black
    },
    flexList: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 10
    },
    flexElement: {
        width: 110,
        height: 130,
        justifyContent: 'center'
    },
    justifyCenter: {
        justifyContent: 'center'
    },
    pageWrapper:{
        backgroundColor: colors.BackgroundColor,
        padding: 15,
    },
    h1:{
        fontSize: 17,
        marginBottom: 20,
    },
    dangerButton: {
        backgroundColor: colors.warning
    },
    loader: {
        flex: 1,
    },
    floatLeft: {
        alignSelf: 'flex-start',
        justifyContent: 'flex-start'
    },
    floatRight: {
        alignSelf: 'flex-end',
        justifyContent: 'flex-end'
    },
    textLeft: {
        textAlign: 'left'
    },
    textRight: {
        textAlign: 'right'
    },
    textCenter: {
        textAlign: 'center'
    },
    boxArrow: {
        position: 'absolute',
        right: 15,
        top: 10,
        width: 20,
        height: 30,
        zIndex: 10,
        color: colors.textGray
    },
    errorMessage:{
        color: colors.warning,
        alignSelf: 'center',
        fontSize: 17
    },
    flex1:{
        flex: 1,
    },
    relative:{
        position: 'relative',
    },
    flex0:{
        flex: 0,
    },
    promoText: {
        color: colors.textGray,
        fontSize: 21,
        textAlign: 'center',
        marginHorizontal: 15,
        marginTop: 45,
    },
    //
    primaryText: {
        color: colors.main,
    },
    secondaryText: {
        color: colors.black,
    },
    minorText:{
        color: colors.textGray,
    },
    textBig:{
        fontSize: 17
    },
    textNormal: {
        fontSize: 14,
    },
    textSmall: {
        fontSize: 10,
    },
    center:{
        textAlign: 'center',
        alignItems: 'center',
    }
};

export default AppStyle