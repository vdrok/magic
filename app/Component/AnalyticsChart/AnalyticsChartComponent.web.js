import React from 'react';
import PropTypes from 'prop-types';
import { VictoryChart, VictoryTheme, VictoryLine , VictoryAxis, VictoryVoronoiContainer, VictoryTooltip, VictoryBar} from 'victory'
import Colors  from '../../Styles/Colors'

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
        const yMaxValue = Math.max.apply(Math, this.state.data.map(function(o) { return o.y; }))

        return (
            <VictoryChart       
                width={900}
                height={270}     
                theme={VictoryTheme.material}
                domainPadding={{x:10}}
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