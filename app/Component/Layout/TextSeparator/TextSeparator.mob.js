import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import style from './Style/TextSeparator'

export default class TextSeparator extends React.PureComponent {

    static propTypes = {
        text: PropTypes.string.isRequired,
        style: Text.propTypes.style,
    };

    render() {
        return <Text style={[style.text, this.props.style]}>
            {this.props.text}
        </Text>
    }

}