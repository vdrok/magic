import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {pathOr, remove} from 'ramda';
import {Creators as CampaignAction} from '../../Reducer/CampaignReducer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {View, Text, Button, ScrollView} from 'react-native';

import CampaignAnalyticsTabsComponent from "../../Component/CampaignAnalyticsTabs/CampaignAnalyticsTabsComponent.mob";
import AnalyticsPostComponent from "../../Component/AnalyticsPost/AnalyticsPostComponent.mob";

import style from './Style/CampaignAnalyticsScreenStyle'
import AnalyticsChannelComponent from "../../Component/AnalyticsChannel/AnalyticsChannelComponent.mob";
import {POST_STATUSES} from "../../Helpers";
import GreenBar from "../../Component/GreenBar/GreenBar.mob";


class CampaignAnalyticsScreen extends React.Component {

    static navigationOptions = ({navigation}) => {
        const headerLeft = (
            <Button
                title="Back"
                onPress={() => navigation.state.params.backHandler()}
            />
        );

        return {
            headerLeft,
            title: <Text>{navigation.state.params.campaign.name}</Text>,
            tabBarLabel: 'Analytics',
            tabBarIcon: ({tintColor}) => (
                <MaterialIcons name="bubble-chart" size={30} color={ tintColor } />
            ),
        };
    };

    static propTypes = {
        navigation: PropTypes.shape({
            state: PropTypes.shape({
                params: PropTypes.shape({
                    campaign: PropTypes.shape({
                        name: PropTypes.string.isRequired,
                        id: PropTypes.number.isRequired
                    })
                })
            })
        }),
        analytics: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            campaign: props.navigation.state.params.campaign,
            postsList: [],
            analytics: [],
            displayAnalytics: {}
        }

        this.onTabChange = this.onTabChange.bind(this)
    }

    componentDidMount() {
        this.props.getCampaignAnalytics(this.props.navigation.state.params.campaign.id);
        this.props.loadCampaignPosts(this.props.navigation.state.params.campaign.id);
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            analytics: pathOr(this.state.analytics, ['analytics'], newProps),
            postsList: pathOr(this.state.postsList, ['postsList'], newProps).filter(p => p.status === POST_STATUSES.LIVE),
        })
    }

    render() {
        return <ScrollView>
            <View style={style.fullHeight}>
                <View style={style.tabsContainer}>
                    {this._renderTabs()}
                </View>
                <View style={style.channelsContainer}>
                    {this._renderChannels()}
                </View>
                <View style={style.postsContainer}>
                    {this._renderPosts()}
                </View>
            </View>
        </ScrollView>
    }

    _renderTabs() {
        return <CampaignAnalyticsTabsComponent
            onChange={this.onTabChange}/>
    }

    _renderChannels() {
        return <View>
            {this.getChannelsData().map(channel => {
                return this._renderChannel(channel)
            })}
        </View>
    }

    _renderChannel(channel) {
        return <AnalyticsChannelComponent
            key={channel.id}
            channel={channel}
            displayAnalytics={this.state.displayAnalytics}/>
    }

    _renderPosts() {
        return <View>
            <GreenBar text='Campaign content' style={{height: 40}}/>
            <View>
                {this.state.postsList.map(post => {
                    return this._renderPost(post)
                })}
            </View>
        </View>
    }

    _renderPost(post) {
        return <AnalyticsPostComponent
            key={post.id}
            onClickHandler={() => this.onClickHandler(post)}
            post={post}
            withAnalytics={true}
            postAnalytics={this.getPostAnalyticsValue(post)}
            displayAnalytics={this.state.displayAnalytics}/>
    }

    getPostAnalyticsValue(post) {
        return this.state.analytics.find(item => item.content_id === post.id) || {}
    }

    getChannelsData() {
        const uniqueChannels = [...new Set(this.state.postsList.map(post => post.channel.id))];
        let channelsData = [];

        uniqueChannels.map(channelId => {
            let sum = {};

            this.state.postsList.map(post => {
                if (post.channel.id !== null && post.channel.id === channelId) {
                    const postAnalytics = this.getPostAnalyticsValue(post);

                    for (let [key] of Object.entries(postAnalytics)) {
                        if (key !== 'id' && key !== 'content_id' && key !== 'date') {
                            sum[key] = channelsData[channelId] ? channelsData[channelId].contentAnalytics[key] + postAnalytics[key] : postAnalytics[key];
                        }
                    }

                    channelsData[channelId] = {
                        id: post.channel.id,
                        name: post.channel.name,
                        type: post.channel.type,
                        contentAnalytics: sum
                    }
                }
            })
        })

        return channelsData;
    }

    onTabChange(displayAnalytics) {
        this.setState({
            displayAnalytics: displayAnalytics
        })
    }

    onClickHandler(post) {
        //@TODO. Go to post page analytics
        console.log('Post', post);
    }
}

const mapStateToProps = state => ({
    analytics: state.campaign.analytics,
    postsList: state.posts.postsList,
});

const mapDispatchToProps = dispatch => ({
    getCampaignAnalytics: (campaignId) => dispatch(CampaignAction.getCampaignAnalytics(campaignId)),
    loadCampaignPosts: campaignId => dispatch(CampaignAction.getCampaignPost(campaignId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CampaignAnalyticsScreen);