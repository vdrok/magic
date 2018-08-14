import { StyleSheet } from 'react-native';
import colors from '../../../Styles/Colors';

export default StyleSheet.create({
    listWrapper: {
        width: 141,
        height: 80
    },
    image: {
        width: 70,
        height: 70
    },
    textInfo: {
        paddingTop: 5,
        textAlign: 'center'
    },
    playIcon: {
        alignSelf: 'center',
        marginTop: 10,
        flex: 0,
        backgroundColor: colors.transparent,
    }
});