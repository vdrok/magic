import { StyleSheet } from 'react-native'
import AppStyle from '../../../Styles/AppStyle'
import Colors from '../../../Styles/Colors'
import { Dimensions } from 'react-native'
const { width } = Dimensions.get('window');
export default StyleSheet.create({
    ...AppStyle,
    descriptionText: {
        marginTop: 5,
        marginBottom: 10,
        color: '#909BA7',
        fontSize: 13
    },
    descriptionTextSelected:{
        color: Colors.white,
    },
    image: {
        height: undefined,
        width: undefined,
        flex: 1,
        alignSelf: 'stretch',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageSelected: {
        opacity: 0.7
    },
    iconPlay:{
        alignSelf: 'center',
        flex: 0,
        backgroundColor: Colors.transparent,
    },
    videoLength:{
        position: 'absolute',
        color: Colors.white,
        right: 5,
        bottom: 5,
        backgroundColor: Colors.transparent,
    },
    mediaTypeIcon:{
        position: 'absolute',
        right: 7,
        bottom: 3,
        width: 24,
        height: 24,
        backgroundColor: Colors.transparent,
    },
    liveCountdown: {
        color: Colors.white,
        fontSize: 16,
        textShadowOffset: { width: 0, height: 2 },
        textShadowColor: 'black',
        textShadowRadius: 2,
        fontWeight: 'bold',
        shadowOpacity: 0.6,
        textAlign: 'center',
    },
    selectedElement: {
        backgroundColor: Colors.LinkColor,
    },
    element: {
        justifyContent: 'center',
        flex: 1,
        margin: 2
    }
});