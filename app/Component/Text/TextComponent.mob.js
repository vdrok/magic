import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import styles from './Style/TextStyle'

/**
 * This component implement the default style for the text
 */
export default class TextComponent extends React.Component {

    static propTypes = {
        style: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.number,
            PropTypes.shape({}),
        ])
    }

    render() {
        const { style } = this.props;
        return (<Text style={[styles.text,style]}>
            {this.props.children}
        </Text>)
    }
}