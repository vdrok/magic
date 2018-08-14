import { StyleSheet } from 'react-native'
import Colors from '../../../Styles/Colors'
export default StyleSheet.create({
    wrapper:{
        flex: 0,
        width: '100%',
        flexDirection: 'row',
        paddingTop: 0,
        paddingBottom: 0,
        height: 35,
        alignItems: 'center',
    },
    selectedWrapper:{
        height: 35,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderRightWidth: 0,
    },
    iconWrapper:{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 0,
    },
    thumbImg:{
        width: 45,
        height: '100%',
        flex: 0,
    },
    thumbImgSelected:{
        width: 30,
    },
    editIcon:{
        marginRight: 5,
    },
    channelIcon:{
        padding: 0,
        margin: 0,
    },


    //modal
    contentWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    container: {
        backgroundColor: '#fff',
        alignSelf: 'center',
        width: '80%',
        minHeight: 225
    },
    closeButton: {
        width: 30,
        height: 30,
        position: 'absolute',
        top: 15,
        right: 5,
        backgroundColor: 'transparent'
    },
    closeText: {
        color: '#000',
        textAlign: 'center'
    },
    content: {
        marginHorizontal: 15,
        marginVertical: 30
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 15
    },
    input: {
        width: '100%',
        //color: '#000000',
        padding: 15,
        borderColor: Colors.boxBorder,
        backgroundColor: Colors.elementBackground,
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 15
    },
    inputError: {
        borderColor: Colors.warning,
    },
});