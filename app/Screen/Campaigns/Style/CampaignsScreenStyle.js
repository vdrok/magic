import { StyleSheet } from 'react-native'
import AppStyle from '../../../Styles/AppStyle'
import Colors from '../../../Styles/Colors'

export default StyleSheet.create({
    ...AppStyle,
    header:{
        fontSize: 18,
        paddingLeft: 15,
        fontWeight: '500',
        marginVertical: 15,
    },
    container:{
        flex: 1,
        position: 'relative',
    },
    sectionWrapper:{
        borderTopWidth: 1,
        borderTopColor: '#D8D8D8',
        borderBottomWidth: 1,
        borderBottomColor: '#D8D8D8',
        backgroundColor: Colors.elementBackground,
    },
    sectionText:{
        fontSize: 13,
        paddingLeft: 15,
        paddingVertical: 8,
    },
    campaignBox:{
        position: 'relative',
        marginHorizontal: 15,
        marginVertical: 4,
        flexDirection: 'row',
        padding: 8,
    },
    campaignImageWrapper: {
        width: 80,
        height: 80,
        flex: 0,
        marginRight: 5,
    },
    campaignImage: {
        width: 80,
        flex: 1,
        resizeMode: 'contain',
        alignSelf: 'stretch',

    },
    campaignTextWrapper:{
        flexDirection: 'column',
        flex: 1,
    },
    campaignTitle:{
        fontSize: 17,
        fontWeight: '300',
        paddingRight: 15,
        marginBottom: 4,
    },
    campaignDescription: {
        fontSize: 13,
    },
    button:{
        position: 'absolute',
        zIndex: 20,
        right: 8,
        bottom: 10
    },
    list:{
        paddingBottom: 80,
    },
    campaignArrow:{
        position: 'absolute',
        right: 8,
        top: 8,
        width: 20,
        height: 30,
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.0)'
    },
    disabledBackground: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)'
    },
    disabledText: {
        color: Colors.textGray
    }
})