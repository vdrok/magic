import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../../../Styles/Colors';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    loader: {
        height: width * 0.5
    },
    isHidden: {
        width: 0,
        height: 0
    },
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    videoPlayer: {
        flex: 1,
    },
    videoIcon:{
        position: 'absolute',
        top: '45%',
        left: '40%',
        backgroundColor: '#00000000'
    },
    videoControls: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 10
    },
    videoDuration: {
        color: Colors.white,
        marginLeft: 15
    },
    trimContainer: {
        flexDirection: 'row',
        backgroundColor: '#000000'
    },
    trimText: {
        paddingVertical: 20
    },
    modalHeader:{
        fontSize: 20,
        paddingLeft: 20,
        paddingVertical: 10,
    },
    error:{
        color: Colors.warning,
        paddingVertical: 10,
        paddingHorizontal: 20,
    }
});
