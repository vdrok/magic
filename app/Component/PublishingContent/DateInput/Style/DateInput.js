import { StyleSheet } from 'react-native'
import Colors from '../../../../Styles/Colors'
export default StyleSheet.create({
    wrapper:{
        flex: 0,
        width: '100%',
        flexDirection: 'row',

    },
    selectedWrapper:{

    },
    iconWrapper:{
        justifyContent: 'center',
        alignItems: 'flex-start',
        flex: 0,
    },
    nameWrapper:{
        flex: 1,
        paddingLeft: 10,
    },
    editIcon:{
        flex: 0,
        marginRight: 5,
    },
    channelIcon:{
        padding: 0,
        margin: 0,
    }
});