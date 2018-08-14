import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import { View, ScrollView, TextInput, ActivityIndicator } from 'react-native';

import Style from './Style/PostComposerStyle';
import Colors from '../../Styles/Colors';
import styles from "../../Screen/Storyline/Style/StorylineScreenStyle";

class PostComposer extends React.Component {
    static propTypes = {
        heading: PropTypes.shape({}).isRequired,
        channelName: PropTypes.string,
        bottomComponent: PropTypes.any,
        onChange: PropTypes.func.isRequired,
        textContent: PropTypes.string.isRequired,
        translationTextContent: PropTypes.string,
        showTranslation: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.state = {
            textContent: this.props.textContent,
            translationTextContent: this.props.translationTextContent,
            busy: false
        };
    }

    componentWillReceiveProps({busy}) {
        this.setState({
            busy: busy,
        });
    }

    render() {
        const {heading, bottomComponent} = this.props;
        if(this.state.busy){
            return <ActivityIndicator size='large' color={Colors.green} style={Style.loader}/>
        }

        return <ScrollView contentContainerStyle={Style.fullHeight}>
            {heading}
            {this._renderTextField()}
            {bottomComponent}

            </ScrollView>
    }

    _renderTextField() {
        const { channelName } = this.props;
        const text = this.props.channelName ? `Want to share an update ${channelName}?` : 'Please select the channel.';
        const content = this.props.showTranslation ? this.state.translationTextContent : this.state.textContent;

        return <TextInput multiline={true}
                       style={Style.textArea}
                       placeholder={text}
                       placeholderTextColor={Colors.textGray}
                       onChangeText={this.onChangeText.bind(this)}
                       value={content}
            />;
    }

    onChangeText(textContent) {
        let data = {};

        if (this.props.showTranslation) {
            data.translationTextContent = textContent;
            this.props.onChange('translation',textContent);
        }
        else {
            data.textContent = textContent;
            this.props.onChange('message',textContent);
        }

        this.setState(data);

    }
}


const mapStateToProps = state => ({
    busy: state.publishing.busy
});

export default connect(mapStateToProps, null)(PostComposer);