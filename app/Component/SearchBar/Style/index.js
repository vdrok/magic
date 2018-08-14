import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    searchWrapper: {
        marginVertical: 10,
        height: 30,
        flex: 0,
        width: '100%',
        flexWrap: 'wrap',
        alignItems: 'center',
        flexDirection:'row',
        backgroundColor: "#8A8A8F"
    },
    searchIcon: {
        color: '#8A8A8F',
        paddingLeft: 10,
        paddingRight: 5
    },
    searchBar: {
        fontSize: 18,
        height: 36,
        flex: .9
    }
});