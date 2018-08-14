import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { pathOr, remove } from 'ramda';
import InfiniteScroll from 'react-infinite-scroller';

import BackButtonComponent from '../../Component/BackButton/BackButtonComponent.web';
import CampaignPostComponent from '../../Component/CampaignPost/CampaignPostComponent.web';
import SearchComponent from '../../Component/SearchBar/SearchBarComponent.web';

import moment from 'moment'
import { Creators as CampaignAction } from '../../Reducer/CampaignReducer';
import ChannelAction from '../../Reducer/ChannelReducer';
import {Creators as PublishingContentActions} from '../../Reducer/PublishingContent';

import { Grid, Header, Loader, Icon, Card, Dropdown, Button, Dimmer} from 'semantic-ui-react'
import './Style/StorylineScreen.scss'
import CampaignSelectorModalComponent from "../../Component/CampaignSelectorModal/CampaignSelectorModalComponent.web";
import {CHANNEL_TYPES} from "../../Helpers";
import LoadingContent from "../../Component/LoadingContent/LoadingContent.web";

class StorylineScreen extends React.Component {

    static propTypes = {
        location: PropTypes.shape({
            state: PropTypes.shape({
                campaign: PropTypes.object,
                channel: PropTypes.object
            })
        })
    };

    constructor(props) {
        super(props);
        this.state = {
            campaign: props.location.state.campaign,
            channel: props.location.state.channel,
            postsList: [],
            refreshing: false,
            selectedPost: null,
            channelHasMore: false,
            campaignHasMore: false,
            storylineLoading: true,
            storylineEmpty: false
        }
    }

