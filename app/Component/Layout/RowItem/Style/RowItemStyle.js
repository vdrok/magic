import { StyleSheet } from 'react-native'
import colors from '../../../../Styles/Colors'

export default StyleSheet.create({
    wrapper:{
        borderColor: colors.boxBorder,
        backgroundColor: colors.elementBackground,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        width: '100%',
    }
})