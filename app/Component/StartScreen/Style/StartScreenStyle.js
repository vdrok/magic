import { StyleSheet } from 'react-native';
import AppStyle from '../../../Styles/AppStyle';
import Colors from '../../../Styles/Colors';

export default StyleSheet.create({
    ...AppStyle,
    container: {
        flex: 1,
        backgroundColor: Colors.BackgroundColor
    },
    containerView: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    logoWrapper: {
        flexDirection: 'row',
        marginBottom: 30
    },
    logoTextWrapper: {
        flex: 0,
        justifyContent: 'center'
    },
    logo: {
        marginTop: 10,
        marginRight: 10,
        justifyContent: 'center'
    },
    logoText: {
        fontSize: 42
    },
    LogoTextLead: {
        fontSize: 18
    }
});
