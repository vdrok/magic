import {Platform, StyleSheet} from 'react-native'
import AppStyle from '../../../Styles/AppStyle'
import colors from '../../../Styles/Colors'
import sizes from '../../../Styles/Sizes'

export default StyleSheet.create({
    ...AppStyle,
    header_logo: {
        height: 25,
        width: 25,
        marginLeft: 5,
    },
    sectionBox:{
        borderTopColor: colors.boxBorder,
        borderTopWidth: 1,
        borderBottomColor: colors.boxBorder,
        borderBottomWidth: 1,
        backgroundColor: colors.elementBackground,
        paddingHorizontal: sizes.containerHorizontalPadding,
        paddingVertical: 8,
        minHeight: 30,
    },
    flexHorizontal:{
        flexDirection: 'row',
    },
    accountIcon:{
        marginRight: 5,
    },
    sectionSpacer:{
        marginVertical: 20,
    },
    sectionHeader:{
      fontWeight: '500',
      alignSelf: 'center',
        marginBottom: 5,
    },
    TextMain: {

    },
    TextSupport: {
        fontSize: 13,
        color: colors.textGray,
    },
    arrow:{
        position: 'absolute',
        right: sizes.containerHorizontalPadding,
        top: 8
    }
})