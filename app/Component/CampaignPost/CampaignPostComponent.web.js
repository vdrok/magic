import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { pathOr, remove } from 'ramda';;
import {logo_socials, truncateText} from '../../Helpers';
import './Style/CampaignPostComponent.scss';
import moment from 'moment'
import { POST_STATUSES, CHANNEL_TYPES } from '../../Helpers'
import { Card, Button, Image, List, Label, Icon, Dimmer, Loader, Modal, Transition, Header, Dropdown, Flag } from 'semantic-ui-react'
import {Creators as PublishingActions} from "../../Reducer/PublishingContent";
import PostMediaComponent from '../PostMedia/PostMediaComponent.web';
import {connect} from "react-redux";
import twttr from 'twitter-text';
import {isAllow, restrictions} from "../../Helpers/Permissions";

class CampaignPostComponent extends React.Component {

    static propTypes = {
        post: PropTypes.shape({}).isRequired,
        deleteCallback: PropTypes.func.isRequired,
        editCallback: PropTypes.func.isRequired,
        showCampaign: PropTypes.bool.isRequired,
        onChangeCampaignActionClick: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            expanded: false,
            busy: false,
            errorMessage: false,
            showTranslation: false,
            showOptions: false,
            ottLanguage: 'de',
            showCampaign: props.showCampaign,
            post: props.post,
            campaigns: []
        };
    }

    componentDidMount() {
        if (this.state.post.channel.type === CHANNEL_TYPES.OTT) {
            this.setOttData();
        }
    }

    componentWillReceiveProps(props) {

        if (props.selected && props.selected.id === props.post.id) {
            this.setState({
                busy: props.selected.busy
            })
        }
        //we only cancel busy state
        if(props.busy === false){
            this.setState({
                busy: props.busy,
                post: props.post
            });
        }

        this.setState({
            post: props.post
        }, () => {
           if (this.state.post.channel.type === CHANNEL_TYPES.OTT) {
               this.setOttData();
           }
        });
    }

    setOttData() {
        if (!this.state.post.ott) {
            return null;
        }

        const ottContent = this.state.post.ott.find(item => item.language === this.state.ottLanguage)

        this.setState({
            post: {
                ...this.state.post,
                media: ottContent.media,
                message: ottContent.message,
                title: ottContent.title
            }
        })
    }

    render() {
        const { published_date, channel, media } = this.state.post;

        const videoIcon = media && media.type === 'video' ?
            <Icon name="play" inverted={true} size='big' /> : null;

        return <Card fluid className="campaign-post" as="div">
            <Dimmer active={this.state.busy} inverted>
                <Loader inverted></Loader>
            </Dimmer>

            <Card.Header className="post-header" onClick={this.onClickExpand.bind(this)}>
                <div className="status">{this._renderStatusIcon()}</div>
                <List>
                    <List.Item>
                        <div className="channel-icon-wrapper ui left floated image">
                            <Image src={logo_socials[channel.type]} alt={channel.type}/>
                        </div>
                        <List.Content>
                            <List.Header>{channel.name}</List.Header>
                            <List.Description>
                                {moment(published_date).format('LLLL')}
                            </List.Description>
                        </List.Content>
                    </List.Item>
                </List>
            </Card.Header>
            <Card.Content className="post-content" onClick={this.onClickExpand.bind(this)}>
                {this._renderTitleBar()}
                    {videoIcon}
                <PostMediaComponent media={media} />
                    {/*<Image src={media && media.thumbnail} floated='left' className="image" />*/}
                {this._renderMessage()}
            </Card.Content>
            {this._renderExtra()}
            {this._renderChannelData()}
            {this._renderErrorPopup()}

        </Card>;
    }

    _renderMessage(){

        const { message, channel, translation } = this.state.post;

        let messageToDisplay = this.state.showTranslation ? translation : message;


        if(channel.type === CHANNEL_TYPES.TWITTER && messageToDisplay){
            return <div className="textual-content" dangerouslySetInnerHTML={{ __html: twttr.autoLink(messageToDisplay, {targetBlank: true}) }} />;
        }

        if(channel.type === CHANNEL_TYPES.OTT && messageToDisplay){
            messageToDisplay = this.state.expanded ? messageToDisplay : truncateText(messageToDisplay, 500, '...');

            return <div className="textual-content" dangerouslySetInnerHTML={{ __html: messageToDisplay }} />;
        }

        return <div className="textual-content">
            {messageToDisplay}
        </div>;
    }

    _renderTranslation() {
        if (!this.state.post.translation) {
            return null;
        }

        return <Button basic size={'tiny'} color='black' onClick={this.switchContentText.bind(this)}>Show {this.state.showTranslation ? 'post' : 'translation'}</Button>
    }

    switchContentText() {
        this.setState({
            showTranslation: !this.state.showTranslation
        });
    }

    _renderErrorPopup(){
        return <Modal size='tiny' open={this.state.errorMessage !== false} onClose={() => this.setState({errorMessage: false})}>
            <Modal.Content>
                <p dangerouslySetInnerHTML={{ __html: this.state.errorMessage}} />
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => this.setState({errorMessage: false})}>
                    Close
                </Button>
            </Modal.Actions>
        </Modal>

    }

    _renderTitleBar() {
        const { title } = this.state.post;
        if(!title){
            return null;
        }
        const options = [
            {
                text: <span><Flag name='de'/></span>,
                value: "de"
            },
            {
                text: <span><Flag name='us'/></span>,
                value: "en"
            }
        ];

        return <div className="title-bar-wrapper">
            <Header className="title" size='medium'>{title}</Header>
            {/*<Dropdown className="language" inline options={options} defaultValue={options[0].value} onChange={this.onLanguageChange.bind(this)}/>*/}
        </div>
    }

    getThumbnail() {
        const {media} = this.state.post;

        return media && media.length && media.length !== 0 ? media[0] : null;
    }

    onLanguageChange(event, language) {
        this.setState({
            ottLanguage: language.value
        }, () => {
            this.setOttData();
        })
    }

    _renderStatusIcon() {
        const { status } = this.state.post;

        switch (status) {
            case POST_STATUSES.APPROVED:
                return <span className="approved">approved</span>;
            case POST_STATUSES.LIVE:
                return <span className="published">live <i className="material-icons">done</i></span>;
            case POST_STATUSES.PUBLISHED:
                return <span className="published">scheduled <i className="material-icons">done</i></span>;
            case POST_STATUSES.DRAFT:
                return <span>draft <i className="material-icons">mode_edit</i></span>;
            case POST_STATUSES.ERROR:
                return <span className="red">error</span>;
            default:
                return <span></span>
        }
    }

    _renderExtra() {
        if (!this.state.expanded)
            return null;

        return <Card.Content extra>
            {/*<table className="estimated-data">*/}
                {/*<tr>*/}
                    {/*<td>Estimated Reach:</td>*/}
                    {/*<td>{this.state.post.estReach}</td>*/}
                {/*</tr>*/}
                {/*<tr>*/}
                    {/*<td>Estimated Engagement:</td>*/}
                    {/*<td>{this.state.post.estEngagement}</td>*/}
                {/*</tr>*/}
                {/*<tr>*/}
                    {/*<td>Estimated Conversion:</td>*/}
                    {/*<td>{this.state.post.estConversion}</td>*/}
                {/*</tr>*/}
            {/*</table>*/}

            <div className="buttons">
                {this._renderTranslation()}

                <Button basic color='black' floated={'right'} onClick={() => this.setState({showOptions: !this.state.showOptions})} size={'tiny'}>{this.state.showOptions ? 'Hide' : 'Show'} actions</Button>
                <Transition.Group animation={'fade left'} duration={500} className="options-buttons">
                    {this.state.showOptions && this._renderOptions()}
                </Transition.Group>
            </div>
        </Card.Content>;
    }

    _renderOptions() {
        return (
            <div>
                { this._renderEditButton() }
                { this._renderDeleteButton() }
                { this._renderApprovalButton() }
                { this._renderAddToCampaignButton() }
            </div>
        );
    }

    _renderEditButton() {
        if(this.state.post.status === POST_STATUSES.LIVE || this.state.post.status === POST_STATUSES.PUBLISHED) return;

        return <Button primary size={'tiny'} onClick={() => this.props.editCallback(this.state.post)}>
            Edit
        </Button>

    }

    _renderDeleteButton() {
        if(this.state.post.status === POST_STATUSES.LIVE || this.state.post.status === POST_STATUSES.PUBLISHED) return;

        return <Button negative size={'tiny'} onClick={() => this.props.deleteCallback(this.state.post)}>
            Delete
        </Button>
    }

    _renderApprovalButton(){

        if(this.state.post.status === POST_STATUSES.LIVE || this.state.post.status === POST_STATUSES.PUBLISHED) return;


        if(this.state.post.status === POST_STATUSES.DRAFT){

            return <Button icon size={'tiny'} className="right floated" positive onClick={() => this.updateStatus(POST_STATUSES.APPROVED)}>
                Approve
            </Button>;
        }

        return <Button icon size={'tiny'} className="right floated"  positive onClick={() => this.updateStatus(POST_STATUSES.PUBLISHED)}>
            Publish
        </Button>;

    }

    _renderAddToCampaignButton() {
        return <Button icon size={'tiny'} className="right floated" positive onClick={() => {this.props.onChangeCampaignActionClick(this.state.post)}}>
            {this.state.post.campaign ? "Change campaign" : "Assign to campaign"}
        </Button>
    }

    _renderChannelData() {
        if (!this.state.showCampaign || !this.state.post.campaign) {
            return null;
        }

        return <div className="label">
            <Label as='a' size={'large'} onClick={this.goToCampaign.bind(this)}>
                {this.state.post.campaign.name}
            </Label>
        </div>;
    }

    goToCampaign() {
      return this.props.history.push('/campaign-posts', {
        campaign: this.state.post.campaign
      })
    }

    onClickExpand() {
        this.setState({
            expanded: !this.state.expanded
        });
    }

    /**
     *
     * @param status
     */
    updateStatus(status){
        if (status === POST_STATUSES.APPROVED && !isAllow(this.props.currentClient, 'postApproval')) {
            this.setState({
                errorMessage: restrictions['postApproval'].permissions.message + " <br> Please contact your project administrator"
            })

            return;
        }

        if(status === POST_STATUSES.PUBLISHED &&
            this.state.post.channel.type && (
                this.state.post.channel.type === CHANNEL_TYPES.INSTAGRAM_BUSINESS  ||
                this.state.post.channel.type === CHANNEL_TYPES.INSTAGRAM
            )){
            this.setState({
                'errorMessage': "Direct publishing to Instagram is not supported"
            })
            return;
        }

        //we accept only post scheduled min 30 minutes in the future
        if(status === POST_STATUSES.PUBLISHED &&
            !moment(this.state.post.published_date).isAfter(moment().add(30, 'm'))){

            this.setState({
                'errorMessage': "We can only schedule the post planned minimum 30 minutes in future <br /><br />"+
                    'This post is planned on ' + moment(this.state.post.published_date).format('LLLL')
            })
            return;
        }
        //you cannot published posts without real channel
        if(status === POST_STATUSES.PUBLISHED && !this.state.post.channel.id){
            this.setState({
                'errorMessage': "This post is not planned for connected channel <br /><br />"+
                'Edit the post and select the channel from the dropdown list'
            })
            return;
        }


        this.setState({
            busy: true
        });

        this.props.updatePostStatus(
            this.state.post.id,
            status
        );
    }
}


const mapStateToProps = state => ({
    busy: state.publishing.busy,
    campaigns: state.campaign.list,
    currentClient: state.auth.currentClient
});


const mapDispatchToProps = dispatch => ({
    updatePostStatus: (id, status) => dispatch(PublishingActions.updatePostStatus(id, status))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CampaignPostComponent));
