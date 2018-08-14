import { StyleSheet } from 'react-native'
import colors from '../../../Styles/Colors'

export default StyleSheet.create({
    container: {
        backgroundColor: colors.elementBackground,
        marginHorizontal: 30,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.boxBorder,
        borderBottomWidth: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        zIndex: 1
    },
    line: {
        backgroundColor: colors.boxBorder,
        height: 7,
        width: 40,
        alignSelf: 'center',
        borderRadius: 5,
        marginTop: 20,
        marginBottom: 10
    },
    closedText: {
        textAlign: 'center',
        marginVertical: 10
    }
});