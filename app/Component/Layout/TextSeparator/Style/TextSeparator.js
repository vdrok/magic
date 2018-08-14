import { StyleSheet } from 'react-native'
import colors from '../../../../Styles/Colors'
import appStyles from '../../../../Styles/AppStyle'


export default StyleSheet.create({
    text: {
        ...appStyles.textNormal,
        width: '100%',
        textAlign: 'center',
        fontSize: 17,
        color: colors.textGray,
        marginVertical: 10,
    },
});