import { StyleSheet } from 'react-native';
import AppStyle from '../../../Styles/AppStyle';
import colors from '../../../Styles/Colors';

export default StyleSheet.create({
    ...AppStyle,
    wrapper: {
        maxHeight: 400,
        backgroundColor: '#fff',
        borderBottomWidth: 0.5,
        borderColor: '#D8D8D8'
    },
    button: {
        paddingLeft: 22,
        paddingRight: 18,
        paddingTop: 5,
        paddingBottom: 5,
        height: 33,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttonMain: {
        height: 40
    },
    buttonText: {
        fontWeight: "500",
        fontSize: 17
    },
    buttonTextMain: {
        fontWeight: "bold",
    },
    buttonIcon: {
        marginRight: 10,
        height: 25,
        width: 25
    },
    buttonArrow: {
        width: 20,
        height: 20
    },
    textWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chooseButton: {
        backgroundColor: colors.LinkColor,
        alignSelf: 'center',
        margin: 10,
        marginTop: 20,
        padding: 10,
        borderRadius: 10,
    },
    chooseButtonText: {
        color: '#ffffff'
    },

    activeButton: {
        backgroundColor: colors.ActiveColor
    },
    activeButtonText: {
        fontWeight: 'bold'
    }
});