    componentDidMount() {
        if (this.state.campaign) {
            this.props.loadCampaignPosts(this.state.campaign.id);
        }

        if (this.state.channel) {
            this.props.loadChannelPosts(this.state.channel.id);
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            postsList: pathOr(this.state.postsList, ['postsList'], props),
            refreshing: props.refreshing,
            channelHasMore: props.channelHasMore,
            campaignHasMore: props.campaignHasMore,
            storylineLoading: props.storylineLoading,
            storylineEmpty: props.storylineEmpty
        })
    }

    loadMore(){
        if(this.state.refreshing || (!this.state.channelHasMore && !this.state.campaignHasMore)) return;

        if (this.state.channel) {
            this.props.getChannelContentPage(this.state.channel.id);
        }

        if (this.state.campaign) {
            this.props.getCampaignPostsPage(this.state.campaign.id);
        }
    }

    render() {
        const name = this.getHeading();
        const hasMore = this.state.channel ? this.state.channelHasMore : this.state.campaignHasMore

        return <Grid stackable className="screen-storyline">
            <Grid.Row >
                <Grid.Column >
                    <BackButtonComponent onClickCallback={this.goBack.bind(this)}/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row >
                <Grid.Column width={6}>
                    <Header as='h3'>{name}</Header>
                </Grid.Column>
                <Grid.Column  width={10} style={{textAlign: 'right'}}>
                    {this._renderCampaignsModal()}
                    {this._renderSearch()}
                    {this._renderAddPostList()}
                    {this._renderAnalyticsButton()}
                </Grid.Column>
            </Grid.Row>
            {this._renderHeading()}
            {!this.state.storylineLoading && <Grid.Row>
                <Grid.Column>
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={this.loadMore.bind(this)}
                        hasMore={hasMore}
                        initialLoad={false}
                        loader={<Loader key='scrollLoader'>Loading</Loader>}
                    >
                            {this._renderPostsList()}
                    </InfiniteScroll>
                </Grid.Column>
            </Grid.Row>}
            {this.state.storylineLoading && <Grid.Row>
                <LoadingContent className='content-loader'/>
            </Grid.Row>}
            {(this.state.storylineEmpty && !this.state.storylineLoading) && <Grid.Row>
                <Grid.Column style={{ textAlign: 'center' }}>
                    <p>Nothing to show yet</p>
                </Grid.Column>
            </Grid.Row>}
            { (this.state.refreshing && !this.state.storylineLoading) && <Grid.Row>
                <Dimmer active inverted><Loader inverted>Refreshing</Loader></Dimmer>
            </Grid.Row> }
        </Grid>;
    }

    _renderSearch() {
        return <div className="pull-left">
            <SearchComponent onSearchSubmit={this.runSearch.bind(this)}/>
        </div>
    }

    _renderAnalyticsButton() {
        if (this.state.channel && this.state.channel.type === CHANNEL_TYPES.OTT) {
            return;
        }

        return <button className="btn" onClick={() => this.goToAnalytics()}>Analytics</button>;
    }

    _renderAddPostList() {
        if (this.state.channel && this.state.channel.type === CHANNEL_TYPES.OTT) {
            return;
        }

        if (this.state.channel) {
            return <button className="btn" onClick={()=> this.onClickAddPost(this.state.channel.type)}>
                        <Icon name='plus' /> Add New
                    </button>;
        }

        return <Dropdown text='Add post' icon='plus' floating labeled button className='icon btn'>
            <Dropdown.Menu>
                <Dropdown.Item onClick={()=> this.onClickAddPost('facebook-page')}><Button color='facebook'>
                    <Icon name='facebook' /> Facebook
                </Button>
                </Dropdown.Item>
                <Dropdown.Item onClick={()=> this.onClickAddPost('twitter')}> <Button color='twitter'>
                    <Icon name='twitter' /> Twitter
                </Button></Dropdown.Item>
                <Dropdown.Item onClick={()=> this.onClickAddPost('instagram')}><Button color='instagram'>
                    <Icon name='instagram' /> Instagram
                </Button></Dropdown.Item>
                <Dropdown.Item onClick={()=> this.onClickAddPost('youtube')}><Button color='youtube'>
                    <Icon name='youtube' /> YouTube
                </Button></Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>

    }

    _renderHeading() {
        if (!this.state.campaign) {
            return null;
        }

        const from = moment(this.state.campaign.start_date).format('ll');

        const to = this.state.campaign.end_date ? moment(this.state.campaign.end_date).format('ll') : '...'


        return <Grid.Row>
            <Grid.Column>
                <p>{from} - {to}, {this.state.postsList.length} posts</p>
            </Grid.Column>
        </Grid.Row>;
    }

    _renderPostsList() {
        return <Card.Group className="list-wrapper">
            {this.state.postsList.map((post, index) => {
                return <CampaignPostComponent post={post}
                                              key={index}
                                              deleteCallback={this.onClickDelete.bind(this)}
                                              editCallback={this.onClickEdit.bind(this)}
                                              showCampaign={!!this.state.channel}
                                              onChangeCampaignActionClick={this.onChangeCampaignActionClick.bind(this)}
                                              selected={this.state.selectedPost}
                />
            })}
        </Card.Group>
    }

    _renderCampaignsModal() {
        const allowEmpty = this.state.selectedPost ? !!this.state.selectedPost.channel.id : true
        const selected = this.state.selectedPost ? this.state.selectedPost.campaign : null

        return <CampaignSelectorModalComponent
            onClick={this.onCampaignSelectClick.bind(this)}
            selected={selected}
            allowEmpty={allowEmpty}
            ref="campaignSelectorModal"/>
    }

    onChangeCampaignActionClick(post) {
        this.refs.campaignSelectorModal.getWrappedInstance().show()
        this.setState({
            selectedPost: {
                ...post,
                busy: false
            }
        })
    }

    onCampaignSelectClick(campaign) {
        const currentCampaign = this.state.selectedPost.campaign ? this.state.selectedPost.campaign.id : 0
        if (campaign === currentCampaign || campaign.id === currentCampaign) {
            this.refs.campaignSelectorModal.getWrappedInstance().close();
            return;
        }

        const screen = this.state.channel ? 'channel' : 'campaign';
        this.setState({
            selectedPost: {
                ...this.state.selectedPost,
                busy: true
            }
        })

        this.props.updatePostCampaign(this.state.selectedPost.id, campaign.id, screen);
        this.refs.campaignSelectorModal.getWrappedInstance().close();
    }

    getHeading() {
        return this.state.campaign ? this.state.campaign.name : this.state.channel.name;
    }

    //we add that new posts added to campaign have default campaign start_date as a publishing date of the post
    onClickAddPost(composer) {
        if (this.state.channel) {
            return this.props.history.push('/compose-post2', {
                channel: this.state.channel
            });
        }

        return this.props.history.push('/compose-post2', {
            channel: { type: composer, name: '' },
            campaign: this.state.campaign,
            post: {
                published_date: moment(this.state.campaign.start_date).format('YYYY-MM-DD')
            }
        });
    }

    onClickDelete(post) {
        let index = this.state.postsList.indexOf(post);
        this.setState({
            postsList: remove(index, 1, this.state.postsList)
        });
        this.props.deleteCampaignPost(post);
    }

    onClickEdit(post) {
        return this.props.history.push('/compose-post2', {
            channel: post.channel,
            campaign: this.state.campaign,
            post
        })
    }

    onCampaignChange(post, campaign) {
        const newPost = {
            ...post,
            campaign: campaign
        }

        if (this.state.channel) {
            this.setState({
                postsList: this.state.postsList.map(item => item.id === post.id ? newPost : item)
            });
        } else {
            const index = this.state.postsList.indexOf(post);
            this.setState({
                postsList:  remove(index, 1, this.state.postsList)
            });
        }

        this.props.updatePostCampaign(post.id, campaign.id);

    }

    goToAnalytics() {
        const route = this.state.channel ? '/channel-analytics' : '/campaign-analytics'
        const props = this.state.channel ? {channel: this.state.channel} : {campaign: this.state.campaign}

        return this.props.history.push(route, {
            ...props,
            postsList: this.state.postsList
        })
    }

    goBack() {
        if (this.state.channel) {
            return this.props.history.push('/compose');
        }

        if (this.state.campaign) {
            return this.props.history.push('/');
        }
    }

    goToCampaign(campaign) {
        this.setState({
            channel: false,
            campaign
        }, () => {
            this.componentDidMount()
        });
    }

    runSearch(searchTerm) {
        if (this.state.channel) {
            this.props.searchChannelContent(this.state.channel.id, searchTerm)
        }

        if (this.state.campaign) {
            this.props.searchCampaignPosts(this.state.campaign.id, searchTerm)
        }
    }
}

