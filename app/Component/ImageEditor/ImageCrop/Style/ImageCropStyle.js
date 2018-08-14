import { StyleSheet, Dimensions } from 'react-native';
import AppStyle from '../../../../Styles/AppStyle';
import colors from '../../../../Styles/Colors';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    ...AppStyle,
    container: {
        flex: 1
    },
    loader: {
        height: width * 0.5
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    templatesContainer: {
        flex: 0,
        backgroundColor: '#fff',
        flexDirection: 'row'
    },
    templateContainer: {
        marginTop: 3,
        marginBottom: 3,
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'center'
    },
    template: {
        color: '#909BA7',
        textAlign: 'center'
    },
    templateActive: {
        color: '#2AB45A'
    },
    templateLogoIcon: {
        width: 30,
        height: 30,
        marginTop: 5
    }
});
