import { StyleSheet } from 'react-native'
import AppStyle from '../../../Styles/AppStyle'
import Colors from '../../../Styles/Colors'

export default StyleSheet.create({
    ...AppStyle,
    element: {
        paddingTop: 5,
    },
    wrapper: {
        marginHorizontal: 5,
        borderWidth: 2,
        borderColor: Colors.LinkColor,
        borderStyle: 'dashed',
        padding: 10,
        width: 130,
        height: 130
    },
    image: {
        width: undefined,
        height: undefined,
        flex: 1,
        alignSelf: 'stretch',
        position: 'relative',
    },
    dashedWrapper: {
        flex: 1
    },
    closeWrapper: {
        position: 'absolute',
        top: 0,
        right: -3,
        width: 18,
        height: 18,
        zIndex: 30,
        backgroundColor: Colors.LinkColor,
        borderRadius: 10,
        padding: 1,
        overflow: 'hidden'
    },
    closeText: {
        color: '#fff',
        lineHeight: 15,
        textAlign: 'center'
    },
    iconPlay: {
        flexDirection: 'column',
        alignSelf: 'center',
        marginTop: 20,
        flex: 1,
        backgroundColor: Colors.transparent,
    },
});