const mapStateToProps = state => ({
    postsList: state.posts.postsList,
    refreshing: state.channel.loading || state.campaign.loading,
    channelHasMore: state.channel.hasMoreContent,
    campaignHasMore: state.campaign.hasMorePosts,
    storylineLoading: state.channel.contentLoading || state.campaign.postLoading,
    storylineEmpty: state.posts.postsList.length ? false : true
});

const mapDispatchToProps = dispatch => ({
    loadCampaignPosts: (campaignId) => dispatch(CampaignAction.getCampaignPost(campaignId)),
    loadChannelPosts: (channelId) => dispatch(ChannelAction.getChannelContent(channelId)),
    getChannelContentPage: (channelId, page) => dispatch(ChannelAction.getChannelContentPage(channelId, page)),
    updatePostCampaign: (id, campaignId, screen) => dispatch(PublishingContentActions.updatePostCampaign(id, campaignId, screen)),
    deleteCampaignPost: (post) => dispatch(PublishingContentActions.deleteCampaignPost(post)),
    searchChannelContent: (channelId, term) => dispatch(ChannelAction.getChannelContentSearchResult(channelId, term)),
    getCampaignPostsPage: (campaignId, page) => dispatch(CampaignAction.getCampaignPostsPage(campaignId, page)),
    searchCampaignPosts: (campaignId, term) => dispatch(CampaignAction.getCampaignPostsSearchResult(campaignId, term))

});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StorylineScreen));