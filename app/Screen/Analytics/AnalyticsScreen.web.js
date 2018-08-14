// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link,  withRouter} from 'react-router-dom'
import { Header, Card, Container, Dropdown , Grid, Form, Button, Segment} from 'semantic-ui-react'
import { pathOr } from 'ramda';
import './Style/AnalyticsScreen.scss'
import {Creators as AnalyticsAction} from "../../Reducer/AnalyticsReducer";
import {Creators as CampaignAction} from "../../Reducer/CampaignReducer";
import type {ChannelAnalyticsMetric, DataChannelAnalytics, DataChannelAnalyticsPeriod} from "../../Data/APIs";
import ChannelChart from "../../Component/Analytics/Chart/ChannelChart.web";
import ChannelSummary from "../../Component/Analytics/Summary/ChannelSummary.web";
import CampaignComponent from "../../Component/Campaign/CampaignComponent.web";
import LoadingContent from "../../Component/LoadingContent/LoadingContent.web";

type Props = {
    loadingChannels: boolean,
    loadingCampaigns: boolean,
    channels: Array<DataChannelAnalytics>,
    campaigns: Array<any>,
    getChannelAnalytics: (DataChannelAnalyticsPeriod)=>mixed,
    getCampaigns:()=>mixed,
    history: any,
};

type State = {
    loadingChannels: boolean,
    loadingCampaigns: boolean,
    campaigns: Array<any>,
    channels: Array<DataChannelAnalytics>,
    metric: ChannelAnalyticsMetric,
    period: DataChannelAnalyticsPeriod
};

class AnalyticsScreen extends React.Component<Props, State> {

    state = {
        loadingChannels: true,
        loadingCampaigns: true,
        channels: [],
        campaigns: [],
        metric: 'brutto_reach',
        period: '7days'
    };

    constructor(){
        super();

        this.handleAddStory = this.handleAddStory.bind(this);
        this.handleAddChannel = this.handleAddChannel.bind(this);
        this.handleMetricChange = this.handleMetricChange.bind(this);
        this.handlePeriodChange = this.handlePeriodChange.bind(this);
        this.handleStoryClick = this.handleStoryClick.bind(this);
    }


    componentDidMount(){
        this.props.getChannelAnalytics(this.state.period);
        this.props.getCampaigns();
    }


    componentWillReceiveProps (nextProps:Props, nextContext:Props) {
        this.setState({
            loadingChannels: nextProps.loadingChannels,
            loadingCampaigns: nextProps.loadingCampaigns,
            channels: pathOr(this.state.channels,['channels'], nextProps),
            campaigns: pathOr(this.state.campaigns,['campaigns'], nextProps),
        });
    }

    handlePeriodChange(period){
        this.setState({
            'period': period,
        });
        this.props.getChannelAnalytics(period);
    }

    handleMetricChange(metric){
        this.setState({
            'metric': metric,
        })
    }

    handleChannelPress(channel){

        this.props.history.push('/channel-analytics', {
            channel: channel
        });
    }

    handleStoryClick(campaign){

        this.props.history.push('/campaign-analytics', {
            campaign: campaign
        });
    }

    handleAddChannel(){
        this.props.history.push('/settings-channels');
    }

    handleAddStory(){
        this.props.history.push('/campaigns');
    }


    renderChart(){
        return <div>
            <ChannelChart metric={this.state.metric} channels={this.state.channels} loading={this.state.loadingChannels} />
        </div>
    }

    renderChannelsLoader(){
        if(this.state.loadingChannels)
        return <LoadingContent className='loading'/>
    }

    renderStoriesLoader(){
        if(this.state.loadingCampaigns)
            return <LoadingContent className='loading'/>
    }

    renderFilters(enabled){

        const periods = [{
            key: '7days',
            text: 'Last 7 days',
            value: '7days'
        },
            {
                key: '28days',
                text: 'Last 28 days',
                value: '28days'
            }
        ];

        const metrics = [
            {key: 'brutto_reach', text: 'Brutto Reach', value: 'brutto_reach'},
            {key: 'nett_reach', text: 'Net Reach', value: 'nett_reach'},
            {key: 'followers', text: 'Followers', value: 'followers'},

        ];

        return <Form>
            <Form.Group widths='equal'>
            <Dropdown className='filter left' selection fluid
                         options={periods}
                         defaultValue={this.state.period}
                         value={this.state.period}
                         onChange={(e,status) => this.handlePeriodChange(status.value)}
                         disabled={!enabled}
        />

            <Dropdown className='filter right' selection fluid
                      options={metrics}
                      defaultValue={this.state.metric}
                      value={this.state.metric}
                      onChange={(e,status) => this.handleMetricChange(status.value)}
                      disabled={!enabled}
            />

            </Form.Group>
        </Form>
       ;
    }

    _renderHeader() {

        const disabled = this.state.loadingChannels || this.state.channels.length === 0;

        return <Grid stackable columns={2}>
            <Grid.Column  width={3} textAlign='left'>
                <Header as="h1">Analytics</Header>
            </Grid.Column>
            <Grid.Column  width={9} textAlign='right' floated='right'>
                {this.renderFilters(!disabled)}
            </Grid.Column>
        </Grid>;
    }

    _renderCampaignsList() {

        if(this.state.loadingCampaigns) return null;

        if(this.state.campaigns.length === 0){
            return <Segment basic textAlign='center' size='big'>
                <Button className="btn secondary" size='huge' content="Create your first story" onClick={() => this.handleAddStory() } />
            </Segment>

        }

        return <Card.Group>

            {this.state.campaigns.map((campaign, index) =>
                <CampaignComponent campaign={campaign} key={index} hideEditButtons={true} onClick={() => this.handleStoryClick(campaign)} />) }
        </Card.Group>;
    }

    renderChannels(){

        if(this.state.loadingChannels) return null;

        if(this.state.channels.length === 0){
            return <Segment basic textAlign='center' size='big'>
                <Button className="btn" size='huge' content="Connect your first channel" onClick={() => this.handleAddChannel() } />
            </Segment>

        }
        return <Grid columns={4} doubling stackable>
            {this.state.channels.map((item, i)=>  <Grid.Column key={item.id} stretched>
                <ChannelSummary key={i} itemNumber={i + 1}
                                analytics={this.props.channels}
                                totalCount={this.props.channels.length}
                                channelId={item.id}
                                metric={this.state.metric}
                                onClick={() => this.handleChannelPress(item)}/>
            </Grid.Column>)}
        </Grid>

    }


    render() {
        return <Container className="screen-analytics">
            {this._renderHeader()}

            {this.renderChart()}

            {this.renderChannelsLoader()}

            {this.renderChannels()}

            <Header as="h3" className='promo'>Total stories values</Header>

            {this.renderStoriesLoader()}

            {this._renderCampaignsList()}




        </Container>;
    }

}

const mapStateToProps = state => ({
    loadingChannels: state.analytics.loading,
    channels: state.analytics.channels,
    campaigns: state.campaign.list,
    loadingCampaigns: state.campaign.loading,
});

const mapDispatchToProps = dispatch => ({
    getChannelAnalytics: (period) => dispatch(AnalyticsAction.getChannelsAnalytics(period)),
    getCampaigns: () => dispatch(CampaignAction.getCampaigns())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AnalyticsScreen));