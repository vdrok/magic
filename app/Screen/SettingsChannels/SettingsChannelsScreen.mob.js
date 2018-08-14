import React from 'react';
import {connect} from 'react-redux';
import {View, Image, ScrollView, Modal, Button, Alert, NativeModules, Linking, TouchableWithoutFeedback} from 'react-native';
import {CHANNEL_TYPES, logo} from '../../Helpers';
import styles from './Style/SettingsChannelsScreenStyle';
import Text from '../../Component/Text/TextComponent.mob'
import Colors from '../../Styles/Colors'
import ChannelActions from '../../Reducer/ChannelReducer'
import ChannelIcon from '../../Component/ChannelIcon/ChannelIconComponent.mob'
import ButtonComponent from '../../Component/Button/ButtonComponent.mob';
import FacebookManager from '../../Manager/Facebook.mob'
import InstagramModalComponent from '../../Component/InstagramModal/InstagramModalComponent.mob';
import {List, ListItem} from 'react-native-elements'
import { Icon } from 'react-native-elements'
import ChannelApi from '../../API/ApiChannel';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import Platform from "../../Helpers/Platform";

const { RNTwitterSignIn } = NativeModules;

const TWITTER_KEYS = {
    //Dev Parse keys
    TWITTER_COMSUMER_KEY: 'biKRggy9zhQVjT2xs45C12bZG',
    TWITTER_CONSUMER_SECRET: 'ooN6FP2Rr6xgb8e4Eb7NeDIf2vTYwLs8WhWL27nnsB3rk4T1KN',
};

interface TwitterResponse {
    authToken: string,
    authTokenSecret: string,
    email: string,
    userID: string,
    userName: string
}

interface InstagramUserData {
    status: number,
    data: {
        data: {
            id: string,
            name: string
        }
    }
}


class SettingsChannelsScreen extends React.Component {
    static navigationOptions = ({ navigation }) =>  {
        return {
        title: <Image source={logo} style={styles.header_logo}/>,
        tabBarLabel: 'Settings',
        tabBarIcon: ({tintColor}) => (
            <Icon name="more-horiz" size={30} color={tintColor}/>
        ),
        headerLeft: <Button
            title="Back"
            onPress={() => { navigation.goBack(null) }}
        />,

    }};

    constructor() {
        super();
        this.state = {
            channels: [], // list of connected channel
            showPopup: false, // if the popup should be shown
            selectedChannel: false, //which type of channel are you adding
            busy: false, // use to indicate some background actions
            newChannels: [], //list of channels to add
        };

        RNTwitterSignIn.init(TWITTER_KEYS.TWITTER_COMSUMER_KEY, TWITTER_KEYS.TWITTER_CONSUMER_SECRET);
    }

    showFacebookPopup() {
        this.state.newChannels = [];
        FacebookManager.getPages().then((data) => {
            this.state.showPopup = 'facebook';
            data.map((e)=> this.state.newChannels.push(e));
            this.forceUpdate();
        }).catch(() => {  /*  no permission to get list of pages. Don't worry */});
        FacebookManager.getProfile().then((data) => {
            this.state.showPopup = 'facebook';
            data.access_token = FacebookManager.getAccessToken();
            this.state.newChannels.push(data);
            this.forceUpdate();
        }).catch(() => {  /*  That shoudn't happen */});
    }

    componentDidMount(){
        this.props.getChannels();
    }

    componentWillReceiveProps({channels}){
        this.setState({
            channels: channels,
            busy: false,
            showPopup: false,
            selectedChannel: false,
        });
    }

    submitFacebookPages(){
        this.state.newChannels.filter(c => c.selected === true).map((channel) => {
            this.props.addChannel(channel.id, channel.type, channel.access_token, channel.name);
        });

        this.setState({busy: true});
    }

    submitTwitterAccount(accountData: TwitterResponse) {
        this.props.addChannel(accountData.userID, CHANNEL_TYPES.TWITTER, { oauth_token: accountData.authToken, oauth_token_secret: accountData.authTokenSecret }, accountData.userName);
    }

    submitInstagramBusinessAccounts() {
        this.state.newChannels.filter(c => c.selected === true).map((channel) => {
            this.props.addChannel(channel.id, CHANNEL_TYPES.INSTAGRAM_BUSINESS, channel.access_token, channel.name);
        });
    }

