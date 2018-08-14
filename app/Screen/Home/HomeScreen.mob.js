import React from 'react';
import { connect } from 'react-redux';
import { pathOr } from 'ramda';
import {Image, Text, ScrollView, View} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { logo } from '../../Helpers';

import styles from './Style/HomeScreenStyle'

import CampaignComponent from '../../Component/Campaign/CampaignComponent.mob';
import ButtonComponent from '../../Component/Button/ButtonComponent.mob';

import { Creators as CampaignAction } from '../../Reducer/CampaignReducer';
import LoadingContent from "../../Component/LoadingContent/LoadingContent.mob";

class HomeScreen extends React.Component {
    static navigationOptions = {
        title: <Image source={ logo } style={styles.header_logo} />,
        tabBarLabel: 'Stories',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="import-contacts" size={30} color={tintColor} />
        ),
        headerLeft: <Text style={styles.headerLeftTitle}>Stories</Text>
    };

    constructor(props) {
        super(props);

        this.state = {
            campaignsList: []
        }
        this.onCampaignPress = this.onCampaignPress.bind(this);
    }

    componentDidMount() {
        this.props.getCampaigns();
    }

    componentWillReceiveProps(props) {
        this.setState({
            campaignsList: pathOr(this.state.campaignsList,['campaigns'], props),
        });
    }

    render() {
        return <View style={[styles.fullHeight, styles.container]}>

            {this._renderLoading()}
            {this._renderEmpty()}

            <ScrollView>
                {this._renderCampaigns()}
            </ScrollView>

            {this._renderNewCampaignButton()}
        </View>
    }

    _renderLoading(){
        if(this.props.loading && this.state.campaignsList.length === 0)
            return <LoadingContent />

        return null;
    }

    _renderEmpty(){
        if(!this.props.loading && this.state.campaignsList.length === 0)
            return  <View style={[styles.list]}><ScrollView>
                <CampaignComponent placeholder={true} campaign={{
                    name: 'Your first story',
                    publishing_content_count: 4,
                    publishing_content_drafts_count: 1,
                    start_date: moment().subtract('5 days').toISOString(),
                    analytics: {
                        nett_reach: 123123,
                        comments: 12335,
                        shares: 0,
                        favourite: 224,
                        clicks: 123
                    }
            }} />

                <Text style={styles.promoText}>Create your first story and assign your posts</Text>

            </ScrollView></View>

        return null;
    }

    _renderCampaigns() {
        return <View style={styles.list}>
            {this._renderListOfCampaigns()}
        </View>
    }

    _renderListOfCampaigns() {
        return this.state.campaignsList.map((campaign, index) => {
            return <CampaignComponent campaign={campaign} key={index}
                    onPress={()=>this.onCampaignPress(campaign)}
            />
        })
    }

    _renderNewCampaignButton() {
        return <ButtonComponent style={styles.addCampaignButton} onPress={() => this.props.navigation.navigate('CampaignsScreen')}>
            New Story +
        </ButtonComponent>
    }

    onCampaignPress(campaign){
            return this.props.navigation.navigate('StorylineScreen', {
                campaign
            });
    }
}

const mapStateToProps = state => ({
    campaigns: state.campaign.list,
    loading: state.campaign.loading,
});

const mapDispatchToProps = dispatch => ({
    getCampaigns: () => dispatch(CampaignAction.getCampaigns())
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);