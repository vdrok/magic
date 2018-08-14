import {StyleSheet} from 'react-native'
import AppStyle from '../../../Styles/AppStyle'
import Colors from "../../../Styles/Colors";


export default StyleSheet.create({
    ...AppStyle,
    headerLogo: {
        height: 25,
        width: 25,
        marginLeft: 5,
        marginRight: 15
    },
    headerWrapper: {
        minHeight: 50
    },
    headerTitle: {
        padding: 8,
        fontSize: 16,
        fontWeight: "bold"
    },
    header: {
        fontSize: 14,
        fontWeight: 'bold',
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: Colors.textGray
    },
    listItem: {
        marginLeft: 0
    },
    permissionTitle: {
        fontWeight: '500'
    },
    permissionDescription: {
        fontSize: 12,
        color: Colors.textGray
    },
    formWrapper: {
        paddingHorizontal: 8
    },
    input: {
        width: '100%',
        color: '#000000',
        padding: 15,
        borderColor: Colors.boxBorder,
        backgroundColor: Colors.elementBackground,
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 15
    },
    inputDisabled: {
        backgroundColor: Colors.lightGray,
        borderColor: Colors.boxBorder
    },
    errorText: {
        color: Colors.warning
    }
})