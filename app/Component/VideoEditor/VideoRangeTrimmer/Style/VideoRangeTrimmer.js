import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    wrapper: {
        paddingVertical: 20,
        height: 150,
        paddingHorizontal: 5,
        position: 'relative',

    },

    wrapperSeekBar:{
        backgroundColor: 'gray',
        width: '100%',
        height:  50,
        position: 'relative',
        borderRadius: 5,
    },

    range:{
        position: 'absolute',
        backgroundColor: 'black',
        borderWidth: 3,
        top: 0,
        bottom: 0,
        borderLeftWidth: 15,
        borderRightWidth: 15,
        borderColor: 'yellow',
        borderRadius: 5,
    },

    rangeText:{
        position: 'absolute',
        color: '#fff'
    },
    rangeTextRight:{
        top: 70,
    },
    scaleSVG:{
        flex: 0,
        bottom: 0,
        marginTop: 40,
    },
    marker:{
        position: 'absolute',
        top: 5,
        height: 95,
        width: 2,
        backgroundColor: 'yellow'
    },
    markerCurrentTime:{
        position: 'absolute',
        top: 0,
        height: 100,
        width: 2,
        zIndex: 2,
        backgroundColor: 'red'
    }


});
