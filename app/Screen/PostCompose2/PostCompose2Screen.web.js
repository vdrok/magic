import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { merge } from 'ramda';

import ComposeSocial from "../../Component/ComposeSocial/ComposeSocial.web";
import ComposeYouTube from '../../Component/ComposeYouTube/ComposeYouTube.web'
import BackButtonComponent from '../../Component/BackButton/BackButtonComponent.web';
import { Dimmer, Loader, Grid, Message, Form } from 'semantic-ui-react'

import Facebook from "../../Manager/BaseFacebook";

import REGISTERED_COMPOSERS from '../../Helpers/EnabledChannels';

import './Style/PostCompose2.scss'

class PostCompose2Screen extends React.Component {
    static propTypes = {
        location: PropTypes.shape({
            state: PropTypes.shape({
                channel: PropTypes.shape({
                    type: PropTypes.string.isRequired
                }),
                post: PropTypes.shape({
                    status: PropTypes.any
                }),
                campaign: PropTypes.shape({}),
            })
        })
    };

    constructor(props) {
        super(props);
        this.state = {
            busy: false
        }
    }



    componentWillReceiveProps({busy}){
        this.setState({
            busy: busy,
        });

        // redirect after success
        if(this.state.busy && !busy){
            return this.goBack();
        }
    }


    render() {
        const {type} = this.props.location.state.channel;
        return  <Dimmer.Dimmable blurring dimmed={this.state.busy}>
            <Dimmer active={this.state.busy} inverted>
                <Loader>Saving</Loader>
            </Dimmer>

            <Grid stackable className={type}>
                <Grid.Row style={{marginBottom: 20}}>
                    <Grid.Column>
                        <BackButtonComponent onClickCallback={this.goBack.bind(this)}/>
                    </Grid.Column>
                </Grid.Row>
                {this._renderComposerWrapper()}
            </Grid>
        </Dimmer.Dimmable>
    }

    _renderComposerWrapper() {
        const {type} = this.props.location.state.channel;

        if (!this.isComposerRegistered(type))
            return `Composer not made for channel type ${type}.`;

        return <Grid.Row>
                <Grid.Column>
                    {this._renderPostComposer()}
                    {this._renderErrorMessage()}
                    <button className="btn compose-save" onClick={this.submit.bind(this)} >Save as draft</button>
                </Grid.Column>
            </Grid.Row>
    }

    _renderErrorMessage() {
        if (!this.state.showError)
            return null;

        const {_message} = this.state.rules;

        return <Message negative>
            <Message.Header>Error saving post</Message.Header>
            <p>{_message}</p>
        </Message>;
    }

    _renderPostComposer() {
        const {type} = this.props.location.state.channel;

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

    _youtubeRender() {
        let props = this.getPropsForComponents();
        props.mediaFilesValidation = {
            maxVideos: 1,
            noMixedImageWithVideos: true
        };
        return <ComposeYouTube ref={(child) => { if(child) this._composer = child; }}
                              { ...props } />
    }

    _facebookRender() {
        let props = this.getPropsForComponents();
        props.channelType = 'facebook-page';
        props.mediaFilesValidation = {
            maxVideos: 1,
            noMixedImageWithVideos: true
        };
        return <ComposeSocial ref={(child) => { if(child) this._composer = child; }}
                              { ...props } />
    }

    _twitterRender() {
        let props = this.getPropsForComponents();
        props.channelType = 'twitter';
        props.mediaFilesValidation = {
            max: 10
        };
        return <ComposeSocial ref={(child) => { if(child) this._composer = child; }}
                                        { ...props }/>
    }

    _instagramRender() {

        let props = this.getPropsForComponents();
        props.channelType = 'instagram';
        props.mediaFilesValidation = {
            min: 1
        };
        return <ComposeSocial ref={(child) => { if(child) this._composer = child; }}
                                          { ...props }/>
    }

    getPropsForComponents() {

        let { post } = this.props.location.state;
        if(post && typeof post.asMutable === 'function'){
            post = post.asMutable();
        }
        const campaign = this.props.location.state.campaign ? this.props.location.state.campaign:
            post && post.campaign ? post.campaign : null;


        return {
            channel: this.props.location.state.channel,
            post: post,
            campaign: campaign,
            history: this.props.history
        }
    }

    isComposerRegistered(composer) {
        return REGISTERED_COMPOSERS.indexOf(composer) > -1;
    }

    goBack() {

        const {campaign} = this.props.location.state;

        if(campaign){
            return this.props.history.push('/campaign-posts', { campaign });
        }else{
            if(this._composer && this._composer.getWrappedInstance() && this._composer.getWrappedInstance().getChannel){
                const channel = this._composer.getWrappedInstance().getChannel();
                return this.props.history.push('/channel-posts', { channel });
            }f
        }

        return this.props.history.push('/');
    }

    showError(showError) {
        this.setState({
            showError
        })
    }


    submit(){
        if(this._composer && this._composer.getWrappedInstance() && this._composer.getWrappedInstance().save){
            this._composer.getWrappedInstance().save();
        }
    }
}

const mapStateToProps = state => ({
    busy: state.publishing.busy
});


export default withRouter(connect(mapStateToProps, null)(PostCompose2Screen));
