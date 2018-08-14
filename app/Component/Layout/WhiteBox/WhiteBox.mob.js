import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, ViewPropTypes } from 'react-native';
import style from './Style/WhiteBox'

export default class WhiteBox extends React.PureComponent {

    static propTypes = {
        selected: PropTypes.bool,
        onPress: PropTypes.func,
        style: PropTypes.oneOf([ViewPropTypes,PropTypes.object ]),
    };

    constructor(props) {
        super(props);
    }

    render() {

        const s = this.props.selected ?
            [style.wrapper, style.selected, this.props.style] :
            [style.wrapper, this.props.style];

        if(this.props.onPress){
            return <TouchableOpacity style={s} onPress={this.props.onPress}>
                {this.props.children}
            </TouchableOpacity>
        }

        return <View style={s}>
            {this.props.children}
        </View>
    }

}