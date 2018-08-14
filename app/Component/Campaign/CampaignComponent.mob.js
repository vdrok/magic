import React from 'react';
import { Text, View, TouchableWithoutFeedback } from 'react-native';
import { SwipeRow, Button } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import moment from 'moment/moment';

import CampaignEditModalComponent from '../CampaignEditModal/CampaignEditModalComponent.mob';
import WhiteBoxComponent from '../WhiteBox/WhiteBoxComponent.mob';
import Style from './Style/CampaignStyle';
const numeral = require('numeral');

export default class CampaignComponent extends React.Component {
    static propTypes = {
        campaign: PropTypes.shape({}).isRequired,
        placeholder: PropTypes.bool,
        onPress: PropTypes.func,
        hideEditButtons: PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.state = {
            campaign: this.props.campaign
        };
        this.handleOnPress = this.handleOnPress.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleEditSuccessCallback = this.handleEditSuccessCallback.bind(this);
    }

    _renderPlaceHolder(){
        if(!this.props.placeholder) return null;

        return <WhiteBoxComponent style={[Style.campaignListElement, {opacity: 0.5}]}>
                        {this._renderInnerContent()}
                        </WhiteBoxComponent>
    }

    render() {
        if(this.props.placeholder){
            return this._renderPlaceHolder();
        }


        if(this.props.hideEditButtons){
            return <View style={Style.campaignListElementRowWrap}>
                        <WhiteBoxComponent style={Style.campaignListElement}>
                            {this._renderInnerContent()}
                        </WhiteBoxComponent>
            </View>
        }


        return (
            <View style={Style.campaignListElementRowWrap}>
                <SwipeRow
                    ref={(c) => { this.swipeComponent = c }}
                    style={Style.campaignListElementRow}
                    disableRightSwipe={true}
                    rightOpenValue={-75}
                    body={
                        <WhiteBoxComponent style={Style.campaignListElement}>
                            {this._renderInnerContent()}
                        </WhiteBoxComponent>
                    }
                    right={
                        <Button success onPress={this.handleEdit} >
                            <Icon name="edit" size={25} />
                        </Button>
                    }
                />
            </View>
        );
    }

    _renderInnerContent() {
        const { name, start_date, end_date, publishing_content_count, publishing_content_drafts_count, analytics } = this.state.campaign;

        const endDate = end_date ? (
            <Text> - {moment(end_date).format('ll')}</Text>
        ) : (
            <Text> - ...</Text>
        );

        return (
            <TouchableWithoutFeedback onPress={this.handleOnPress}>
                <View style={Style.campaignListElementInner}>
                    <Text style={Style.name}>{name}</Text>
                    <Text style={Style.price}>
                        <Text style={Style.date}>{publishing_content_count} posts, {publishing_content_drafts_count} drafts</Text>
                    </Text>
                    <Text style={[Style.date]}>
                        {moment(start_date).format('ll')} {endDate}
                    </Text>
                    <View style={Style.spacer} />

                    { analytics && analytics.nett_reach &&  <View style={Style.horizontal}>
                        <View style={Style.analyticsValueWrapper}>
                            <Text style={[Style.analytics,Style.analyticsValue]}>{ numeral(analytics.nett_reach).format('0a') }</Text>
                        </View>
                        <View >
                            <Text style={Style.analytics}>gross reach</Text>
                        </View>
                    </View> }

                    { analytics && analytics.nett_reach &&  <View style={Style.horizontal}>
                        <View style={Style.analyticsValueWrapper}>
                            <Text style={[Style.analytics,Style.analyticsValue]}>{ numeral((analytics.shares + analytics.comments + analytics.favourite) /  analytics.nett_reach).format('0.00%') }</Text>
                        </View>
                        <View >
                            <Text style={Style.analytics}>engagement rate</Text>
                        </View>
                    </View> }

                    <CampaignEditModalComponent
                        campaign={this.state.campaign}
                        onSuccessCallback={this.handleEditSuccessCallback}
                        ref="campaignEditModal"
                    />
                </View>
            </TouchableWithoutFeedback>
        );
    }

    handleEdit() {
        this.refs.campaignEditModal.show();
        if(this.swipeComponent && this.swipeComponent._root){
            this.swipeComponent._root.closeRow();
        }
    }

    handleEditSuccessCallback(data) {
        this.refs.campaignEditModal.hide();
        this.setState({
            campaign: { ...this.state.campaign, name: data.name }
        });
    }

    handleOnPress(){
        if(this.props.onPress){
            this.props.onPress();
        }
    }
}