import { StyleSheet } from 'react-native'
import Colours from '../../../Styles/Colors'

export default StyleSheet.create({
    wrapper:{
        borderColor: Colours.boxBorder,
        backgroundColor: Colours.elementBackground,
        padding: 10,
        borderWidth: 1,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    }
})