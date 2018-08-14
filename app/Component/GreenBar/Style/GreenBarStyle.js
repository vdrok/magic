import { StyleSheet } from 'react-native'
import Colors from '../../../Styles/Colors'

export default StyleSheet.create({
    greenBarWrapper: {
        backgroundColor: Colors.LinkColor,
        justifyContent: 'center',
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginTop: 0
    },
    greenBarText: {
        color: '#fff',
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        fontSize: 17,
        height: '100%',
        paddingHorizontal: 5
    },
    rowWrapper: {
        flex: 0,
        alignItems: 'center',
        flexDirection: 'row',
    },
})