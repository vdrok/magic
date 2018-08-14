import { StyleSheet } from 'react-native';
import AppStyle from '../../../Styles/AppStyle';
import colors from '../../../Styles/Colors';

export default StyleSheet.create({
    ...AppStyle,
    campaignListElementRowWrap: {
        marginBottom: 5,
    },
    campaignListElementRow: {
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
        borderBottomWidth: 0
    },
    campaignListElement: {
        flex: 1,
        marginBottom: 0
    },
    campaignListElementInner: {
        flex: 1
    },
    name: {
        fontSize: 21,
        paddingBottom: 0,
        paddingRight: 30
    },
    date: {
        fontSize: 12,
        flex: 0.8,
        color: colors.textGray
    },
    typeLabel: {
        color: colors.textGray
    },
    type: {
        marginTop: 20,
        color: colors.textGray,
    },
    analytics:{
        fontSize: 17,
        color: colors.textGray,
    },
    analyticsValueWrapper:{
      minWidth: 80,
    },
    analyticsValue:{
        color: colors.LinkColor,
        paddingRight: 5,
    },
    spacer:{
        height: 15,
        width: '100%'
    }
});
