import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import styles from './Style/ButtonStyle'
import colors from "../../Styles/Colors";

/**
 * This component implement the default style for the text
 */
export default class ButtonComponent extends React.Component {

    static propTypes = {
        style: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.number,
            PropTypes.shape({}),
        ]),
        textStyle:PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.number,
            PropTypes.shape({}),
        ]),
        onPress: PropTypes.func.isRequired,
        active: PropTypes.bool.isRequired,
        busy: PropTypes.bool,
        secondary: PropTypes.bool
    }

    constructor(props){
        super(props);
        this.state = {
            busy: props.busy,
            active: props.active,
        }
    }

    componentWillReceiveProps({busy, active}) {
        this.setState({
            busy: busy,
            active: active
        });
    }

    handlePress(){
        if(this.state.busy || !this.state.active){
            return;
        }
        this.props.onPress();
    }

    render() {

        const { style, textStyle, secondary} = this.props;
        const { active, busy } = this.state;
        const inactiveStyle = (!active || busy)?   styles.chooseButtonInactive : null;
        const secondaryStyle = secondary === true ? styles.chooseButtonSecondary : null;
        const secondaryTextStyle = secondary === true ? styles.chooseButtonTextSecondary : null;


        return (<TouchableOpacity onPress={this.handlePress.bind(this)} style={[styles.chooseButton, secondaryStyle, style, inactiveStyle]}>
            <View >
                {busy && <ActivityIndicator color={colors.white} />}
                <Text style={[styles.chooseButtonText, secondaryTextStyle, textStyle]}>{this.props.children}</Text>
            </View>
        </TouchableOpacity>)
    }
}

ButtonComponent.defaultProps = {
    active: true,
    busy: false
}