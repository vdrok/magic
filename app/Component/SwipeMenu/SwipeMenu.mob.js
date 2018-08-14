import React from 'react';
import { View, TouchableWithoutFeedback, Text } from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import PropTypes from 'prop-types';
import {Keyboard} from 'react-native'

import style from './Style/SwipeMenuStyle';

class SwipeMenu extends React.Component {
    static propTypes = {
        expanded: PropTypes.bool,
        closedText: PropTypes.string,
        style: PropTypes.any,
    };


    constructor(props) {
        super(props);

        this.state = {
            opened: this.props.expanded
        };

        this.swipeDown = this.swipeDown.bind(this);
        this.swipeUp = this.swipeUp.bind(this);
    }

    render() {
        const localStyle = this.props.style ? this.props.style: null;
        return <View style={[style.container, localStyle]}>
            <GestureRecognizer
                onSwipeUp={this.swipeUp}
                onSwipeDown={this.swipeDown}>
                <TouchableWithoutFeedback onPress={this.swipeUp.bind(this)}>
                    <View>
                        <View style={style.line}>
                        </View>
                        {this._renderClosedText()}
                    </View>
                </TouchableWithoutFeedback>

            </GestureRecognizer>
            {this._renderOpenContent()}

        </View>
    }

    _renderClosedText() {
        if (this.state.opened) return;
        return <Text style={style.closedText}>{this.props.closedText}</Text>;
    }

    _renderOpenContent() {
        if (!this.state.opened)
            return;

        return <View>
            {this.props.children}
        </View>
    }

    swipeUp() {
        this.setState({
            opened: true
        });
        Keyboard.dismiss();
    }

    swipeDown() {
        this.setState({
            opened: false
        });
        Keyboard.dismiss();
    }
}

SwipeMenu.defaultProps = {
    expanded: false
};

export default SwipeMenu;