// @flow
import React from 'react';
import {getColorScale} from "../../../Helpers/Colors";
import { VictoryStack, VictoryArea  } from 'victory-native'
import { mockChannelAnalytics } from '../../../Fixtures/AnalyticsFixtures'
import type { DataChannelAnalytics, AnalyticsChannel, ChannelAnalyticsMetric } from '../../../Data/APIs'

type Props = {
    channels: Array<DataChannelAnalytics>,
    metric: ChannelAnalyticsMetric,
    loading: boolean,
};

type State = {
    channels: Array<DataChannelAnalytics>,
    metric: ChannelAnalyticsMetric,
    loading: boolean,
};

export default class ChannelChart extends React.PureComponent<Props,State> {

    state = {
        channels: [],
        metric: 'brutto_reach',
        loading: false,
    };

    dates: Array<string> = [];

    constructor(){
        super();
    }


    render() {

        const that = this;
        if(this.props.loading){
            return this.renderExample();
        }

        if(this.props.channels.length === 0) {
            return this.renderExample();
        }

        this._prepareDates(this.props.channels);

        return <VictoryStack
            padding={0}
            colorScale={getColorScale(this.props.channels.length)}
            height={150}
        >
            { this.props.channels.map( (element:DataChannelAnalytics , index) => {

                const data = that._prepareData(element.analytics);
                if(data.length === 0) { return null; }

                return <VictoryArea key={index}
                                    data={data}
                                    interpolation="natural"
                    /* labels={(datum) => datum.y}
                     labelComponent={<VictoryLabel renderInPortal />}*/

                />

            } ) }


        </VictoryStack>
    }

    // Build X values table. Some channels can have no values for each date
    _prepareDates(analytics:Array<DataChannelAnalytics>){
        this.dates = [];
        const that = this;
        analytics.map((channel:DataChannelAnalytics) => {
            for (const date in channel.analytics) {
                if(date === 'summary') { continue; }
                if(that.dates.indexOf(date) === -1){
                    that.dates.push(date);
                }
            }
        });

    }

    _prepareData(analytics:AnalyticsChannel){

        let results = [];
        this.dates.map((date:string) =>{
            if(analytics[date] && analytics[date][this.props.metric]){
                results.push({
                    x: date,
                    y: analytics[date][this.props.metric]
                })
            }else{
                results.push({
                    x: date,
                    y: 0
                })
            }
        });
        return results;
        //return //[{x: "1", y: 2}, {x: "2", y: 3}, {x: "3", y: 5},{x: "4", y: 5},{x: "5", y: 5},{x: "6", y: 15},{x: "7", y: 25}]
    }


    renderExample(){

        const exampleData = mockChannelAnalytics();
        this._prepareDates(exampleData);

        return <VictoryStack
            padding={0}
            colorScale={getColorScale(this.props.channels.length)}
            height={150}
            style={{
                parent: { opacity:  0.2 }}}
        >
            { exampleData.map( (element:DataChannelAnalytics , index) => {

                const data = this._prepareData(element.analytics);

                if(data.length === 0) { return null; }

                return <VictoryArea key={index}
                                    data={data}
                                    interpolation="natural"
                    /* labels={(datum) => datum.y}
                     labelComponent={<VictoryLabel renderInPortal />}*/

                />

            } ) }


        </VictoryStack>
    }



}