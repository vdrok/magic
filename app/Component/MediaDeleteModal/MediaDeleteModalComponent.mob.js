import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Modal, Text, TouchableWithoutFeedback } from 'react-native';

import { Creators as MediaFilesAction } from '../../Reducer/MediaFilesReducer';
import Button from '../Button/ButtonComponent.mob';
import Style from './Style/MediaDeleteModalStyle';

class MediaDeleteModalComponent extends React.Component {
    static propTypes = {
        media: PropTypes.shape({}).isRequired,
        onSuccess: PropTypes.func
    };

    static defaultProps = {
        onSuccess: () => {}
    };

    constructor(props) {
        super(props);

        this.state = {
            opened: false,
            error: null
        };

        this.hide = this.hide.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (this.props.responseDelete !== newProps.responseDelete) {
            this.submitCallback(newProps.responseDelete);
        }
    }

    show() {
        this.setState({
            opened: true
        });
    }

    hide() {
        this.setState({
            opened: false,
            error: null
        });
    }

    submit() {
        this.props.deleteMediaFile(this.props.media.id);
    }

    submitCallback(response) {
        if (response === 'success') {
            this.setState({
                error: null,
                opened: false
            });
            this.props.onSuccess();
        } else if (response === 'error') {
            this.setState({
                error: 'Error while saving. Please try again or contact tech support.'
            });
        }
    }

    render() {
        return (
            <Modal animationType={'fade'} visible={this.state.opened} transparent>
                <View style={Style.contentWrapper}>
                    <View style={Style.container}>
                        <TouchableWithoutFeedback onPress={this.hide}>
                            <View style={Style.closeButton}>
                                <Text style={Style.closeText}>X</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={Style.content}>
                            <Text style={Style.heading}>Delete media</Text>
                            <Text>
                                Are you sure you want to delete{' '}
                                <Text style={Style.textBold}>{this.props.media.name}</Text>?
                            </Text>
                            {this.state.error && (
                                <Text style={Style.errorMessage}>{this.state.error}</Text>
                            )}
                            <View style={Style.contentActions}>
                                <Button style={Style.btnDanger} onPress={this.submit}>
                                    <Text>Yes</Text>
                                </Button>
                                <Button onPress={this.hide}>
                                    <Text>No</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    loading: state.media.loading,
    responseDelete: state.media.responseDelete
});

const mapDispatchToProps = dispatch => ({
    deleteMediaFile: id => dispatch(MediaFilesAction.deleteMediaFile(id))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { withRef: true }
)(MediaDeleteModalComponent);
