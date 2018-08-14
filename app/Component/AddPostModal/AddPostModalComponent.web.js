import React from 'react';
import PropTypes from 'prop-types';
import { Card, Header, Modal } from 'semantic-ui-react';
import ChannelListComponent from '../ChannelList/ChannelListComponent.web';

class AddPostModalComponent extends React.Component {
    static propTypes = {
        onClick: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            opened: false
        };
    }

    show() {
        this.setState({
            opened: true
        });
    }

    close() {
        this.setState({
            opened: false
        });
    }


    render() {
        return <Modal open={this.state.opened} closeIcon onClose={this.close.bind(this)}>
            <Header as="h1">Select publishing channel</Header>

            <Modal.Content>
                <Card.Group>
                    <ChannelListComponent onClickHandler={(channel) => this.props.onClick(channel)}/>
                </Card.Group>
            </Modal.Content>
        </Modal>
    }
}

export default AddPostModalComponent;