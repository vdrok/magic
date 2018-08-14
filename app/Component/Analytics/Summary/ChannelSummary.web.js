// @flow
import React from 'react';
import { getColorScale, getScaleColor } from "../../../Helpers/Colors";
import {  VictoryLabel, VictoryPie } from 'victory'
import { Card } from 'semantic-ui-react';
import type {DataChannelAnalytics, AnalyticsChannel, ChannelAnalyticsMetric} from '../../../Data/APIs'
import ChannelIcon from '../../ChannelIcon/ChannelIconComponent.web'
import colors from "../../../Styles/Colors";
import './ChannelSummary.style.scss';

type Props = {
    itemNumber: number;
    totalCount: number;
    analytics: Array<DataChannelAnalytics>;
    channelId: number;
    metric: ChannelAnalyticsMetric,
    onClick?: () => mixed,
};

type State = {

};

const numeral = require('numeral');

export default class ChannelSummary extends React.PureComponent<Props,State> {

    total:number = 0;
    value:number = 0;
    state = {
    };

    constructor(){
        super();
    }

    _calculateValue(){
        this.total = 0;
        this.value = 0;
        const that = this;
        this.props.analytics.map((el:DataChannelAnalytics) => {
            if(el.analytics && el.analytics.summary && el.analytics.summary[that.props.metric]){
                that.total += el.analytics.summary[that.props.metric];
                if(el.id === that.props.channelId){
                    that.value = el.analytics.summary[that.props.metric];
                }
            }
        });
    }

    _getPercent():number{
        return (this.value / this.total) * 100;
    }

    _getPercentText():string{
        return numeral(this._getPercent() / 100).format('0%')
    }

    _getTotalValue():string{
        return numeral(this.value).format('0a');
    }

    _getChannelType(){
        const channel = this.props.analytics.filter((ch:DataChannelAnalytics) => ch.id === this.props.channelId);
        return channel[0].type;
    }

    _getChannelName(){
        const channel = this.props.analytics.filter((ch:DataChannelAnalytics) => ch.id === this.props.channelId);
        return channel[0].name;
    }

    onPress(){
        if(this.props.onClick){
            this.props.onClick();
        }
    }

    renderChart(){
        return <VictoryPie
            innerRadius={180}
            animate={{
                duration: 1000,
                onLoad: { duration: 1000 }
            }}
            colorScale={[getScaleColor(this.props.itemNumber, this.props.totalCount), colors.background]}
            style={{ labels: { fill: '#ffffff00'} }}
            padding={15}
            data={[
                {  y: this._getPercent(), label: this._getPercentText() },
                {   y: 100 - this._getPercent() },
            ]}
        >
        </VictoryPie>

    }

    render() {
        this._calculateValue();

        return <Card  onClick={() => this.onPress()} className='analytics-channel-summary'>
            <Card.Content>

            <ChannelIcon fontSize="48px" color="#D8D8D8"  icon={true} channel={this._getChannelType()} className='channel-icon'/>
            <p className="main">{this._getTotalValue()}</p>
            <p className="percent">{this._getPercentText()}</p>
            {this.renderChart()}

            <p className='channel-name'>{this._getChannelName()}</p>
            </Card.Content>
        </Card>
        }

}