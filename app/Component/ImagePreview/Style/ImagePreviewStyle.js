import {Dimensions, StyleSheet} from 'react-native'
import Colors from '../../../Styles/Colors'
const { width } = Dimensions.get('window');

export default StyleSheet.create({
    iconClose:{
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: Colors.transparent,
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
    },
    wrapper:{
        flex: 1,
        height: '100%',
        paddingVertical: 30,
        alignContent: 'center',
        backgroundColor: '#ff0000'

    }
})