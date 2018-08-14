import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import defaultStyles from './Style/RowItemStyle'


class RowItem extends React.PureComponent {

    static propTypes = {
        style: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.number,
            PropTypes.shape({}),
        ]),
        hideTopBorder: PropTypes.bool,
    }

    render() {
        const { style, hideTopBorder } = this.props;

        let additionalStyle = {};
        if(hideTopBorder){
            additionalStyle.borderTopWidth = 0;
        }

        return (
            <View style={[defaultStyles.wrapper, additionalStyle ,style]} onLayout={this.props.onLayout}>
                {this.props.children}
            </View>
        )
    }
}

RowItem.defaultProps = {
    hideTopBorder: false
};

export default RowItem;