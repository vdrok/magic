import { StyleSheet } from 'react-native'
import AppStyle from '../../../Styles/AppStyle'
import Colors from '../../../Styles/Colors'

export default StyleSheet.create({
    ...AppStyle,
    formWrapper:{
        width: '80%',
    },
    input:{
        width: '100%',
        color: '#000000',
        padding: 15,
        borderColor: Colors.boxBorder,
        backgroundColor: Colors.elementBackground,
        borderWidth: 1,
        marginVertical: 15
    },
    inputDisable:{
        opacity: 0.7
    },
    button:{
        paddingHorizontal: 30,
    },
    errorMessage:{
        color: Colors.warning,
        alignSelf: 'center',
        fontSize: 17
    }
})