    extractInstagramToken(token) {
        ChannelApi.getInstagramUserDataMobile(token)
            .then((response: InstagramUserData) => {
                if (response.status === 200) {
                    const {username, id} = response.data.data;
                    this.props.addChannel(id, CHANNEL_TYPES.INSTAGRAM, token, username);
                }
            });
    }

    renderNewChannelFacebookList(type){
        return this.state.newChannels.filter(channel => channel.type === type).map((channel, i) => {

            const alreadyAdded = this.state.channels.filter(c => c.channel_id === channel.id).length > 0;
            return <ListItem
                switchButton={alreadyAdded === false}
                rightIcon={alreadyAdded ? {name: 'check', color: Colors.LinkColor}: null}
                roundAvatar
                hideChevron={alreadyAdded === false}
                onSwitch={v => {
                    this.state.newChannels.filter(c => c.id === channel.id)[0].selected = v;
                    this.forceUpdate();
                }}
                switched={channel.selected}
                avatar={{uri: channel.thumbnail}}
                key={channel.id}
                title={channel.name}
            />}
        )
    }

    renderFacebookNewPopup() {
        let countSelected = this.state.newChannels.filter(c => c.selected === true).length;
        return (<Modal
            animationType="slide"
            transparent={false}
            visible={this.state.showPopup === 'facebook'}
            onRequestClose={()=> this.setState({showPopup: false, busy: false})}
        >
            <Icon
                containerStyle={styles.modalClose}
                name='close'
                onPress={() => this.setState({showPopup: false, busy: false})}/>
            <ScrollView>
                <View style={{marginTop: 20}}>
                    <Text style={styles.modalHeader}>Which channel to add?</Text>
                </View>
                <View>
                    <Text style={styles.modalListHeader}>Facebook Accounts</Text>
                    <List containerStyle={styles.modalListContainer}>
                        { this.renderNewChannelFacebookList(FacebookManager.Types.ACCOUNT) }
                    </List>


                    <Text style={styles.modalListHeader}>Facebook Pages</Text>
                    <List containerStyle={styles.modalListContainer}>
                        { this.renderNewChannelFacebookList(FacebookManager.Types.PAGE) }

                    </List>
                </View>

                <ButtonComponent onPress={ () => this.submitFacebookPages() } active={countSelected > 0 && this.state.busy === false}><Text>Add channels ({countSelected})</Text></ButtonComponent>
            </ScrollView>
        </Modal>)
    }

    renderAddFacebook(){
        if(this.state.selectedChannel !== 'facebook') return null;
        return <ButtonComponent style={{backgroundColor: '#3B5998'}}  onPress={() => {
            FacebookManager.loginWithPermissions().then(() => this.showFacebookPopup())
                .catch((data)=> {
                Alert.alert(
                    'Facebook login problem',
                    "You probably didn't allow to get list of your pages. Try again.",
                )})
        }}>
            <Text>Login with Facebook</Text>
        </ButtonComponent>
    }

    renderAddTwitter() {
        if(this.state.selectedChannel !== 'twitter') return null;
        return <ButtonComponent style={styles.addChannelBtn}  onPress={() => {
            RNTwitterSignIn.logIn()
                .then((loginData)=>{
                    const { authToken, authTokenSecret } = loginData;

                    if (authToken && authTokenSecret) {
                        this.submitTwitterAccount(loginData)
                    }

                }).catch((error)=>{
                console.log(error);
            });
        }}>
            <Text>Login with Twitter</Text>
        </ButtonComponent>
    }

    renderNewChannelInstagramBusinessList(){
        return this.state.newChannels.map((channel, i) => {

            const alreadyAdded = this.state.channels.filter(c => c.type === CHANNEL_TYPES.INSTAGRAM_BUSINESS && c.name === channel.name).length > 0;
            return <ListItem
                switchButton={alreadyAdded === false}
                rightIcon={alreadyAdded ? {name: 'check', color: Colors.LinkColor}: null}
                roundAvatar
                hideChevron={alreadyAdded === false}
                onSwitch={v => {
                    this.state.newChannels.filter(c => c.id === channel.id)[0].selected = v;
                    this.forceUpdate();
                }}
                switched={channel.selected}
                avatar={{uri: channel.thumbnail}}
                key={channel.id}
                title={channel.name}
            />}
        )
    }

