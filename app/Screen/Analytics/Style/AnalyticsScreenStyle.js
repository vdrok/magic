import { StyleSheet } from 'react-native'
import AppStyle from '../../../Styles/AppStyle'
import Colors from '../../../Styles/Colors'
import { Dimensions } from 'react-native'

export default StyleSheet.create({
    ...AppStyle,
    header:{
        fontSize: 18,
        paddingLeft: 15,
        fontWeight: '500',
        marginVertical: 15,
    },
    container:{
        flex: 1,
        position: 'relative',
        backgroundColor: Colors.background
    },
    channelBox:{
        margin: 5,
        width: Dimensions.get('window').width / 3.2
    },
    loader: {
        marginTop: 50,
    }
})