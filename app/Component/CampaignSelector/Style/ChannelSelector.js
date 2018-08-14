import { StyleSheet } from 'react-native'
import colors from '../../../Styles/Colors'
import AppStyle from "../../../Styles/AppStyle";
export default StyleSheet.create({
    ...AppStyle,
    wrapper:{
        flex: 0,
        width: '100%',
        flexDirection: 'row',
        paddingTop: 0,
        paddingBottom: 0,
        alignItems: 'center',
    },
    placeholder: {
        color: colors.black,
        paddingLeft: 0,
        paddingRight: 0
    },
    selected: {
        color: colors.main,
        paddingLeft: 0,
        paddingRight: 0
    }
});