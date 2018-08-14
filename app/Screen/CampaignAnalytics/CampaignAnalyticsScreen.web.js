import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {pathOr, remove} from 'ramda';
import {Creators as CampaignAction} from '../../Reducer/CampaignReducer';
import {Grid, Header, Table, Image} from 'semantic-ui-react'

import BackButtonComponent from '../../Component/BackButton/BackButtonComponent.web';
import PublishingContentSmallComponent from '../../Component/PublishingContentSmall/PublishingContentSmallComponent.web'
import {CHANNEL_TYPES, logo_socials, numberFormatWithSeparator, POST_STATUSES} from "../../Helpers";

import './Style/CampaignAnalyticsScreen.scss'

class CampaignAnalyticsScreen extends React.Component {

    static propTypes = {
        location: PropTypes.shape({
            state: PropTypes.shape({
                campaign: PropTypes.shape({
                    name: PropTypes.string.isRequired,
                    id: PropTypes.number.isRequired,
                })
            })
        }),
        analytics: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            campaign: props.location.state.campaign,
            postsList: [],
            analytics: []
        }
    }

    componentDidMount() {
        this.props.getCampaignAnalytics(this.props.location.state.campaign.id);
        this.props.loadCampaignPosts(this.props.location.state.campaign.id);
    }

    componentWillReceiveProps(props) {
        this.setState({
            analytics: pathOr(this.state.analytics, ['analytics'], props),
            postsList: pathOr(this.state.postsList, ['postsList'], props).filter(p => p.status === POST_STATUSES.LIVE),
        })
    }

    render() {
        const {name} = this.state.campaign

        return <Grid stackable className="screen-campaignAnalytics">
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
            <Grid.Row>
                <Grid.Column>
                    <Header as='h4'>Total per channel</Header>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    {this._renderTable('channels')}
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <Header as='h4'>Campaign analytics</Header>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    {this._renderTable()}
                </Grid.Column>
            </Grid.Row>
        </Grid>
    }

    _renderTable(type) {
        return <Table celled structured>
            {this._renderTableHeader()}
            {this._renderTableBody(type)}
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
                <Table.HeaderCell>Gross Reach</Table.HeaderCell>
                <Table.HeaderCell>Net Reach</Table.HeaderCell>
                <Table.HeaderCell>Comments</Table.HeaderCell>
                <Table.HeaderCell>Shares</Table.HeaderCell>
                <Table.HeaderCell>Favourite</Table.HeaderCell>
                <Table.HeaderCell>Clicks</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
    }

    _renderTableBody(type) {
        const data = type === 'channels' ? this.getChannelsData() : this.state.postsList;

        return <Table.Body>
            {data.map(item => {
                return this._renderTableRows(item, type)
            })}
        </Table.Body>
    }

    _renderTableRows(item, type) {

        const itemAnalytics = type === 'channels' ? item.contentAnalytics : this.getPostAnalytics(item)

        return <Table.Row key={item.id} className='text-center'>
            <Table.Cell textAlign='left'>
                {type === 'channels' ? <div>
                    {this._renderChannel(item)}
                </div> : <PublishingContentSmallComponent post={item}/>}

            </Table.Cell>
            <Table.Cell>{numberFormatWithSeparator(itemAnalytics.brutto_reach)}</Table.Cell>
            <Table.Cell>{numberFormatWithSeparator(itemAnalytics.nett_reach)}</Table.Cell>
            <Table.Cell>{numberFormatWithSeparator(itemAnalytics.comments)}</Table.Cell>
            <Table.Cell>{numberFormatWithSeparator(itemAnalytics.shares)}</Table.Cell>
            <Table.Cell>{numberFormatWithSeparator(itemAnalytics.favourite)}</Table.Cell>
            <Table.Cell>{numberFormatWithSeparator(itemAnalytics.clicks)}</Table.Cell>
            <Table.Cell>{numberFormatWithSeparator(itemAnalytics.conversions)}</Table.Cell>
        </Table.Row>
    }

    _renderChannel(channel) {
        const {name, type} = channel
        const textStyle = type === CHANNEL_TYPES.FACEBOOK_ACCOUNT || type === CHANNEL_TYPES.FACEBOOK_PAGE ? 'text-margin' : ''

        return <p>
            <Image src={logo_socials[type]} alt={type} spaced className="channel-image"/>
            <span className={textStyle}>{name}</span>
        </p>
    }

    getPostAnalytics(post) {
        return this.state.analytics.find(item => item.content_id === post.id) || {}
    }

    getChannelsData() {
        const uniqueChannels = [...new Set(this.state.postsList.map(post => post.channel.id))];
        let channelsData = [];

        uniqueChannels.map(channelId => {
            let sum = {};

            this.state.postsList.map(post => {
                if (post.channel.id !== null && post.channel.id === channelId) {
                    const postAnalytics = this.getPostAnalytics(post);

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
}

const mapStateToProps = state => ({
    analytics: state.campaign.analytics,
    postsList: state.posts.postsList,
});

const mapDispatchToProps = dispatch => ({
    getCampaignAnalytics: (campaignId) => dispatch(CampaignAction.getCampaignAnalytics(campaignId)),
    loadCampaignPosts: campaignId => dispatch(CampaignAction.getCampaignPost(campaignId)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CampaignAnalyticsScreen));