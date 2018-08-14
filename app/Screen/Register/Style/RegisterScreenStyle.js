import { StyleSheet } from 'react-native';
import AppStyle from '../../../Styles/AppStyle';
import Colors from '../../../Styles/Colors';

export default StyleSheet.create({
    ...AppStyle,
    formWrapper: {
        width: '80%'
    },
    input: {
        width: '100%',
        color: '#000000',
        padding: 15,
        borderColor: Colors.boxBorder,
        backgroundColor: Colors.elementBackground,
        borderWidth: 1
    },
    inputDisable: {
        opacity: 0.7
    },
    button: {
        paddingHorizontal: 30
    },
    backButton: {
        textAlign: 'center',
        marginTop: 10,
        textDecorationLine: 'underline'
    },
    disclaimerMessage: {
        marginTop: 5,
        fontSize: 13
    },
    confirmMessage: {
        textAlign: 'center'
    },
    errorWrapper: {
        marginBottom: 5
    },
    errorMessage: {
        color: Colors.warning,
        textAlign: 'center',
        fontSize: 14
    }
});
