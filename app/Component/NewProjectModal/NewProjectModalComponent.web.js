import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form} from 'semantic-ui-react';
import './Style/NewProjectModal.scss'

class NewProjectModalComponent extends React.Component {
    static propTypes = {
        onSubmitCallback: PropTypes.func.isRequired
    };

    constructor(props){
        super(props);
        this.state = {
            visible: false,
            errorMessage: null
        }
    }

    show() {
        this.setState({
            visible: true
        });
    }

    hide() {
        this.setState({
            visible: false,
            name: "",
            errorMessage: null
        });
    }

    render() {
        return <Modal open={this.state.visible} closeIcon onClose={() => this.hide()}>
            <Modal.Header>
                New project +
            </Modal.Header>
            <Modal.Content>
                <Form error={!!this.state.errorMessage} loading={false} >
                    <Form.Field required error={!!this.state.errorMessage}>
                        <label>Name</label>
                        <input name="name" required placeholder='Name' onChange={this.onChangeListener.bind(this)} />
                        {this.state.errorMessage ? <span className="text-danger">{this.state.errorMessage}</span> : null}
                        <p className="description">Projects allow you to work with a different team on a different publishing channels</p>
                    </Form.Field>
                </Form>


            </Modal.Content>
            <Modal.Actions>
                <Form.Button color='green' onClick={this.submit.bind(this)}>
                    Submit
                </Form.Button>
            </Modal.Actions>

        </Modal>
    }

    onChangeListener(attributes) {
        this.setState({
            [attributes.target.name]: attributes.target.value
        })
    }

    submit(){
        if(!this.state.name || !this.state.name.length){
            this.setState({
                errorMessage: "Please enter an name"
            });

            return;
        }

        this.props.onSubmitCallback( {
            name: this.state.name
        });

        this.setState({
            errorMessage: null,
            visible: false,
            name: ''
        });
    }
}

export default NewProjectModalComponent;