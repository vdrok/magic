import { StyleSheet, Dimensions } from 'react-native';
import AppStyle from '../../../Styles/AppStyle';
import Colors from '../../../Styles/Colors';
const win = Dimensions.get('window');

export default StyleSheet.create({
    ...AppStyle,
    container: {
        backgroundColor: '#fff'
    },
    thumbnail: {
        height: 200,
        width: win.width
    },
    iconPlay: {
        alignSelf: 'center',
        flex: 1,
        marginTop: 50,
        backgroundColor: Colors.transparent
    },
    infoBox: {
        width: win.width,
        marginTop: -23
    },
    infoHeading: {
        backgroundColor: Colors.transparentHeadingBgColor,
        paddingTop: 3,
        paddingBottom: 3
    },
    infoWrapper: {
        backgroundColor: 'rgb(241, 241, 241)',
        paddingBottom: 10,
        paddingTop: 10
    },
    headingText: {
        textAlign: 'center',
        fontWeight: 'bold'
    },
    infoColumn: {
        flex: 1,
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
    infoText: {
        flex: 1
    },
    labelField: {
        color: Colors.labelColor,
        width: 30
    },
    dataList: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    folderInfo: {
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 20
    },
    folderName: {
        fontSize: 16,
        lineHeight: 32,
        paddingLeft: 5,
        fontWeight: 'bold'
    },
    fileNameView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    fileNameContainer: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    fileName: {
        fontSize: 16,
        paddingLeft: 11,
        marginTop: 5
    },
    fileNameEditContainer: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    fileNameEdit: {
        marginTop: 5,
        paddingLeft: 10,
        paddingRight: 10
    },
    fileNameError: {
        paddingLeft: 11,
        color: Colors.warning
    },
    composeButton: {
        marginTop: 30
    },
    downloadButton: {
        marginTop: 0,
    },
    downloadButtonSection: {
        marginTop: 10,
    },
    changeThumbnailButton: {
        marginTop: 10
    },
    deleteButton: {
        marginTop: 5,
        paddingLeft: 23,
        paddingRight: 23
    },
    modalContainer: {
        zIndex: 20,
        position: 'relative',
        flex: 1,
        justifyContent: 'center'
    },
    iconClose: {
        zIndex: 30,
        position: 'absolute',
        top: 30,
        right: 15,
        backgroundColor: Colors.transparent
    },
    progressBarWrapper: {
        flex: 1,
        alignItems: 'center',
        marginTop: 5,
    },
    modalContentWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContentContainer: {
        backgroundColor: '#fff',
        alignSelf: 'center',
        width: win.width - 30,
        minHeight: 225
    },
    modalCloseButton: {
        width: 30,
        height: 30,
        position: 'absolute',
        top: 15,
        right: 5,
        backgroundColor: 'transparent'
    },
    modalCloseText: {
        color: '#000',
        textAlign: 'center'
    },
    modalContent: {
        marginHorizontal: 15,
        marginVertical: 30
    },
    modalHeading: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 15
    },
    modalInput: {
        width: '100%',
        color: '#000000',
        padding: 15,
        borderColor: Colors.boxBorder,
        backgroundColor: Colors.elementBackground,
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 15
    },
    modalInputError: {
        borderColor: Colors.warning
    },
    modalErrorMessage: {
        color: Colors.warning
    }
});
