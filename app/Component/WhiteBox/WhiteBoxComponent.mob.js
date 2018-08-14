import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, TouchableHighlight } from 'react-native';
import defaultStyles from './Style/WhiteBoxComponentStyle'


class WhiteBox extends React.PureComponent {

    static propTypes = {
        style: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.number,
            PropTypes.shape({}),
        ]),
        onLayout: PropTypes.func,
        onPress: PropTypes.func,
    }

    render() {
        const { style, onPress} = this.props;

        if(onPress){
            return <TouchableHighlight onPress={this.props.onPress} >
                <View style={[defaultStyles.wrapper, style]} onLayout={this.props.onLayout}>
                {this.props.children}
                </View>
            </TouchableHighlight>
        }

        return (
            <View style={[defaultStyles.wrapper, style]} onLayout={this.props.onLayout}>
                {this.props.children}
            </View>
        )
    }
}



export default WhiteBox;