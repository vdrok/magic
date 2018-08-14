import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './Style/ChannelListStyle.scss'
import ChannelIcon from '../ChannelIcon/ChannelIconComponent.web'
import ChannelActions from '../../Reducer/ChannelReducer'
import { Feed, Header, Card} from 'semantic-ui-react'


class ComposeScreen extends React.Component {
    static propTypes = {
        onClickHandler: PropTypes.func.isRequired
    };

    constructor(){
        super();

        this.state = {
            channels: []
        }
    }

    componentDidMount(){
        this.props.getChannels();
    }

    componentWillReceiveProps({channels}){
        this.setState({
            channels: channels
        })
    }

    render() {
        return this.state.channels.map((channel) => {
                const icon = (typeof channel.type === 'undefined') ? null :
                    <div className="channel-icon"><ChannelIcon channel={channel.type} /></div>;

                return <Card key={channel.id} onClick={() => this.props.onClickHandler(channel)}>
                    <Card.Content>
                        <Feed>
                            <Feed.Event>
                                <Feed.Content>
                                    <Feed.Summary>
                                        <Header>{icon} {channel.name}</Header>
                                    </Feed.Summary>
                                </Feed.Content>
                            </Feed.Event>
                        </Feed>
                    </Card.Content>
                </Card>
            }
        );
    }
}


const mapStateToProps = state => ({
    channels: state.channel.list
});

const mapDispatchToProps = dispatch => ({
    getChannels: () => dispatch(ChannelActions.getChannels())
});

export default connect(mapStateToProps, mapDispatchToProps)(ComposeScreen);