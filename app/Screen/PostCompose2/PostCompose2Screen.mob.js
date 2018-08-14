import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withNavigation} from 'react-navigation';

import { Image, Button, Text, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { logo } from '../../Helpers';
import colors from '../../Styles/Colors';

import Facebook from '../../Manager/BaseFacebook'
import ComposeYouTube from "../../Component/ComposeYouTube/ComposeYouTube.mob";

import styles from './Style/PostCompose2Style';
import REGISTERED_COMPOSERS from '../../Helpers/EnabledChannels';
import ComposeSocial from "../../Component/ComposeSocial/ComposeSocial.mob";


class PostCompose2Screen extends React.Component {

    static propTypes = {
        navigation: PropTypes.shape({
            state: PropTypes.shape({
                params: PropTypes.shape({
                    channel: PropTypes.shape({
                        type: PropTypes.string.isRequired
                    }),
                    post: PropTypes.shape({
                        status: PropTypes.any
                    }),
                    campaign: PropTypes.shape({}),
                })
            })
        })
    };

    static navigationOptions = ({navigation}) => {

        const headerLeft = (
            <Button
                title="Back"
                color={colors.LinkColor}
                onPress={() => navigation.state.params.backHandler()}
            />
        );

        const headerRight = (
            <Button
                title="Save draft"
                color={colors.LinkColor}
                onPress={() => navigation.state.params.submitHandler()}
            />
        );

        return {
            headerLeft,
            headerRight,
            title: <Image source={ logo } style={styles.header_logo} />,
            tabBarLabel: 'Compose',
            tabBarIcon: ({ tintColor }) => (
                <Icon name="launch" size={30} color={tintColor } />
            ),
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            busy: false
        }

        this.goToPostsList = this.goToPostsList.bind(this);
    }

    componentWillReceiveProps({busy}) {
        //if change from busy to not-busy redirect as fished
        if(this.state.busy && !busy){

// WAS LIKE THAT   this.state.isEdit && this.props.state.params.backHandler ? this.props.navigation.state.params.backHandler() : this.resetToComposeScreen();
            return this.goToPostsList();
        }

        this.setState({
            busy,
        });
    }

    componentDidMount() {

        this.props.navigation.setParams({
            submitHandler: this.submit.bind(this),
            backHandler: this.goBack.bind(this)
        });
    }


    render() {
        return <KeyboardAvoidingView behavior="padding" style={[styles.fullHeight, styles.container]} >
            {this._renderPostComposer()}
        </KeyboardAvoidingView>
    }

    _renderPostComposer() {
        const {type} = this.props.navigation.state.params.channel;

        if (!this.isComposerRegistered(type))
            return <Text>Composer not registered for type {type}.</Text>;

        switch (type){
            case Facebook.Types.PAGE:
            case Facebook.Types.ACCOUNT:
                return this._facebookRender();
            case 'twitter':
                return this._twitterRender();
            case 'instagram':
            case 'instagram-business':
                return this._instagramRender();
            case 'youtube':
                return this._youtubeRender();
            default:
                return null;
        }
    }

    _facebookRender() {

        let props = this.getPropsForComponents();
        props.channelType = 'facebook-page';
        props.mediaFilesValidation = {
            maxVideos: 1,
            noMixedImageWithVideos: true
        };

        return <ComposeSocial ref={(child) => { if(child) this._composer = child; }}
            { ...props }
        />
    }

    _twitterRender() {

        let props = this.getPropsForComponents();
        props.channelType = 'twitter';
        props.mediaFilesValidation = {
            max: 10
        };

        return <ComposeSocial ref={(child) => { if(child) this._composer = child; }}
            { ...props }
        />
    }

    _instagramRender() {
        let props = this.getPropsForComponents();
        props.channelType = 'instagram';
        props.mediaFilesValidation = {
            min: 1
        };

        return <ComposeSocial ref={(child) => { if(child) this._composer = child; }}
            { ...props }
        />
    }
    _youtubeRender(){
        let props = this.getPropsForComponents();
        props.mediaFilesValidation = {
            maxVideos: 1,
            noMixedImageWithVideos: true
        };
        return <ComposeYouTube ref={(child) => { if(child) this._composer = child; }}
                 { ...props }
        />
    }

    getPropsForComponents() {
        const campaign = this.props.navigation.state.params.campaign ? this.props.navigation.state.params.campaign:
            this.props.navigation.state.params.post && this.props.navigation.state.params.post.campaign ? this.props.navigation.state.params.post.campaign : null;
        return {
            channel: this.props.navigation.state.params.channel,
            post: this.props.navigation.state.params.post,
            campaign: campaign,
        }
    }


    goToPostsList(){

        if(this.props.navigation.state.params.campaign){
            return this.props.navigation.navigate("StorylineScreen",  { campaign: this.props.navigation.state.params.campaign });
        }

        if(this._composer && this._composer.getWrappedInstance() && this._composer.getWrappedInstance().redirectToChannel){
           if(this._composer.getWrappedInstance().redirectToChannel()){
                return;
            }
        }

        return this.props.navigation.navigate("HomeScreen");
    }

    submit() {
        if(this._composer && this._composer.getWrappedInstance() && this._composer.getWrappedInstance().save){
            this._composer.getWrappedInstance().save();
        }
    }

    goBack(){
        if(this.props.navigation.state.params.campaign){
            return this.props.navigation.navigate("StorylineScreen",  { campaign: this.props.navigation.state.params.campaign });
        }

        if(this.props.navigation.state.params.channel.id > 0){
            return this.props.navigation.navigate("ChannelStorylineScreen",  { channel: this.props.navigation.state.params.channel });
        }

        this.props.navigation.goBack();
    }

    isComposerRegistered(composer) {
        return REGISTERED_COMPOSERS.indexOf(composer) > -1;
    }
}

const mapStateToProps = state => ({
    busy: state.publishing.busy
});


export default withNavigation(connect(mapStateToProps, null)(PostCompose2Screen));