    renderInstagramBusinessPopup() {
        let countSelected = this.state.newChannels.filter(c => c.selected === true).length;
        return (<Modal
            animationType="slide"
            transparent={false}
            visible={this.state.showPopup === 'instagram-business'}
            onRequestClose={()=> this.setState({showPopup: false, busy: false})}
        >
            <Icon
                containerStyle={styles.modalClose}
                name='close'
                onPress={() => this.setState({showPopup: false, busy: false})}/>
            <ScrollView>
                <View style={{marginTop: 20}}>
                    <Text style={styles.modalHeader}>Which account to add?</Text>
                </View>
                {this.state.newChannels.length ?
                    <View>
                        <List containerStyle={styles.modalListContainer}>
                            {this.renderNewChannelInstagramBusinessList()}
                        </List>
                        <ButtonComponent onPress={ () => this.submitInstagramBusinessAccounts() } active={countSelected > 0 && this.state.busy === false}><Text>Add channels ({countSelected})</Text></ButtonComponent>
                    </View>
                    :
                    <View style={{paddingHorizontal: 20}}>
                        <Text style={styles.textHeading}>You don't have any instagram business accounts associated with this facebook account</Text>
                        <TouchableWithoutFeedback onPress={() => {
                            Linking.openURL("https://www.facebook.com/business/help/502981923235522")
                        }}>
                            <View>
                                <Text style={styles.textDescription}>Click here to learn how to Set Up an Instagram Business Account</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                }
            </ScrollView>
        </Modal>)
    }

    showInstagramBusinessPopup() {
        this.state.newChannels = [];
        FacebookManager.getPages().then((data) => {
            data.map(item => {
                FacebookManager.getInstagramBusinessAccount(item).then(data => {
                    if (data) {
                        this.state.newChannels.push(data);
                    }
                    this.state.showPopup = 'instagram-business';
                    this.forceUpdate();
                })
            })
        }).catch(() => {  /*  no permission to get list of pages. Don't worry */});
    }

    renderAddInstagram() {
        if(this.state.selectedChannel !== 'instagram') return null;
        return <View style={[styles.fullHeight, styles.addInstagramWrapper]}>
            <View style={styles.addInstagramContent}>
                {/* <Text style={styles.textHeading}>Add Instagram Profile</Text>
                <Text style={styles.textDescription}>To connect Instagram account, you must first give authorization from the Instagram website</Text>
                <ButtonComponent style={[styles.addChannelBtn, styles.addInstagramBtn]}  onPress={() => this.refs.instagramModal.show()}>
                    <Text>Login with Instagram</Text>
                </ButtonComponent>*/}
                <Text style={styles.textHeading}>Add Instagram Business Profile</Text>
                <Text style={styles.textDescription}>To connect Instagram Business Profile, you must first give authorization through the Facebook website</Text>
                <ButtonComponent style={[styles.addChannelBtn, styles.addInstagramBtn]}  onPress={() => {
                    FacebookManager.loginWithInstagramPermissions().then(() => this.showInstagramBusinessPopup())
                        .catch((data)=> {
                            console.log('catch data', data)
                            Alert.alert(
                                'Facebook login problem',
                                "You probably didn't allow to get list of your pages. Try again.",
                            )})
                }}>
                    <Text>Login with Facebook</Text>
                </ButtonComponent>
            </View>
        </View>
    }

    renderInstagramModal() {
        return <InstagramModalComponent
            ref="instagramModal"
            clientId="522e0d2f99ca497b9b77a2ea8d696f10"
            redirectUrl='http://duo.levuro.com/settings-channels'
            successCallback={this.extractInstagramToken.bind(this)}
        />;
    }

    renderYouTubeAddElement() {

        return <ListItem
            leftIcon={<ChannelIcon channel="youtube" style={styles.socialIcon}/>}
            roundAvatar
            hideChevron={this.state.selectedChannel === 'youtube'}
            key="4"
            title="YouTube"
            onPress={() => {
                this.state.selectedChannel = this.state.selectedChannel ? false : 'youtube';

                this.forceUpdate();
            }}
        />

    }

    renderYouTubeAddElementButton(){

        return    <ListItem
        key="4_add"
        component={this.renderAddYouTube.bind(this)}
        />
    }

