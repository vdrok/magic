import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';

import { dsToHuman } from '../../../Helpers';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import './Style/VideoTrimmerStyle.scss'
import OpenVTT from '../../../Helpers/OpenVTT';

const Handle = Slider.Handle;

/**
 * options pushable with long video makes it slow, so instead of miliseconds we cut in decyseconds HH:mm:ss:SS
 */
class VideoRangeTrimmer extends React.Component {
    static propTypes = {
        length: PropTypes.number.isRequired, //in ms
        currentTime: PropTypes.number.isRequired, //in ms
        startTime: PropTypes.number.isRequired, // in s
        endTime: PropTypes.number.isRequired, // in s
        onRangeChange: PropTypes.func.isRequired,
        vttURL: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            begin: 0,
            end: parseInt(props.length / 100),
            current: parseInt(props.currentTime / 100),
            // the more more you zoom the more these values are changes
            scaleMin: 0,  //right side of the scale for zooming
            scaleMax: parseInt(props.length / 100),  //left side of the scale for zooming
        };

        this.draggingSeek = false;
        this.previewThumbnails = new OpenVTT();
        this._refreshZoom = this._refreshZoom.bind(this);


    }

    componentWillReceiveProps ({currentTime, length, vttURL, startTime, endTime}) {


        if(this.state.scaleMax === 0 && length > 0){
            this.setState({
                scaleMax: parseInt(length / 100),
                end: parseInt(length / 100)
            })
        }

        if(vttURL && !this.props.vttURL){
            this.previewThumbnails.load(vttURL);
        }

        // Don't update current time status wile dragging the seek
        if(this.draggingSeek) return;

        this.setState({
            current: parseInt(currentTime / 100)
        })

        if(startTime !== this.state.begin){
            this.setState({
                'begin': startTime * 10,
            });
            this._refreshZoom(startTime * 10, this.state.end);

        }

        if(endTime !== this.state.end){
            this.setState({
                'end': endTime * 10,
            });
            this._refreshZoom(this.state.start, endTime * 10);
        }
    }



    render() {
        if(this.props.length === 0) return null;
        const {scaleMin, scaleMax, current, begin, end} = this.state;
        const marks = {
            [begin]: dsToHuman(begin),
            [end]: dsToHuman(end),
        };
        const that = this;
        const handle = (props) => {
            const { value, dragging, index, ...restProps } = props;


            if(index === 1) {
                that.draggingSeek = dragging;
                let thumbnail = false;
                if(dragging){
                    thumbnail = that.previewThumbnails.getImage(value/10);
                }
                return <Tooltip
                    prefixCls="rc-slider-tooltip"
                    overlay={dsToHuman(value)}
                    visible={true}
                    placement="top"
                    key={index}
                >
                        <Handle value={value} {...restProps} >
                            {thumbnail && <img className="preview-thumbnail" src={thumbnail} />}
                        </Handle>
                </Tooltip>
            };
            return <Handle key={index} value={value} {...restProps} />;
        };

        return <div className="video-trimmer">
            <Slider.Range
                min={scaleMin}
                max={scaleMax}
                pushable
                count={3}
                marks={marks}
                handle={handle}
                value={[begin,current,end]}
               // onChange={this.handleTrimSliderChange.bind(this)}
                handleStyle={[
                    { borderColor: 'yellow', backgroundColor: '#00000000',borderRadius: 0, width: 10, height: 16,  borderLeftWidth: 5, borderTopWidth:2, borderBottomWidth:2, borderRightWidth: 0, marginLeft: -3, marginTop: -7 }
                    , { backgroundColor: 'black', borderRadius: 0, width: 4, border: 0, marginLeft: -2, top: -28, height: 30 },
                    { borderColor: 'yellow', backgroundColor: '#00000000',borderRadius: 1, width: 10, height: 16, borderRightWidth: 5, borderTopWidth:2, borderBottomWidth:2, borderLeftWidth: 0, marginTop: -7 }
                    ]}
                trackStyle={[
                    { backgroundColor: '#a2a2a2', height: 16, borderRadius: 0, bottom: 0, borderRightWidth: 0, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'yellow', borderStyle: 'solid'  }  ,
                    { backgroundColor: '#a2a2a2', height: 16, borderRadius: 0, bottom: 0, borderLeftWidth: 0, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'yellow', borderStyle: 'solid'  }]}
                railStyle={{ height: 15, borderRadius: 2, marginTop: -6 }}
                onAfterChange={this.handleRangeChange.bind(this)}
                onChange={this.handleTrimSliderChange.bind(this)}
            />
        </div>;
    }

    handleRangeChange(values){
        this._refreshZoom(values[0],values[2])

        this.setState({
            begin: values[0],
           // current: values[1],
            end: values[2]
        });

        // in ms
        this.props.onRangeChange(values[0] * 100,values[1]*100, values[2] * 100);

    }


    handleTrimSliderChange(values) {
        this.setState({
            begin: values[0],
            current: values[1],
            end: values[2]
        });
    }

    _refreshZoom(start, end){
        if(!start || !end) return;

        const distance =  end - start;
        const max = end + distance ;
        const min = start - distance ;
        this.setState({
            scaleMax: parseInt(max > (this.props.length / 100) ? parseInt(this.props.length / 100) : max),
            scaleMin: parseInt(min < 0 ? 0 : min)
        });
    }
}

export default VideoRangeTrimmer;
