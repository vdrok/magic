import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {pathOr, remove} from 'ramda';
import {Grid, Header, Table, Dropdown} from 'semantic-ui-react'
import moment from 'moment';

import BackButtonComponent from '../../Component/BackButton/BackButtonComponent.web';
import AnalyticsChartComponent from "../../Component/AnalyticsChart/AnalyticsChartComponent.web";
import PublishingContentSmallComponent from '../../Component/PublishingContentSmall/PublishingContentSmallComponent.web'

import ChannelActions from "../../Reducer/ChannelReducer";

import {numberFormatWithSeparator, POST_STATUSES} from "../../Helpers";
import {
default_channel_stats, stats_description, stats_total_period_description,
twitter_channel_stats
} from "../../Helpers/AnalyticsProps";

import './Style/ChannelAnalyticsScreen.scss'

class ChannelAnalyticsScreen extends React.Component {

    static propTypes = {
        location: PropTypes.shape({
            state: PropTypes.shape({
                channel: PropTypes.shape({
                    name: PropTypes.string.isRequired,
                    id: PropTypes.number.isRequired,
                })
            })
        }),
        analytics: PropTypes.array.isRequired,
        contentAnalytics: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            channel: props.location.state.channel,
            postsList: [],//.filter(p => p.status === POST_STATUSES.LIVE),
            analytics: [],
            contentAnalytics: [],
            selectedValueChannel: default_channel_stats[0],
            dateInterval: {
                startDate: moment().subtract(30, "days").format('YYYY-MM-DD'),
                endDate: moment().format('YYYY-MM-DD')
            }
        }
    }

    componentDidMount() {
        const channelId = this.props.location.state.channel.id;
        this.props.getChannelAnalytics(channelId, this.state.dateInterval);
        this.props.getChannelContentAnalytics(channelId);
        this.props.loadChannelPosts(channelId);
    }

    componentWillReceiveProps(props) {
        this.setState({
            analytics: pathOr(this.state.analytics, ['analytics'], props),
            contentAnalytics: pathOr(this.state.contentAnalytics, ['contentAnalytics'], props),
            postsList: pathOr(this.state.postsList, ['postsList'], props),
        })
    }

    render() {
        const {name} = this.state.channel

        return <Grid stackable className="screen-channelAnalytics">
            <Grid.Row>
                <Grid.Column>
                    <BackButtonComponent/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={8}>
                    <Header as='h3'>{name}</Header>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row >
                <Grid.Column width={4}>
                    {this._renderTotalStats()}
                </Grid.Column>
                <Grid.Column  width={12} className='text-right'>
                    {this._renderSelect()}
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column className='background-gray'>
                    {this._renderChart()}
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    {this._renderContentAnalytics()}
                </Grid.Column>
            </Grid.Row>
        </Grid>
    }

    _renderTotalStats() {
        const {type} = this.state.channel

        return <div className="align-center">
            <Header as="h2">
                {this.getTotalStatsByValue(this.state.selectedValueChannel.value)}
                <Header.Subheader>{stats_description[this.state.selectedValueChannel.value][type]}</Header.Subheader>
                <Header.Subheader>{stats_total_period_description[type]}</Header.Subheader>
            </Header>

        </div>
    }

    _renderSelect() {
        return <Dropdown
            selection
            options={this.getChannelOptions()}
            defaultValue={this.state.selectedValueChannel.value}
            onChange={this.onChannelValueChange.bind(this)}/>
    }

    _renderChart() {
        return <AnalyticsChartComponent
            data={this.getChartData()}
            yAxisName={this.state.selectedValueChannel.text}/>
    }

    _renderContentAnalytics() {
        return <Table celled structured>
            {this._renderTableHeader()}
            {this._renderTableBody()}
        </Table>
    }

    _renderTableHeader() {
        return <Table.Header className='text-center'>
            <Table.Row>
                <Table.HeaderCell rowSpan='2'>Post</Table.HeaderCell>
                <Table.HeaderCell colSpan='2'>Reach</Table.HeaderCell>
                <Table.HeaderCell colSpan='4'>Engagement</Table.HeaderCell>
                <Table.HeaderCell rowSpan='2'>Conversions</Table.HeaderCell>
            </Table.Row>
            <Table.Row>
                <Table.HeaderCell>Brutto Reach</Table.HeaderCell>
                <Table.HeaderCell>Net Reach</Table.HeaderCell>
                <Table.HeaderCell>Comments</Table.HeaderCell>
                <Table.HeaderCell>Shares</Table.HeaderCell>
                <Table.HeaderCell>Favourite</Table.HeaderCell>
                <Table.HeaderCell>Clicks</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
    }

    _renderTableBody() {
        return <Table.Body>
            {this.state.postsList.filter(p => p.status === POST_STATUSES.LIVE).map(post => {
                return this._renderTableRows(post)
            })}
        </Table.Body>
    }

    _renderTableRows(post) {

        const postAnalytics = this.getPostAnalytics(post)

        return <Table.Row key={post.id} className='text-center'>
            <Table.Cell textAlign='left'>
                <PublishingContentSmallComponent
                    post={post}
                    showChannel={false}
                />
            </Table.Cell>
            <Table.Cell>{numberFormatWithSeparator(postAnalytics.brutto_reach)}</Table.Cell>
            <Table.Cell>{numberFormatWithSeparator(postAnalytics.nett_reach)}</Table.Cell>
            <Table.Cell>{numberFormatWithSeparator(postAnalytics.comments)}</Table.Cell>
            <Table.Cell>{numberFormatWithSeparator(postAnalytics.shares)}</Table.Cell>
            <Table.Cell>{numberFormatWithSeparator(postAnalytics.favourite)}</Table.Cell>
            <Table.Cell>{numberFormatWithSeparator(postAnalytics.clicks)}</Table.Cell>
            <Table.Cell>{numberFormatWithSeparator(postAnalytics.conversions)}</Table.Cell>
        </Table.Row>
    }

    getChannelOptions() {
        const {type} = this.state.channel

        let options = default_channel_stats;

        if (type === 'twitter') {
            options = [...options, ...twitter_channel_stats];
        }

        return options
    }

    getTotalStatsByValue(value) {
        const totalStatsRow = this.state.analytics.find(item => item.date === null)

        return totalStatsRow ? numberFormatWithSeparator(totalStatsRow[value]) : 'n/a'
    }

    getPostAnalytics(post) {
        return this.state.contentAnalytics.find(item => item.content_id === post.id) || {}
    }

    getChartData() {
        let data = []
        this.state.analytics.map(item => {
            if (item.date !== null) {
                data.push({
                    x: moment(item.date, "YYYY-MM-DD HH:mm:ss").format('MMM DD'),
                    y: item[this.state.selectedValueChannel.value] !== null ? item[this.state.selectedValueChannel.value] : 0
                })
            }
        })

        return data;
    }

    onChannelValueChange(event, selected) {
        const option = selected.options.find(item => item.value === selected.value)
        this.setState({
            selectedValueChannel: {
                value: option.value,
                text: option.text
            }
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChannelAnalyticsScreen));