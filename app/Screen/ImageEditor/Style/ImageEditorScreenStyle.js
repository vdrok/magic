import { StyleSheet, Dimensions } from 'react-native';
import AppStyle from '../../../Styles/AppStyle';
import Colors from '../../../Styles/Colors';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    ...AppStyle,
    loader: {
        height: width * 0.5
    },
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    modalContainer: {
        flex: 0,
        backgroundColor: '#fff'
    },
    modalHeader: {
        fontSize: 20,
        paddingLeft: 20,
        paddingVertical: 10
    },
    modalSubmit: {
        zIndex: 20
    },
    error: {
        color: Colors.warning,
        paddingVertical: 10,
        paddingHorizontal: 20
    }
});
