import {Dimensions, StyleSheet} from 'react-native'
import Colors from '../../../Styles/Colors'
const { width } = Dimensions.get('window');

export default StyleSheet.create({
    iconClose:{
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: Colors.transparent,
    },
    player:{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    loader:{
        height: width * 0.5
    },
    time:{
        position: 'absolute',
        top: 5,
        left: 5,
        color: Colors.white,
        backgroundColor: Colors.transparent,
    }
})