import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Message } from 'semantic-ui-react';

import APICampaigns from '../../API/ApiCampaigns';

class CampaignEditModalComponent extends React.Component {
    static propTypes = {
        campaign: PropTypes.shape({}).isRequired,
        onCloseCallback: PropTypes.func,
        onSuccessCallback: PropTypes.func
    };

    static defaultProps = {
        onCloseCallback: () => {},
        onSuccessCallback: () => {}
    };

    constructor(props) {
        super(props);

        this.state = {
            opened: false,
            saving: false,
            error: {},
            errorMessage: null
        };

        this.close = this.close.bind(this);
        this.onChangeListener = this.onChangeListener.bind(this);
        this.submit = this.submit.bind(this);
    }

    show() {
        this.setState({
            opened: true,
            name: this.props.campaign.name
        });
    }

    close() {
        this.props.onCloseCallback();
        this.setState({
            opened: false,
            saving: false,
            error: {},
            errorMessage: null
        });
    }

    submit() {
        if (!this.validate()) {
            return;
        }

        const data = {
            name: this.state.name
        };

        this.setState({
            saving: true
        });

        APICampaigns.updateCampaign(this.props.campaign.id, data)
            .then(success => {
                this.setState({ saving: false });
                this.props.onSuccessCallback(data);
            })
            .catch(error => {
                this.setState({
                    saving: false,
                    error: {
                        saving: true
                    },
                    errorMessage:
                        error.response.status === 400
                            ? error.response.data.message
                            : 'Error while saving. Please try again or contact tech support'
                });
            });
    }

    validate() {
        if (!this.state.name) {
            this.setState({
                error: {
                    name: true
                },
                errorMessage: 'Name is required'
            });
            return false;
        }

        this.setState({
            error: {},
            errorMessage: null
        });
        return true;
    }

    onChangeListener(attributes) {
        this.setState({
            [attributes.target.name]: attributes.target.value
        });
    }

    render() {
        return (
            <Modal open={this.state.opened} closeIcon={true} onClose={this.close}>
                <Modal.Header>Edit campaign</Modal.Header>
                <Modal.Content>
                    <Form
                        error={Object.keys(this.state.error).length > 0}
                        loading={this.state.saving}
                    >
                        <Form.Field required error={this.state.error.name}>
                            <label>Name</label>
                            <input
                                name="name"
                                value={this.state.name}
                                required
                                placeholder="Name"
                                onChange={this.onChangeListener}
                            />
                        </Form.Field>
                        <Message error content={this.state.errorMessage} />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Form.Button onClick={this.submit}>Submit</Form.Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

export default CampaignEditModalComponent;
