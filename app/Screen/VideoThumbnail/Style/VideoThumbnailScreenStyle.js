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
        justifyContent: 'space-between'
    },
    videoPlayer: {
        flex: 1,
        overflow: 'hidden'
    },
    framesContainer: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 20
    },
    frameContainer: {
        flex: 1
    },
    framesTextContainer: {
        borderRadius: 2,
        borderTopWidth: 4,
        borderTopColor: '#000',
        paddingTop: 10,
        alignItems: 'center'
    },
    error: {
        color: Colors.warning,
        paddingVertical: 10,
        paddingHorizontal: 20
    }
});
