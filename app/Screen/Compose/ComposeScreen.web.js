import React from 'react';
import { withRouter} from 'react-router-dom';
import './Style/ComposeScreen.scss';
import ChannelListComponent from '../../Component/ChannelList/ChannelListComponent.web';
import { Header, Card, Container} from 'semantic-ui-react';

class ComposeScreen extends React.Component {
    render() {
        return <Container className="page-compose">
            <Header as="h1">Select publishing channel</Header>
            <Card.Group>
                <ChannelListComponent onClickHandler={this.goToChannel.bind(this)}/>
            </Card.Group>
        </Container>;
    }

    goToChannel(channel) {
        this.props.history.push('/channel-posts', {
            channel
        });
    }
}

export default withRouter(ComposeScreen);