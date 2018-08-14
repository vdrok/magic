import { StyleSheet } from 'react-native';
import colors from '../../../Styles/Colors';
import AppStyle from '../../../Styles/AppStyle';

export default StyleSheet.create({
    ...AppStyle,
    list:{
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        alignItems: 'flex-start',

    },
    swipeElement: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.boxBorder
    },
    elementImage: {
        width: 25,
        height: 25,
        marginHorizontal: 20
    },
    elementText: {
        flex: 0.8,
        fontSize: 20,
        color: colors.darkGrayText
    }
})