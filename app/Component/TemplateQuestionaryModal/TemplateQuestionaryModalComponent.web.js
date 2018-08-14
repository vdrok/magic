import React from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Icon, Modal, Form, Message } from 'semantic-ui-react';
import moment from 'moment';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

class TemplateQuestionaryModalComponent extends React.Component {
    static propTypes = {
        template: PropTypes.object.isRequired,
        closeCallback: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            error: {},
            errorMessage: null
        };

        this.updateValue = this.updateValue.bind(this);
    }

    render() {
        return (
            <Modal
                open={true}
                closeIcon
                onClose={() => this.props.closeCallback()}
                onRequestClose={() => this.props.closeCallback()}
            >
                <Modal.Header>{this.props.template.name}</Modal.Header>
                <Modal.Content>
                    <Form error={Object.keys(this.state.error).length > 0} loading={false}>
                        <Form.Field required error={this.state.error.name}>
                            <label>name</label>
                            <input
                                name="name"
                                required
                                placeholder="Story name"
                                onChange={e => this.updateValue(e.target.name, e.target.value)}
                            />
                        </Form.Field>

                        <Form.Field required error={this.state.error.startDate}>
                            <label>start date</label>
                            <Datetime
                                dateFormat="DD MMM YYYY"
                                timeFormat={false}
                                onChange={v => {
                                    const parsedDate = moment(v, 'DD MMM YYYY').format(
                                        'YYYY-MM-DD'
                                    );
                                    this.updateValue('startDate', parsedDate);
                                }}
                                inputProps={{ placeholder: 'Start date', readOnly: true }}
                            />
                        </Form.Field>

                        <Form.Field>
                            <label>end date</label>
                            <Datetime
                                dateFormat="DD MMM YYYY"
                                timeFormat={false}
                                onChange={v => {
                                    const parsedDate = moment(v, 'DD MMM YYYY').format(
                                        'YYYY-MM-DD'
                                    );
                                    this.updateValue('endDate', parsedDate);
                                }}
                                inputProps={{ placeholder: 'End date', readOnly: true }}
                            />
                        </Form.Field>
                        <Message error header="Fix the form" content={this.state.errorMessage} />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Form.Button onClick={() => this.submit()}>Create</Form.Button>
                </Modal.Actions>
            </Modal>
        );
    }

    submit() {
        if (!this.validate()) {
            return;
        }

        this.props.closeCallback(true, {
            name: this.state.name,
            startDate: this.state.startDate,
            endDate: this.state.endDate
        });
    }

    validate() {
        if (!this.state.name) {
            this.setState({
                error: {
                    name: true
                },
                errorMessage: 'Story name is required'
            });
            return false;
        }

        if (!this.state.startDate) {
            this.setState({
                error: {
                    startDate: true
                },
                errorMessage: 'Start date is required'
            });
            return false;
        }

        if (!moment(this.state.startDate).isValid()) {
            this.setState({
                error: {
                    startDate: true
                },
                errorMessage: 'The start date is not valid date format'
            });
            return false;
        }

        this.setState({
            error: {},
            errorMessage: null
        });

        return true;
    }

    updateValue(property, value) {
        this.setState({
            [property]: value
        });
    }
}

export default TemplateQuestionaryModalComponent;
