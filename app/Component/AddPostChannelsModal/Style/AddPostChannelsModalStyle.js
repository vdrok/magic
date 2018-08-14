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
        minHeight: 225,
        position: 'relative',
    },
    closeButton: {
        width: 30,
        height: 30,
        position: 'absolute',
        top: 30,
        right: 10,
        backgroundColor: 'transparent',
        zIndex: 10,
    },
    closeText: {
        color: '#000',
        textAlign: 'center',
        fontSize: 20,
    },
    content: {
        marginHorizontal: 15,
        marginVertical: 30
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 15
    }
});