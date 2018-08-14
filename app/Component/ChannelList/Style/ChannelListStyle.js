import { StyleSheet } from 'react-native'
import AppStyle from '../../../Styles/AppStyle'

export default StyleSheet.create({
    ...AppStyle,
    channelBox:{
        marginBottom: 10,
        flexDirection: 'row',
        alignItems:'center',
    },
    channelName:{
        flex: 1,
        fontSize: 17,
        marginLeft: 10,
    },
    channelArrow:{
        flex: 0,
        width: 20,
        alignItems: 'flex-end',
    },
    innerContent: {
        flexDirection: 'row',
        alignItems:'center'
    }

})