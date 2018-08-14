import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {pathOr, remove} from 'ramda';
import ChannelActions from '../../Reducer/ChannelReducer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {View, Text, Button, ScrollView} from 'react-native';
import moment from "moment/moment";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import style from './Style/ChannelAnalyticsScreenStyle'
import PickerComponent from "../../Component/Picker/PickerComponent.mob";
import {numberFormatWithSeparator, POST_STATUSES} from "../../Helpers";
import AnalyticsPostComponent from "../../Component/AnalyticsPost/AnalyticsPostComponent.mob";
import {
content_stats,
default_channel_stats, stats_description, stats_total_period_description,
twitter_channel_stats
} from "../../Helpers/AnalyticsProps";
import AnalyticsChartComponent from "../../Component/AnalyticsChart/AnalyticsChartComponente.mob";
import GreenBar from "../../Component/GreenBar/GreenBar.mob";
import Colors from '../../Styles/Colors'


class ChannelAnalyticsScreen extends React.Component {

    static navigationOptions = ({navigation}) => {
        const headerLeft = (
            <Button
                title="Back"
                onPress={() => {navigation.goBack(null)}}
            />
        );

        return {
            headerLeft,
            title: <Text>{navigation.state.params.channel.name}</Text>,
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
                    channel: PropTypes.shape({
                        name: PropTypes.string.isRequired,
                        id: PropTypes.number.isRequired
                    })
                })
            })
        }),
        analytics: PropTypes.array.isRequired,
        contentAnalytics: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            channel: props.navigation.state.params.channel,
            postsList: [],//props.navigation.state.params.postsList.filter(p => p.status === POST_STATUSES.LIVE),
            analytics: [],
            contentAnalytics: [],
            selectedValueChannel: default_channel_stats[0],
            selectedValueContent: content_stats[0],
            dateInterval: {
                startDate: moment().subtract(30, "days").format('YYYY-MM-DD'),
                endDate: moment().format('YYYY-MM-DD')
            }
        }
    }

    componentDidMount() {
        this.props.getChannelAnalytics(this.props.navigation.state.params.channel.id, this.state.dateInterval);
        this.props.getChannelContentAnalytics(this.props.navigation.state.params.channel.id);
        this.props.loadChannelPosts(this.props.navigation.state.params.channel.id);
    }


    componentWillReceiveProps(newProps) {
        this.setState({
            analytics: pathOr(this.state.analytics, ['analytics'], newProps),
            contentAnalytics: pathOr(this.state.contentAnalytics, ['contentAnalytics'], newProps),
            postsList: pathOr(this.state.postsList, ['postsList'], newProps),
        })
    }

    render() {
        return <ScrollView>
            <View style={[style.fullHeight, style.container]}>
                {this._renderHeader()}
                {this._renderChart()}
                {this._renderChannelContentAnalytics()}
            </View>
        </ScrollView>
    }

    _renderHeader() {
        return <View style={[style.horizontal, style.backgroundWhite]}>
            {this._renderTotalStats()}
            {this._renderPicker()}
        </View>
    }

    _renderTotalStats() {
        const {type} = this.state.channel

        return <View style={style.statsWrapper}>
            <Text style={style.statsValue}>{this.getTotalStatsByKey(this.state.selectedValueChannel.key)}</Text>
            <Text style={style.statsDescription}>{stats_description[this.state.selectedValueChannel.key][type]}</Text>
            <Text style={style.statsDescription}>{stats_total_period_description[type]}</Text>
        </View>
    }

    _renderPicker() {
        return <View style={[style.pickerWrapper,{paddingBottom: 10}]}>
            <PickerComponent
                iosHeader="Analytics type"
                textStyle={{color: '#000000', textAlign: 'right'}}
                options={this.getChannelPickerListOptions()}
                onChange={this.onChannelValueChange.bind(this)}/>
        </View>
    }

    _renderChart() {
        return <View style={style.chartWrapper}>
            <AnalyticsChartComponent
                data={this.getChartData()}
                yAxisName={this.state.selectedValueChannel.text}/>
        </View>
    }

    _renderChannelContentAnalytics() {
        return <View style={[style.fullHeight, style.backgroundWhite]}>
            <View style={style.greenBarWrapper}>
                <GreenBar text='Published content' />
                {this._renderChannelContentAnalyticsPicker()}
            </View>
            {this._renderPosts()}
        </View>
    }

    _renderChannelContentAnalyticsPicker() {
        return <View style={style.pickerWrapper}>
            <PickerComponent
                iconColor={Colors.white}
                textStyle={style.pickerTextStyle}
                iosHeader="Analytics type"
                options={content_stats}
                onChange={this.onContentValueChange.bind(this)}/>
        </View>
    }

    _renderPosts() {
        return <View>
            {this.state.postsList.filter(p => p.status === POST_STATUSES.LIVE).map(post => {
                return this._renderPost(post)
            })}
        </View>
    }

    _renderPost(post) {
        return <AnalyticsPostComponent
            key={post.id}
            post={post}
            withAnalytics={true}
            showChannel={false}
            postAnalytics={this.getPostAnalyticsValue(post)}
            displayAnalytics={this.state.selectedValueContent}/>
    }

    getChannelPickerListOptions() {
        const {type} = this.state.channel

        let options = default_channel_stats;

        if (type === 'twitter') {
            options = [...options, ...twitter_channel_stats];
        }

        return options
    }

    getTotalStatsByKey(key) {
        const totalStatsRow = this.state.analytics.find(item => item.date === null)

        return totalStatsRow ? numberFormatWithSeparator(totalStatsRow[key]) : 'n/a'
    }

    getPostAnalyticsValue(post) {
        return this.state.contentAnalytics.find(item => item.content_id === post.id) || {}
    }

    getChartData() {
        let data = []
        this.state.analytics.map(item => {
            if (item.date !== null) {
                data.push({
                    x: moment(item.date, "YYYY-MM-DD HH:mm:ss").format('MMM DD'),
                    y: item[this.state.selectedValueChannel.key] !== null ? item[this.state.selectedValueChannel.key] : 0
                })
            }
        })

        return data;
    }

    onChannelValueChange(value) {
      this.setState({
          selectedValueChannel: value
      })
    }

    onContentValueChange(value) {
        this.setState({
            selectedValueContent: value
        })
    }
}

const mapStateToProps = state => ({
    analytics: state.channel.analytics,
    contentAnalytics: state.channel.contentAnalytics,
    postsList: state.posts.postsList,
});

const mapDispatchToProps = dispatch => ({
    loadChannelPosts: channelId => dispatch(ChannelActions.getChannelContent(channelId)),
    getChannelAnalytics: (channelId, options) => dispatch(ChannelActions.getChannelAnalytics(channelId, options)),
    getChannelContentAnalytics: (channelId) => dispatch(ChannelActions.getChannelContentAnalytics(channelId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChannelAnalyticsScreen);