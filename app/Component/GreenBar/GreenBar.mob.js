import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, ViewPropTypes } from 'react-native'
import { Icon }  from 'react-native-elements'
import styles from "./Style/GreenBarStyle";
/**
 * This component implement the default style for the text
 */
export default class GreenBar extends React.Component {

    static propTypes = {
        text: PropTypes.string.isRequired,
        icon: PropTypes.string,
        style: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.number,
            PropTypes.shape({}),
        ]),
    }

    constructor(){
        super()
    }



    renderIcon(){
        if(this.props.icon){
            return  <Icon name={this.props.icon} color='#fff' size={22}/>
        }
    }

    render() {
            return <View style={[styles.flexList, styles.greenBarWrapper, this.props.style]}>
                <View style={styles.rowWrapper}>
                    {this.renderIcon()}
                    <Text style={styles.greenBarText}>
                        {this.props.text}
                    </Text>
                </View>
            </View>;
    }
}