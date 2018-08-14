import {StyleSheet} from 'react-native'
import colors from '../../../../Styles/Colors'

export default StyleSheet.create({
    headerWrapper:{
      justifyContent: 'space-between'
    },
    channelName:{
      flex: 1,
    },
    statusIconReady:{
        color: colors.LinkColor,
        width: 24,
        height: 24,
    },
    center:{
        justifyContent: 'center',
        alignContent: 'center',
        width: '100%'
    },
    metadataLabel:{
        marginTop: 10,
        textAlign: 'center',
        width: '100%'
    },
    error:{
        color: colors.warning
    }
});