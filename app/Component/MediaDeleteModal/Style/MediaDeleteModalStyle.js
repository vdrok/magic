import { StyleSheet, Dimensions } from 'react-native';
import AppStyle from '../../../Styles/AppStyle';
import Colors from '../../../Styles/Colors';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    ...AppStyle,
    contentWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    container: {
        backgroundColor: '#fff',
        alignSelf: 'center',
        width: width - 30,
        minHeight: 225
    },
    closeButton: {
        width: 30,
        height: 30,
        position: 'absolute',
        top: 15,
        right: 5,
        backgroundColor: 'transparent'
    },
    closeText: {
        color: '#000',
        textAlign: 'center'
    },
    content: {
        marginHorizontal: 15,
        marginVertical: 30
    },
    textBold: {
        fontWeight: 'bold'
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 15
    },
    errorMessage: {
        marginTop: 10,
        color: Colors.warning
    },
    btnDanger: {
        backgroundColor: Colors.warning
    },
    contentActions: {
        flexDirection: 'row',
        justifyContent: 'center'
    }
});
