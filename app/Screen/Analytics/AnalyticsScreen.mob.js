// @flow

import React from 'react';
import { connect } from 'react-redux';
import { View, ScrollView, Text, FlatList, ActivityIndicator } from 'react-native';
import { withNavigation, SafeAreaView } from 'react-navigation';
import styles from './Style/AnalyticsScreenStyle';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TextSeparator from "../../Component/Layout/TextSeparator/TextSeparator.mob";
import {Creators as AnalyticsAction} from "../../Reducer/AnalyticsReducer";
import style from "../ChannelAnalytics/Style/ChannelAnalyticsScreenStyle";
import ChannelChart from "../../Component/Analytics/Chart/ChannelChart.mob";
import ChannelSummary from "../../Component/Analytics/Summary/ChannelSummary.mob";
import type {DataChannelAnalytics, DataChannelAnalyticsPeriod, ChannelAnalyticsMetric} from "../../Data/APIs";
import {Creators as CampaignAction} from "../../Reducer/CampaignReducer";
import CampaignComponent from '../../Component/Campaign/CampaignComponent.mob';
import { pathOr } from 'ramda';
import { Item, Picker } from 'native-base';
import whiteboxStyles from '../../Component/WhiteBox/Style/WhiteBoxComponentStyle'
import WhiteBox from "../../Component/WhiteBox/WhiteBoxComponent.mob";
import colors from "../../Styles/Colors";
import ButtonComponent from "../../Component/Button/ButtonComponent.mob";

type Props = {
    loadingChannels: boolean,
    loadingCampaigns: boolean,
    channels: Array<DataChannelAnalytics>,
    campaigns: Array<any>,
    getChannelAnalytics: (DataChannelAnalyticsPeriod)=>mixed,
    getCampaigns:()=>mixed,
    navigation: any,
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
    static navigationOptions = {
        tabBarLabel: 'Analytics',
        tabBarIcon: ({ tintColor }) => (
            <MaterialIcons name="bubble-chart" size={30} color={ tintColor } />
        ),
        header: null,
    };

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
        this.handlePeriodChange = this.handlePeriodChange.bind(this);
        this.handleMetricChange = this.handleMetricChange.bind(this);
        this.handleStoryPress = this.handleStoryPress.bind(this);
        this.handleConnectChannelPress = this.handleConnectChannelPress.bind(this);
        this.handleAddStoryPress = this.handleAddStoryPress.bind(this);
        this.handleChannelPress = this.handleChannelPress.bind(this);
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

    handleStoryPress(campaign){

        return this.props.navigation.navigate('CampaignAnalyticsScreen', {
            campaign: campaign ,
            backHandler: () => this.props.navigation.navigate('AnalyticsScreen')
        });
    }

    handleChannelPress(channel){

        return this.props.navigation.navigate('ChannelAnalyticsScreen', {
            channel: channel ,
            backHandler: () => this.props.navigation.navigate('AnalyticsScreen')
        });
    }

    handleConnectChannelPress(){
        return this.props.navigation.navigate('SettingsChannels');
    }

    handleAddStoryPress(){
        return this.props.navigation.navigate('CampaignsScreen');
    }

    renderChart(){
        return <ChannelChart metric={this.state.metric} channels={this.state.channels} loading={this.state.loadingChannels} />
    }

    renderStoriesList(){
        return this.state.campaigns.map((campaign,index) => <CampaignComponent campaign={campaign} key={index} hideEditButtons={true} onPress={()=>this.handleStoryPress(campaign)} />);
    }

    renderFilters(enabled){

        if(!enabled){
            return <View style={{flex: 0, flexDirection: 'row', justifyContent: 'space-between'}}>
                <WhiteBox >
                    <Text style={[styles.minorText, styles.textBig]}>REACH</Text>
                </WhiteBox>

                <WhiteBox >
                    <Text style={[styles.minorText, styles.textBig]}>Last 7 Days</Text>
                </WhiteBox>
            </View>
        }


        return <View style={{flex: 0, flexDirection: 'row', justifyContent: 'space-between'}}>
            <Item picker>
                <Picker
                    mode="dropdown"
                    style={whiteboxStyles.wrapper}
                    placeholder="Metric"
                    placeholderStyle={styles.secondaryText}
                    placeholderIconColor={styles.secondaryText}
                    textStyle={[styles.primaryText, styles.textBig]}
                    selectedValue={this.state.metric}
                    onValueChange={this.handleMetricChange}
                >

                    <Picker.Item label="Brutto Reach" value="brutto_reach" />
                    <Picker.Item label="Net Reach" value="nett_reach" />
                    <Picker.Item label="Followers" value="followers" />
                </Picker>
            </Item>

            <Item picker>
                <Picker
                    mode="dropdown"
                    style={whiteboxStyles.wrapper}
                    placeholder="Period"
                    placeholderStyle={styles.secondaryText}
                    placeholderIconColor={styles.secondaryText}
                    textStyle={[styles.primaryText, styles.textBig]}
                    selectedValue={this.state.period}
                    onValueChange={this.handlePeriodChange}
                >

                    <Picker.Item label="Last 7 days" value="7days" />
                    <Picker.Item label="Last 28 days" value="28days" />
                </Picker>
            </Item>
        </View>
    }

    renderLoading(){
        return <View style={[ style.container]}>

                    {this.renderFilters(false)}

                    {this.renderChart()}
                    <ActivityIndicator
                        size="large"
                        color={colors.main}
                        style={[styles.loader]}
                    />
                </View>;
    }


    renderChannels(){
        return <View>
            {this.renderFilters(true)}

            {this.renderChart()}

            <FlatList
                data={this.props.channels}
                numColumns={3}
                style={{flexGrow: 0}}
                horizontal={false}
                scrollEnabled={false}
                renderItem={(item) => <ChannelSummary key={item.index} itemNumber={item.index + 1}
                                                      analytics={this.props.channels}
                                                      totalCount={this.props.channels.length}
                                                      channelId={item.item.id}
                                                      metric={this.state.metric}
                                                      onPress={() => this.handleChannelPress(item.item)}
                                                      style={[styles.channelBox]} />}
            />

        </View>
    }

    renderEmptyChannels(){
        return <View style={[ style.container]}>

                    {this.renderFilters(false)}

                    {this.renderChart()}

                    <ButtonComponent onPress={() => this.handleConnectChannelPress()} active={true} style={[styles.loader,{marginBottom: 50}]}>Connect your first channel</ButtonComponent>

                </View>;
    }

    renderStories(){
        return <View style={styles.containerPadding}>
            {this.renderStoriesList()}
        </View>
    }

    renderEmptyStories(){
        return <View style={styles.containerPadding}>
            <ButtonComponent secondary={true} onPress={() => this.handleAddStoryPress()} active={true} style={styles.loader}>Create your first story</ButtonComponent>
        </View>
    }

    render() {

        return <SafeAreaView >
            <ScrollView>
                {this.renderContent()}
            </ScrollView>
        </SafeAreaView>;
    }

    renderContent(){
        const { loadingCampaigns, loadingChannels, channels, campaigns } = this.state;

        if(loadingCampaigns || loadingChannels){
            return this.renderLoading();
        }

        const channelView = channels.length === 0 ? this.renderEmptyChannels() : this.renderChannels();
        const storyView = campaigns.length === 0 ? this.renderEmptyStories() : this.renderStories();

        return <View style={[ style.container]}>
            {channelView}
            <TextSeparator text='Total stories values' />
            {storyView}
        </View>
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

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(AnalyticsScreen));