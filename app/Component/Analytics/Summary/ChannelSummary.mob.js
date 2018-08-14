// @flow
import React from 'react';
import { getColorScale, getScaleColor } from "../../../Helpers/Colors";
import {  VictoryLabel, VictoryPie } from 'victory-native'
import { Text, ViewPropTypes } from 'react-native';
import type {DataChannelAnalytics, AnalyticsChannel, ChannelAnalyticsMetric} from '../../../Data/APIs'
import colors from "../../../Styles/Colors";
import styles from "../../../Screen/Analytics/Style/AnalyticsScreenStyle";
import WhiteBox from "../../WhiteBox/WhiteBoxComponent.mob";
import ChannelIcon from '../../ChannelIcon/ChannelIconComponent.mob'

type Props = {
    style?: ViewPropTypes,
    itemNumber: number;
    totalCount: number;
    analytics: Array<DataChannelAnalytics>;
    channelId: number;
    metric: ChannelAnalyticsMetric,
    onPress?: () => mixed,
};

type State = {
    layoutWidth: number
};

const numeral = require('numeral');
const PADDING = 20;

export default class ChannelSummary extends React.Component<Props,State> {

    total:number = 0;
    value:number = 0;
    state = {
        layoutWidth: 0
    };

    constructor(){
        super();
        this.handleOnLayout = this.handleOnLayout.bind(this);
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
        if(this.props.onPress){
            this.props.onPress();
        }
    }

    renderChart(){
        //layout not yet render, we don't know the size of container
        if(this.state.layoutWidth === 0) return null;

        const width = this.state.layoutWidth - (PADDING * 2);
        const radius = (width / 2) - 10;

        return <VictoryPie
            innerRadius={radius}
            animate={{
                duration: 1000,
                onLoad: { duration: 1000 }
            }}
            width={width}
            colorScale={[getScaleColor(this.props.itemNumber, this.props.totalCount), colors.background]}
            style={{
                labels: { fill: colors.main, fontSize: 17, fontFamily: 'System' },
                parent: {paddingLeft: PADDING / 2}  }}
            height={width}
            padding={0}
            labels={[this._getPercentText(), ""]}
            data={[
                {  y: this._getPercent(), label: this._getPercentText() },
                {   y: 100 - this._getPercent() },
            ]}
           /* labelComponent={<VictoryLabel x={labelStart} y={labelStart+10} />}*/
        />

    }

    render() {
        this._calculateValue();
        const middle = this.state.layoutWidth / 2;
        return <WhiteBox style={[{position: 'relative'},this.props.style]}
                         onPress={() => this.onPress()}
                         onLayout={this.handleOnLayout}>
            <ChannelIcon icon={true} channel={this._getChannelType()}  style={{ position: 'absolute', left: 5, top: 5, fontSize: 20, color: colors.secondary }}/>
            <Text style={[styles.primaryText, styles.textBig, {textAlign: 'center'}]}>{this._getTotalValue()}</Text>
            <Text style={[styles.minorText, styles.textSmall]}>{/*paid 10k*/}</Text>
            <Text style={{ position: 'absolute', left: 0, width: this.state.layoutWidth, textAlign: 'center', top: middle + 10, fontSize: 19, color: colors.main, zIndex: 100 }}>{this._getPercentText()}</Text>
            {this.renderChart()}

            <Text style={[styles.minorText,  styles.textNormal]}>{this._getChannelName()}</Text>

        </WhiteBox>
        }


    handleOnLayout(e:any){
        if(this.state.layoutWidth < e.nativeEvent.layout.width){
            this.setState({
                'layoutWidth': e.nativeEvent.layout.width
            })
        }


    }

}