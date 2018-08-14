import { StyleSheet } from 'react-native'
import AppStyle from '../../../Styles/AppStyle'
import colors from '../../../Styles/Colors'

export default StyleSheet.create({
    ...AppStyle,
    row: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    thumbImg: {
        width: 40,
        height: 40,
        flex: 1
    },
    headingWrapper: {
        paddingVertical: 5,
        flex: 0,
    },
    channelName: {
        fontWeight: '800',
    },
    optionWrapper: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.boxBorder
    },
    imageSelector:{
        borderColor: colors.boxBorder,
        backgroundColor: colors.elementBackground,
        borderWidth: 1,
        marginHorizontal: 15,
        marginTop: 3,
        marginBottom: 15,
    },
    counter:{
        alignItems: 'flex-end',
        marginRight: 20,
    },
    counterText:{
        color: colors.LinkColor,
    },
    counterTextInvalid:{
      color: colors.warning
    },
    noBorderOption: {
        borderBottomWidth: 0
    },
    optionImage: {
        width: 25,
        height: 25,
        marginHorizontal: 20
    },
    optionText: {
        flex: 0.8,
        fontSize: 20,
        color: colors.darkGrayText,
    },
    publishDate: {
        fontWeight: '500',
        flex: 2
    },
    headingDescriptionWrapper: {
        flex: 5,
        marginLeft: 10,
        marginRight: 10
    },
    translation: {
        textAlign: 'left',
        width: '100%',
        flex: 0,
        color: 'red',
    },
    textArea: {
        fontSize: 16,
        textAlignVertical: "top",
        minHeight: 100,
        flex: 1,
    },
    textInput: {
        fontSize: 16,
        color: '#000000',
        padding: 15,
        marginHorizontal: 15,
        marginBottom: 5,
        borderColor: colors.boxBorder,
        backgroundColor: colors.elementBackground,
        borderWidth: 1,
    },
    buttonSmallText:{
        textAlign: 'center',
        color: colors.secondary,
    },
    buttonSmallTextAbsolute:{
        position: 'absolute',
        top: 5,
        left: 10,
        width: '100%'
    }
});