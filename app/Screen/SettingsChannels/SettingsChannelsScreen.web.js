import React from 'react';
import { connect } from 'react-redux';
import {  withRouter} from 'react-router-dom'
import {CHANNEL_TYPES, extractQueryParameters} from '../../Helpers';
import './Style/SettingsChannelsScreen.scss'
import ChannelIcon from '../../Component/ChannelIcon/ChannelIconComponent.web'
import ChannelActions from '../../Reducer/ChannelReducer'
import {Creators as SettingsAction} from '../../Reducer/SettingsReducer'
import FacebookManager from '../../Manager/Facebook.web'
import { Feed, Header, Card, Grid, Modal, List, Button, Icon, Checkbox, Image, Message, Loader } from 'semantic-ui-react'
import ChannelApi from '../../API/ApiChannel';
import { GoogleLogin } from 'react-google-login';

class SettingsChannelsScreen extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            twitterBusy: false,
            channels: [],
            newChannels: []
        };
    }

    componentDidMount(){
        this.props.getChannels();
        this.renderRequiredScripts();
        this.submitTwitterChannel();
        this.getInstagramAccessToken();
    }

    submitTwitterChannel() {
        const params = extractQueryParameters(this.props.location.search);
        if (!params || !this.props.twitterOAuthSecret) return;
        this.getTwitterAccountData(params.oauth_token, this.props.twitterOAuthSecret, params.oauth_verifier);
    }

    getTwitterAccountData(oauth_token, oauth_token_secret, oauth_verifier) {
        ChannelApi.getTwitterUserData({
            oauth_token,
            oauth_token_secret,
            oauth_verifier
        }).then(data => {
            const {oauth_token, oauth_token_secret, screen_name, user_id} = data.data;
            this.props.addChannel(user_id, 'twitter', { oauth_token, oauth_token_secret }, screen_name);
            this.props.getChannels();
        });

        this.props.setTwitterOauthSecret(null);
    }

    getInstagramAccessToken() {
        if (window.location.hash.indexOf('access_token') === -1) {
            return;
        }

        const parametersList = extractQueryParameters(window.location.hash.slice(1));

        if (!parametersList || !parametersList.access_token) {
            return;
        }

        this.submitInstagramChannel(parametersList.access_token);
    }

    submitInstagramChannel(token) {
        ChannelApi.getInstagramUserDataWeb({
            url: 'users/self',
            data: {
                access_token: token
            },
            success: (response) => {
                if (response.meta && response.meta.code === 200) {
                    const {username, id} = response.data;
                    this.props.addChannel(id, 'instagram', token, username);
                }
            }
        });
    }

    componentWillReceiveProps({channels}){
        this.setState({
            channels: channels,
            busy: false,
            twitterBusy: false
        });
    }

    renderNewChannelFacebookList(type){
        return this.state.newChannels.filter(channel => channel.type === type).map((channel, i) => {
            const alreadyAdded = this.state.channels.filter(c => c.channel_id === channel.id).length > 0;
            return (<List.Item  active={alreadyAdded} key={channel.id}
                                onClick={()=> {
                                    if(alreadyAdded) return ;

                                    this.state.newChannels.filter(c => c.id === channel.id)[0].selected =
                                        !this.state.newChannels.filter(c => c.id === channel.id)[0].selected;
                                    this.forceUpdate();
                                }}
            >
                <Image avatar src={channel.thumbnail} />
                <List.Content>
                    <List.Header >{channel.name}</List.Header>

                </List.Content>
                <List.Content floated='right'>
                    { alreadyAdded? null: <Checkbox toggle
                                                    checked={this.state.newChannels.filter(c => c.id === channel.id)[0].selected}
                    />}
                    { alreadyAdded? <Icon name='check' className="icon-check" />: null}
                </List.Content>
            </List.Item>);
        });

    }

    renderFacebookNewPopup() {
        let countSelected = this.state.newChannels.filter(c => c.selected === true).length;
        return (<Modal
            closeIcon='close'
            size='small'
            onClose={()=> this.setState({'showPopup': false})}
            open={this.state.showPopup === 'facebook'}>
            <Modal.Header>Which channel to add?</Modal.Header>
            <Modal.Content scrolling>
                <Modal.Description>
                    <h3>Facebook Pages</h3>
                    <List selection verticalAlign='middle' size='large'>
                        { this.renderNewChannelFacebookList(FacebookManager.Types.PAGE) }
                    </List>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color='green' active={countSelected > 0} onClick={ () => this.submitFacebookPages() } >Add {countSelected} channels</Button>
            </Modal.Actions>
        </Modal>)
    }

    submitFacebookPages(){
        this.state.newChannels.filter(c => c.selected === true).map((channel) => {
            this.props.addChannel(channel.id, channel.type, channel.access_token, channel.name);
        });
        this.setState({busy: true, showPopup: false});
    }

    showFacebookPopup() {
        this.state.newChannels = [];
        FacebookManager.getPages().then((data) => {
            this.state.showPopup = 'facebook';
            data.map((e)=> this.state.newChannels.push(e));
            this.forceUpdate();
        });
        FacebookManager.getProfile().then((data) => {
            FacebookManager.getAccessToken().then(accessToken => {
                this.state.showPopup = 'facebook';
                data.access_token = accessToken;
                this.state.newChannels.push(data);
                this.forceUpdate();
            });

        });
    }

    renderNewInstagramBusinessAccountsList() {
        return this.state.newChannels.map(account => {
            const alreadyAdded = this.state.channels.filter(c => c.type === CHANNEL_TYPES.INSTAGRAM_BUSINESS && c.name === account.name).length > 0;

            return <List.Item  active={alreadyAdded} key={account.id}
                               onClick={()=> {
                                   if(alreadyAdded) return ;

                                   this.state.newChannels.filter(c => c.id === account.id)[0].selected =
                                       !this.state.newChannels.filter(c => c.id === account.id)[0].selected;
                                   this.forceUpdate();
                               }}
            >
                {account.thumbnail ?  <Image avatar src={account.thumbnail} /> : null}

                <List.Content>
                    <List.Header>{account.name}</List.Header>
                    <List.Description><ChannelIcon channel='facebook-page' icon={true} color='#9B9B9B' /> <span className='facebook'>{account.pageName}</span></List.Description>
                </List.Content>
                <List.Content floated='right'>
                    { alreadyAdded? null: <Checkbox toggle
                                                    checked={this.state.newChannels.filter(c => c.id === account.id)[0].selected}
                    />}
                    { alreadyAdded? <Icon name='check' className="icon-check" />: null}
                </List.Content>
            </List.Item>
        })
    }

    renderInstagramBusinessPopup() {
        let countSelected = this.state.newChannels.filter(c => c.selected === true).length;
        return <Modal
            className='add-instagram'
            closeIcon='close'
            size='small'
            onClose={()=> this.setState({'showPopup': false})}
            open={this.state.showPopup === 'instagram-business'}>
            <Modal.Header>Which account to add?</Modal.Header>
            <Modal.Content scrolling>
                <Modal.Description>
                    {this.state.newChannels.length ?
                        <List selection verticalAlign='middle' size='large'>
                            {this.renderNewInstagramBusinessAccountsList()}
                        </List>
                        :
                        <div>
                            <Header as="h5">You don't have any instagram business accounts associated with this facebook account</Header>
                            <a href="https://www.facebook.com/business/help/502981923235522" target="_blank" className="text-small">
                                Click here to learn how to Set Up an Instagram Business Account
                            </a>
                        </div>
                    }

                </Modal.Description>
            </Modal.Content>
            {this.state.newChannels.length ?
                <Modal.Actions>
                    <Button color='green' active={countSelected > 0} onClick={ () => this.submitInstagramBusinessAccounts() } >Add {countSelected} accounts</Button>
                </Modal.Actions> : null
            }


        </Modal>
    }

    submitInstagramBusinessAccounts() {
        this.state.newChannels.filter(c => c.selected === true).map((channel) => {
            this.props.addChannel(channel.id, CHANNEL_TYPES.INSTAGRAM_BUSINESS, channel.access_token, channel.name);
        });
        this.setState({busy: true, showPopup: false});
    }

    showInstagramBusinessPopup() {
        this.state.newChannels = [];
        FacebookManager.getPages().then((data) => {
            data.map((item) => {
                FacebookManager.getInstagramBusinessAccount(item).then((data) => {
                    if (data !== null) {
                        this.state.newChannels.push(data)
                    }
                    this.state.showPopup = 'instagram-business'
                    this.forceUpdate()
                })
            });
        });
    }

    renderAddChannels(){

        return (<Card.Group className='add-channels'>
                 <Card key="add-facebook">
                        <Card.Content>
                            <Feed>
                                <Feed.Event>
                                    <Feed.Content onClick={()=> this.setState({'addFacebookExpanded' : !this.state.addFacebookExpanded})}>
                                        <Feed.Summary>
                                            <Header><ChannelIcon channel="facebook" className="image channel-avatar" /> Facebook</Header>
                                        </Feed.Summary>
                                    </Feed.Content>
                                </Feed.Event>
                            </Feed>
                        </Card.Content>
                         {(!this.state.addFacebookExpanded) ? null : <Card.Content extra>
                             <div className='ui two buttons'>
                                <Button onClick={() => {
                                    FacebookManager.loginWithPermissions().then(()=> {
                                        this.showFacebookPopup();
                                        this.setState({'addFacebookExpanded' : false}); }
                                        )}
                                }

                                >Login with Facebook</Button>
                             </div>
                         </Card.Content>}
                 </Card>

                <Card key="add-twitter">
                    <Card.Content>
                        <Feed>
                            <Feed.Event>
                                <Feed.Content onClick={this.addTwitterAccount.bind(this)}>
                                    <Feed.Summary>
                                        <Header>
                                            <ChannelIcon channel="twitter" className="image channel-avatar" />
                                            Twitter
                                            <Loader className="channel-loader" active={ this.state.twitterBusy ? true : false } inline size='small' />
                                        </Header>
                                    </Feed.Summary>
                                </Feed.Content>
                            </Feed.Event>
                        </Feed>
                    </Card.Content>
                </Card>

                <Card key="add-instagram">
                    <Card.Content>
                        <Feed>
                            <Feed.Event>
                                <Feed.Content onClick={()=> this.setState({'addInstagramExpanded' : !this.state.addInstagramExpanded})}>
                                    <Feed.Summary>
                                        <Header><ChannelIcon channel="instagram" className="image channel-avatar" /> Instagram</Header>
                                    </Feed.Summary>
                                </Feed.Content>
                            </Feed.Event>
                        </Feed>
                    </Card.Content>
                    {(!this.state.addInstagramExpanded) ? null : <Card.Content extra>
                        {/*<Header size='small'>Add Instagram Profile</Header>
                        <p>To connect Instagram account, you must first give authorization from the Instagram website</p>
                        <div className='ui two buttons'>
                            <Button onClick={this.addInstagramAccount.bind(this)}>Login with Instagram</Button>
                        </div>*/}
                        <Header size='small'>Add Instagram Business Profile</Header>
                        <p>To connect Instagram Business Profile, you must first give authorization through the Facebook website</p>
                        <div className='ui two buttons'>
                            <Button onClick={() => {
                                FacebookManager.loginWithInstagramPermissions().then(()=> {
                                    this.showInstagramBusinessPopup();
                                    this.setState({'addInstagramExpanded' : false}); }
                                )}
                            }

                            >Login with Facebook</Button>
                        </div>
                    </Card.Content>}
                </Card>

                {this.renderAddYouTube()}

        </Card.Group>

        );
    }

    renderAddYouTube(){

        const that = this;

        return <Card key="add-youtube">
            <Card.Content>
                <Feed>
                    <Feed.Event>
                        <Feed.Content onClick={()=> this.setState({'addYouTubeExpanded' : !this.state.addYouTubeExpanded})}>
                            <Feed.Summary>
                                <Header><ChannelIcon channel="youtube" className="image channel-avatar" /> YouTube</Header>
                            </Feed.Summary>
                        </Feed.Content>
                    </Feed.Event>
                </Feed>
            </Card.Content>
            {(!this.state.addYouTubeExpanded) ? null : <Card.Content extra>
                <GoogleLogin
                    className='google-login'
                    accessType="offline"
                    clientId="135213473005-5eb2o1rjevno8s0acofp96nsv1k829ol.apps.googleusercontent.com"
                    responseType="code"
                    scope="https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtubepartner https://www.googleapis.com/auth/yt-analytics.readonly https://www.googleapis.com/auth/yt-analytics-monetary.readonly"
                    onSuccess={(c)=>{
                        that.props.addChannel('-1', 'youtube', c.code, 'newYouTUbeChannel' );
                    }}
                    onFailure={(c)=>console.log(c)}
                >
                    <Icon name='google'/>
                    <span> Login with Google</span>
                </GoogleLogin>
            </Card.Content>}
        </Card>
    }

    renderChannels(){
        return (<Card.Group >
            {
                this.state.channels.map(channel => {
                    const icon = (typeof channel.type === 'undefined' || channel.type === 'channel type') ? null :
                        <div className="channel-icon"><ChannelIcon channel={channel.type}  /></div>;

                    return <Card key={channel.id}>
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
                </Card>;


                })
            }

            { this.state.channels.length > 0 ? null :
                <Message
                header='No connected channels'
            /> }
        </Card.Group>);
    }

    render() {
        return (<div className="page-settings-channel">

            {this.renderFacebookNewPopup()}
            {this.renderInstagramBusinessPopup()}
            <Grid stackable columns={2}>
                <Grid.Column>
                    <Header as='h2'>Connected Channel</Header>
                    {this.renderChannels()}
                </Grid.Column>

                <Grid.Column>
                    <Header as='h2'>Add Channel</Header>
                    {this.renderAddChannels()}
                </Grid.Column>
            </Grid>
            </div>
        );
    }

    renderRequiredScripts(){

       window.fbAsyncInit = function() {
            FB.init({
                appId            : process.env.FACEBOOK_APP_ID,
                autoLogAppEvents : true,
                xfbml            : false,
                version          : 'v2.11'
            });
        };

        (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
    }

    addTwitterAccount() {
        this.setState({twitterBusy: true });

        ChannelApi.getTwitterAuthUrl(window.location.href)
            .then((response) => {
                if (response.status === 200) {
                    this.props.setTwitterOauthSecret(response.data.oauth_token_secret);
                    window.location = response.data.oauth_url;
                }
            });
    }

    addInstagramAccount() {
        const clientId = "522e0d2f99ca497b9b77a2ea8d696f10";
        const redirectUrl = window.location;
        window.location = `https://api.instagram.com/oauth/authorize/?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=token`
    }

}

SettingsChannelsScreen.propTypes = {
};


const mapStateToProps = state => ({
    channels: state.channel.list,
    twitterOAuthSecret: state.settings.twitterOAuthSecret
});

const mapDispatchToProps = dispatch => ({
    getChannels: () => dispatch(ChannelActions.getChannels()),
    addChannel: (id, type, access_token,name ) => dispatch(ChannelActions.addChannelRequest(id,type, access_token, name, false)),
    setTwitterOauthSecret: (token) => dispatch(SettingsAction.setTwitterOauthSecret(token))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SettingsChannelsScreen));