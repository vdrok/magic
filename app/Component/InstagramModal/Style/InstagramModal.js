import { StyleSheet, Dimensions } from 'react-native';
import AppStyle from '../../../Styles/AppStyle';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    ...AppStyle,
    contentWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    content: {
        backgroundColor: '#fff',
        alignSelf: 'center',
        width: width - 30,
        height: 225
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
        color: '#fff',
        textAlign: 'center'
    }
});