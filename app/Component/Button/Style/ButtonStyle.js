import { StyleSheet } from 'react-native'
import Colours from '../../../Styles/Colors'

export default StyleSheet.create({
    chooseButton: {
        backgroundColor: Colours.LinkColor,
        alignSelf: 'center',
        margin: 10,
        marginTop: 20,
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
    },
    chooseButtonSecondary:{
        backgroundColor: Colours.white,
        borderColor: Colours.main,
        borderWidth: 1,
    },
    chooseButtonText: {
        color: '#ffffff',
        fontSize: 17,
        paddingHorizontal: 20,
        textAlign: 'center'
    },
    chooseButtonTextSecondary:{
        color: Colours.main,
    },
    chooseButtonInactive:{
        opacity: 0.7
    }
})