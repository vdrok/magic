import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Form, Message, Button } from 'semantic-ui-react';

import { Creators as MediaFilesAction } from '../../Reducer/MediaFilesReducer';

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
            <Modal open={this.state.opened} closeIcon={true} onClose={this.hide}>
                <Modal.Header>Delete media</Modal.Header>
                <Modal.Content>
                    <Form error={!!this.state.error} loading={this.props.loading}>
                        <p>
                            Are you sure you want to delete <strong>{this.props.media.name}</strong>?
                        </p>
                        <Message error content={this.state.error} />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button positive onClick={this.submit}>
                        Yes
                    </Button>
                    <Button onClick={this.hide}>No</Button>
                </Modal.Actions>
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
