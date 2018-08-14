import React from 'react';
import { connect } from 'react-redux';
import { pathOr, remove } from 'ramda';
import { withNavigationFocus } from 'react-navigation';
import {
    Image,
    Text,
    ScrollView,
    View,
    Button,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ActivityIndicator,
    FlatList,
    Alert
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment/moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Icon as NativeBaseIcon } from 'native-base';
import ContentLoader from 'react-native-content-loader';
import { Circle, Rect } from 'react-native-svg';
import { CHANNEL_TYPES, logo } from '../../Helpers';

import styles from './Style/StorylineScreenStyle';

import CampaignPostComponent from '../../Component/CampaignPost/CampaignPostComponent.mob';
import ButtonComponent from '../../Component/Button/ButtonComponent.mob';
import AddPostModalComponent from '../../Component/AddPostModal/AddPostModalComponent.mob';
import SearchBarComponent from '../../Component/SearchBar/SearchBarComponent.mob';
import CampaignSelectorModalComponent from '../../Component/CampaignSelectorModal/CampaignSelectorModalComponent.mob';

import { Creators as CampaignAction } from '../../Reducer/CampaignReducer';
import {
    Creators as PublishingActions,
    Creators as PublishingContentAction
} from '../../Reducer/PublishingContent';
import ChannelAction from '../../Reducer/ChannelReducer';
import Style from '../../Component/MediaElement/Style/MediaElement';
import colors from '../../Styles/Colors';
import { isAllow, restrictions } from '../../Helpers/Permissions';
import LoadingContent from "../../Component/LoadingContent/LoadingContent.mob";

class StorylineScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        if (navigation.state.params.header) {
            return navigation.state.params.header();
        }

        return {
            headerLeft: <Button title="Back" onPress={() => {}} />,
            title: <Image source={logo} style={styles.header_logo} />,
            tabBarLabel: 'Home',
            tabBarIcon: ({ tintColor }) => <Icon name={'import-contacts'} size={30} color={tintColor} />
        };
    };

    static propTypes = {
        navigation: PropTypes.shape({
            state: PropTypes.shape({
                params: PropTypes.shape({
                    campaign: PropTypes.shape({
                        name: PropTypes.string.isRequired,
                        id: PropTypes.number.isRequired
                    }),
                    channel: PropTypes.object,
                    backHandler: PropTypes.func
                })
            })
        }),
        postsList: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            campaign: props.navigation.state.params.campaign,
            channel: props.navigation.state.params.channel,
            postsList: [],
            refreshing: false,
            selectedPost: null,
            channelHasMore: false,
            campaignHasMore: false,
            storylineLoading: true,
            storylineEmpty: false
        };
    }

    refreshData() {
        if (this.state.campaign) {
            this.props.loadCampaignPosts(this.state.campaign.id);
        }

        if (this.state.channel) {
            this.props.loadChannelPosts(this.state.channel.id);
        }
    }

    componentDidMount() {
        this.refreshData();

        this.props.navigation.setParams({
            header: this.headerComponent.bind(this)
        });

        this.props.navigation.addListener('willFocus', this.refreshData.bind(this));
    }

    headerComponent() {
        const tab = this.state.campaign
            ? { name: 'Stories', icon: 'import-contacts' }
            : { icon: 'launch', name: 'Compose' };

        return {
            headerLeft: <Button title="Back" onPress={this.goBackLocation.bind(this)} />,
            headerRight: (
                <TouchableOpacity
                    style={{ marginRight: 16 }}
                    onPress={this.goToAnalytics.bind(this)}
                >
                    <NativeBaseIcon name="chart" type="SimpleLineIcons" style={styles.headerIcon} />
                </TouchableOpacity>
            ),
            title: <Image source={logo} style={styles.header_logo} />,
            tabBarLabel: tab.name,
            tabBarIcon: ({ tintColor }) => <Icon name={tab.icon} size={30} color={tintColor} />
        };
    }

    componentWillReceiveProps(props, prevState) {
        this.setState({
            postsList: pathOr(this.state.postsList, ['postsList'], props),
            channelHasMore: props.channelHasMore,
            campaignHasMore: props.campaignHasMore,
            refreshing: props.refreshing,
            storylineLoading: props.storylineLoading,
            storylineEmpty: props.storylineEmpty
        });
    }

    loadMore() {
        if (this.state.refreshing || (!this.state.channelHasMore && !this.state.campaignHasMore))
            return;

        if (this.state.channel) {
            this.props.getChannelContentPage(this.state.channel.id);
        }

        if (this.state.campaign) {
            this.props.getCampaignPostsPage(this.state.campaign.id);
        }
    }

    render() {
        return (
            <View style={[styles.fullHeight, styles.container]}>
                {this._renderCampaignsModal()}
                <View removeClippedSubviews={true}>{this._renderPosts()}</View>
                {this._renderAddPostModal()}
                {this._renderAddPostButton()}
            </View>
        );
    }

    _renderListHeader() {
        return (
            <View>
                {this._renderHeading()}
                <SearchBarComponent onSearchSubmit={this.runSearch.bind(this)} />
            </View>
        );
    }

    _renderHeading() {
        const name = this.getName();

        let campaignDates = null;

        if (this.state.campaign) {
            const { start_date, end_date } = this.state.campaign
                ? this.state.campaign
                : { start_date: null, end_date: null };
            const endDateComponent = end_date ? (
                <Text> - {moment(end_date).format('ll')} </Text>
            ) : (
                <Text> - ...</Text>
            );
            campaignDates = (
                <View style={[styles.campaignsHeading]}>
                    <Text style={[styles.campaignsTimes]}>
                        {moment(start_date).format('ll')}
                        {endDateComponent}
                    </Text>
                </View>
            );
        }

        return (
            <View>
                <View style={[styles.flexList, styles.campaignsHeading]}>
                    <Text style={styles.campaignName}>{name}</Text>
                </View>
                {campaignDates}
            </View>
        );
    }

    _renderPosts() {
        if (this.state.storylineLoading) {
            return <LoadingContent />
        }

        return (
            <View>
                {!this.state.storylineEmpty ? (
                    <View style={[styles.fullHeight, styles.grayLine]} />
                ) : null}
                <View style={styles.list}>{this._renderListOfPosts()}</View>
                {this.state.refreshing ? (
                    <View style={[styles.list]}>
                        <ActivityIndicator
                            size="large"
                            color={colors.LinkColor}
                            style={[Style.loader]}
                        />
                    </View>
                ) : null}
                {this.state.storylineEmpty ? (
                    <View style={[styles.emptyList]}>
                        <Text>Nothing to show yet</Text>
                    </View>
                ) : null}
            </View>
        );
    }

    _renderListOfPosts() {
        if (!this.state.postsList) {
            return null;
        }

        return (
            <FlatList
                style={styles.postList}
                keyExtractor={post => post.id + ''}
                data={this.state.postsList}
                onEndReachedThreshold={0.5}
                onMomentumScrollBegin={() => {
                    this.onEndReachedCalledDuringMomentum = false;
                }}
                bounces={false}
                onEndReached={() => {
                    if (!this.onEndReachedCalledDuringMomentum) {
                        this.loadMore();
                        this.onEndReachedCalledDuringMomentum = true;
                    }
                }}
                ListHeaderComponent={() => {
                    return this._renderListHeader();
                }}
                renderItem={(post, index) => (
                    <CampaignPostComponent
                        key={post.id}
                        post={post.item}
                        isLastPost={this.isLastPost(index)}
                        deleteCallback={this.onClickDelete.bind(this)}
                        editCallback={this.onClickEdit.bind(this)}
                        showCampaign={!!this.state.channel}
                        onChangeCampaignActionClick={this.onChangeCampaignActionClick.bind(this)}
                        selected={this.state.selectedPost}
                    />
                )}
            />
        );
    }

    _renderAddPostButton() {
        if (this.state.channel && this.state.channel.type === CHANNEL_TYPES.OTT) {
            return;
        }

        const handler = this.state.campaign
            ? () => this.refs.addPostModal.show()
            : this.goToNewPost.bind(this);

        return (
            <ButtonComponent onPress={handler} style={styles.button}>
                Create Post +
            </ButtonComponent>
        );
    }

    _renderAddPostModal() {
        if (!this.state.campaign) {
            return null;
        }

        return (
            <AddPostModalComponent onClick={this.onClickAddPost.bind(this)} ref="addPostModal" />
        );
    }

    _renderCampaignsModal() {
        const allowEmpty = this.state.selectedPost ? !!this.state.selectedPost.channel.id : true;
        const selected = this.state.selectedPost ? this.state.selectedPost.campaign : null;

        return (
            <CampaignSelectorModalComponent
                onClick={this.onCampaignSelectClick.bind(this)}
                selected={selected}
                allowEmpty={allowEmpty}
                ref="campaignSelectorModal"
            />
        );
    }

    onChangeCampaignActionClick(post) {
        this.refs.campaignSelectorModal.getWrappedInstance().show();
        this.setState({
            selectedPost: {
                ...post,
                busy: false
            }
        });
    }

    onCampaignSelectClick(campaign) {
        const currentCampaign = this.state.selectedPost.campaign
            ? this.state.selectedPost.campaign.id
            : 0;
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
        });

        this.props.updatePostCampaign(this.state.selectedPost.id, campaign.id, screen);
        this.refs.campaignSelectorModal.getWrappedInstance().close();
    }

    getName() {
        return this.state.campaign ? this.state.campaign.name : this.state.channel.name;
    }

    isLastPost(index) {
        return index === this.state.postsList.length - 1;
    }

    onClickAddPost(channel) {
        this.refs.addPostModal.close();
        return this.props.navigation.navigate('PostCompose2Screen', {
            channel: { type: channel, name: null },
            campaign: this.state.campaign,
            post: {
                published_date: this.state.campaign.start_date
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
        return this.props.navigation.navigate('PostCompose2Screen', {
            campaign: this.state.campaign,
            channel: post.channel,
            isChannelList: !!this.state.channel,
            edit: true,
            post: {
                ...post,
                published_date: moment(post.published_date).format('DD MMM YYYY HH:mm')
            }
        });
    }

    goToAnalytics() {
        if (!isAllow(this.props.currentClient, 'analytics')) {
            Alert.alert(
                restrictions['analytics'].permissions.message,
                ' \n Please contact your administrator'
            );
            return;
        }

        const direction = this.state.channel ? 'ChannelAnalyticsScreen' : 'CampaignAnalyticsScreen';
        const props = this.state.channel
            ? { channel: this.state.channel }
            : { campaign: this.state.campaign };

        return this.props.navigation.navigate(direction, {
            ...props,
            backHandler: () => this.props.navigation.navigate('StorylineScreen', props)
        });
    }

    goToNewPost() {
        return this.props.navigation.navigate('PostCompose2Screen', {
            channel: this.state.channel,
            isChannelList: !!this.state.channel
        });
    }

    goBackLocation() {
        const direction = this.state.channel ? 'ComposeScreen' : 'HomeScreen';

        return this.props.navigation.navigate(direction);
    }

    runSearch(searchTerm) {
        if (this.state.channel) {
            this.props.searchChannelContent(this.state.channel.id, searchTerm);
        }

        if (this.state.campaign) {
            this.props.searchCampaignPosts(this.state.campaign.id, searchTerm);
        }
    }
}

const mapStateToProps = state => ({
    postsList: state.posts.postsList,
    refreshing: state.channel.loading || state.campaign.loading,
    channelHasMore: state.channel.hasMoreContent,
    campaignHasMore: state.campaign.hasMorePosts,
    currentClient: state.auth.currentClient,
    storylineLoading: state.channel.contentLoading || state.campaign.postLoading,
    storylineEmpty: state.posts.postsList.length ? false : true
});

const mapDispatchToProps = dispatch => ({
    loadCampaignPosts: campaignId => dispatch(CampaignAction.getCampaignPost(campaignId)),
    loadChannelPosts: channelId => dispatch(ChannelAction.getChannelContent(channelId)),
    deleteCampaignPost: post => dispatch(PublishingContentAction.deleteCampaignPost(post)),
    getChannelContentPage: (channelId, page) =>
        dispatch(ChannelAction.getChannelContentPage(channelId, page)),
    searchChannelContent: (channelId, term) =>
        dispatch(ChannelAction.getChannelContentSearchResult(channelId, term)),
    updatePostCampaign: (id, campaignId, screen) =>
        dispatch(PublishingActions.updatePostCampaign(id, campaignId, screen)),
    getCampaignPostsPage: (campaignId, page) =>
        dispatch(CampaignAction.getCampaignPostsPage(campaignId, page)),
    searchCampaignPosts: (campaignId, term) =>
        dispatch(CampaignAction.getCampaignPostsSearchResult(campaignId, term))
});

export default withNavigationFocus(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(StorylineScreen)
);