    renderAddYouTube(){
        const that = this;
        if(this.state.selectedChannel !== 'youtube') return null;



        GoogleSignin.configure({
            iosClientId: '135213473005-e20uf0emtbtr7dicfo3l7olgqab2vvs3.apps.googleusercontent.com',
            webClientId: '135213473005-5eb2o1rjevno8s0acofp96nsv1k829ol.apps.googleusercontent.com',
            offlineAccess: true,
            forceConsentPrompt: true,
            scopes: [
                'https://www.googleapis.com/auth/youtube.force-ssl',
                'https://www.googleapis.com/auth/youtube.upload',
                'https://www.googleapis.com/auth/youtubepartner',
                'https://www.googleapis.com/auth/yt-analytics.readonly',
                'https://www.googleapis.com/auth/yt-analytics-monetary.readonly'
            ]
        })
            .then(() => {
            });



        return <GoogleSigninButton
            style={{flex: 1, height: 48, margin: 15,}}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={() => {
                GoogleSignin.signIn()
                    .then((user) => {
                        if(user.serverAuthCode && that.state.channels.filter(c => c.channel_id === user.id).length === 0){
                            that.props.addChannel(user.id, 'youtube', user.serverAuthCode, user.name, true);
                        }
                        GoogleSignin.signOut();
                    })
                    .catch((err) => {
                        console.log('WRONG SIGNIN', err);
                    })
                    .done();
            }
            }/>

    }

    render() {
        return <ScrollView>
            {this.renderFacebookNewPopup()}
            {this.renderInstagramModal()}
            {this.renderInstagramBusinessPopup()}
                <View style={[styles.sectionSpacer, {marginTop: 50}]}>
                { this.state.channels.length === 0 ? null : <Text style={styles.sectionHeader}>Connected channels</Text> }
                <List containerStyle={styles.modalListContainer}>
                    {
                        this.state.channels.map((channel, i) => {
                            return <ListItem
                                roundAvatar
                                hideChevron
                                avatar={channel.thumbnail ? {uri: channel.thumbnail} : {}}
                                avatarContainerStyle={{marginRight: 10}}
                                key={channel.id}
                                title={channel.name}
                                leftIcon={<ChannelIcon channel={channel.type} style={styles.socialIcon}/>}
                            />;
                        })
                    }

                </List>
            </View>

            <View style={[styles.sectionSpacer]}>
                <Text style={styles.sectionHeader}>Add new</Text>

                <List containerStyle={styles.modalListContainer}>
                    <ListItem
                        leftIcon={<ChannelIcon channel="facebook" style={styles.socialIcon} />}
                        roundAvatar
                        hideChevron={this.state.selectedChannel === 'facebook'}
                        key="1"
                        title="Facebook"
                        onPress={()=> {
                            this.state.selectedChannel = this.state.selectedChannel ? false : 'facebook';

                            this.forceUpdate();
                        }}
                    />
                    <ListItem
                        key="1_add"
                        component={this.renderAddFacebook.bind(this)}
                    />

                    <ListItem
                        leftIcon={<ChannelIcon channel="twitter" style={styles.socialIcon} />}
                        roundAvatar
                        hideChevron={this.state.selectedChannel === 'twitter'}
                        key="2"
                        title="Twitter"
                        onPress={()=> {
                            this.state.selectedChannel = this.state.selectedChannel ? false : 'twitter';

                            this.forceUpdate();
                        }}
                    />

                    <ListItem
                        key="2_add"
                        component={this.renderAddTwitter.bind(this)}
                    />

                    <ListItem
                        leftIcon={<ChannelIcon channel="instagram" style={styles.socialIcon} />}
                        roundAvatar
                        hideChevron={this.state.selectedChannel === 'instagram'}
                        key="3"
                        title="Instagram"
                        onPress={()=> {
                            this.state.selectedChannel = this.state.selectedChannel ? false : 'instagram';

                            this.forceUpdate();
                        }}
                    />

                    <ListItem
                        key="3_add"
                        component={this.renderAddInstagram.bind(this)}
                    />

                    {this.renderYouTubeAddElement()}
                    {this.renderYouTubeAddElementButton()}

                </List>

            </View>
        </ScrollView>;
    }
}

SettingsChannelsScreen.propTypes = {};


const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    channels: state.channel.list,
});

const mapDispatchToProps = dispatch => ({
    getChannels: (  ) => dispatch(ChannelActions.getChannels()),
    addChannel: (id, type, access_token, name) => dispatch(ChannelActions.addChannelRequest(id,type, access_token, name, true))
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsChannelsScreen);