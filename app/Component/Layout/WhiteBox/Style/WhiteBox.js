import { StyleSheet } from 'react-native'
import colors from '../../../../Styles/Colors'


export default StyleSheet.create({
    wrapper: {
        padding: 5,
        backgroundColor: colors.activeArea,
        borderWidth: 1,
        borderColor: colors.borders,
    },
    selected: {
        borderWidth: 1,
        borderColor: colors.main,
    }
});