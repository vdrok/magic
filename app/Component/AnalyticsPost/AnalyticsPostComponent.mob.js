import React from 'react';
import {Text, View, TouchableWithoutFeedback} from 'react-native';
import PropTypes from 'prop-types';

import {numberFormatWithSeparator } from '../../Helpers'

import style from './Style/AnalyticsPostStyle';
import PublishingContentSmallComponent from "../PublishingContentSmall/PublishingContentSmallComponent.mob";
import {stats_description} from "../../Helpers/AnalyticsProps";

class AnalyticsPostComponent extends React.Component {

    static propTypes = {
        post: PropTypes.shape({}).isRequired,
        onClickHandler: PropTypes.func,
        withAnalytics: PropTypes.bool,
        postAnalytics: PropTypes.object,
        displayAnalytics: PropTypes.object,
        showChannel: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.state = {
            post: props.post,
            onClickHandler: props.onClickHandler,
            withAnalytics: props.withAnalytics || false,
            postAnalytics: {},
            displayAnalytics: {},
            showChannel: props.showChannel || !(props.showChannel === false)
        }

        this.onClickHandler = this.onClickHandler.bind(this)
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            postAnalytics: newProps.postAnalytics || {},
            displayAnalytics: newProps.displayAnalytics || {},
        })
    }

    render() {
        return <TouchableWithoutFeedback onPress={this.onClickHandler.bind(this)}>
            {this._renderInnerContent()}
        </TouchableWithoutFeedback>
    }

    _renderInnerContent() {
        const innerContentStyle = this.state.showChannel ? {} : style.innerContentStyle;

        return <View style={[style.innerContentWrapper, innerContentStyle]}>
            <View style={style.innerContent}>
                <PublishingContentSmallComponent post={this.state.post} showChannel={this.state.showChannel}/>
            </View>
            {this._renderStats()}
        </View>
    }

    _renderStats() {
        if (!this.state.withAnalytics) {
            return null
        }

        const { channel } = this.props.post
        const description = this.state.displayAnalytics.key ? stats_description[this.state.displayAnalytics.key][channel.type] : ''

        return <View style={style.statsWrapper}>
            <Text style={style.statsValue}>{numberFormatWithSeparator(this.state.postAnalytics[this.state.displayAnalytics.key])}</Text>
            <Text style={style.statsDescription}>{description}</Text>
        </View>
    }

    onClickHandler() {
        if (this.props.onClickHandler) {
            this.props.onClickHandler(this.props.post)
        }
    }
}

export default AnalyticsPostComponent;