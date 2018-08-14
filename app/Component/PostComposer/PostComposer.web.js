import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'semantic-ui-react';
import './Style/PostComposer.scss';

class PostComposer extends React.Component {
    static propTypes = {
        heading: PropTypes.shape({}).isRequired,
        channelName: PropTypes.string.isRequired,
        bottomComponent: PropTypes.any,
        onUpdate: PropTypes.func.isRequired,
        textContent: PropTypes.string.isRequired,
        translationContent: PropTypes.string,
        onShowTranslationChange: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            textContent: this.props.textContent,
            translationTextContent: this.props.translationTextContent,
            showTranslation: false
        };
    }

    onClickSwitchTranslation() {
        this.props.onShowTranslationChange(!this.state.showTranslation);
        this.setState({
          showTranslation: !this.state.showTranslation
        });
    }

    onClickOriginal() {
        if (!this.state.showTranslation) {
            return;
        }

        this.onClickSwitchTranslation();
    }

    onClickTranslation() {
        if (this.state.showTranslation) {
            return;
        }

        this.onClickSwitchTranslation();
    }

    render() {
        const {heading, bottomComponent} = this.props;

        return <div >
                {heading}
                {this._renderTranslationSwitch()}
                {this._renderTextArea()}
                {bottomComponent}
            </div>
            ;
    }

    _renderTranslationSwitch() {
        return <div className="translation-switch">
                <Button.Group size='mini'>
                    <Button positive={!this.state.showTranslation} onClick={this.onClickOriginal.bind(this)}>Post</Button>
                    <Button.Or />
                    <Button positive={this.state.showTranslation} onClick={this.onClickTranslation.bind(this)}>Translation</Button>
                </Button.Group>
            </div>;

        return <div>
            <p onClick={this.onClickSwitchTranslation.bind(this)}>
                <Icon name={'translate'} size={'big'} /> Show {this.state.showTranslation ? 'post' : 'translation'}.
            </p>
        </div>;
    }

    _renderTextArea() {
        const value = this.state.showTranslation ? this.state.translationTextContent : this.state.textContent;

        return <textarea className="post-text"
                          cols="30"
                          rows="10"
                          value={value}
                          onChange={this.onChangeText.bind(this)}
                          placeholder={`Want to share an update ${this.props.channelName}${this.state.showTranslation ? ' (Translation)' : ''}?`}
                          />;
    }

    onChangeText(event) {
        const textContent = event.target.value;
        let data = {};

        if (this.state.showTranslation) {
            data.translationTextContent = textContent;
            this.props.onUpdate('translation',textContent);
        }
        else {
            data.textContent = textContent;
            this.props.onUpdate('message',textContent);
        }

        this.setState(data);
    }
}

export default PostComposer;