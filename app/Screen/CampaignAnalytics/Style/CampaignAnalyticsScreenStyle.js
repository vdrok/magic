import {StyleSheet} from 'react-native'
import AppStyle from '../../../Styles/AppStyle'
import colors from '../../../Styles/Colors'

export default StyleSheet.create({
    ...AppStyle,
    tabsContainer: {
        flex: 1
    },
    postsContainer: {
        flex: 2,
        backgroundColor: colors.white
    },
    channelsContainer: {
        flex: 1,
        backgroundColor: colors.white,
        paddingBottom: 15
    },
    campaignHeader: {
        fontSize: 16,
        marginLeft: 5,
        marginVertical: 25
    }
})