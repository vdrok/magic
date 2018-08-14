import React from 'react';
import PropTypes from 'prop-types';
import { VictoryChart, VictoryTheme, VictoryAxis, VictoryVoronoiContainer, VictoryTooltip, VictoryBar} from 'victory-native'
import Colors  from '../../Styles/Colors'
import { Dimensions } from 'react-native'

class AnalyticsChartComponent extends React.Component {

    static propTypes= {
        data: PropTypes.array.isRequired,
        yAxisName: PropTypes.string
    }

    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            yAxisName: props.yAxisName || 'Value: '
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            data: newProps.data,
            yAxisName: newProps.yAxisName || 'Value: '
        })
    }

    render() {
        const { width } = Dimensions.get('window')
        const yMaxValue = Math.max.apply(Math, this.state.data.map(function(o) { return o.y; }))

        return (
            <VictoryChart
                padding={{ top: 50, bottom: 50, left: 40, right: 15 }}
                domainPadding={{x:5}}
                containerComponent={<VictoryVoronoiContainer
                    voronoiDimension="x"
                    labels={(d) => `${d.x} \n ${this.state.yAxisName} ${d.y}`}
                    labelComponent={
                        <VictoryTooltip
                            cornerRadius={0}
                            flyoutStyle={{fill: "white"}}
                            orientation={(d) => d.eventKey === 0 ? "right" : (d.eventKey === this.state.data.length - 1 ? "left" : "bottom")}
                        />}
                />}>
                
                <VictoryBar
                    theme={VictoryTheme.material}
                    width={width}
                    padding={0}
                    height={270}
                    data={this.state.data}
                    barRatio={0.8}
                    style={{
                        data: {
                            fill: Colors.LinkColor,
                        },
                    }}
                />
                <VictoryAxis tickCount={5} />
                <VictoryAxis dependentAxis domain={[0, Math.round(yMaxValue*1.2)]}/>
            </VictoryChart>
        );
    }
}

export default AnalyticsChartComponent;