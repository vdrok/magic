import React from 'react';
import PropTypes from 'prop-types';
import { PanResponder, View, Dimensions, Text, ScrollView } from 'react-native'
import style from './Style/VideoRangeTrimmer'
import { msToHuman } from '../../../Helpers';
import { times } from 'lodash'
import Svg,{
    Line,
    Text as SvgText,
} from 'react-native-svg';

const MOVE_TYPES  = {
    LEFT_RANGE: 1,
    RIGHT_RANGE: 2,
    MOVE: 3,
    ZOOM: 4,
    SCROLL: 5,
    SEEK: 6,
}

const TOUCH_MARGIN = 35;
const { width } = Dimensions.get('window');
const BAR_WIDTH = width - 10;//padding
//1 pixel represents x ms
let scale = 0;
let initialZoomDistance = 0;
let widthBeforeScaling = 0;
let scrollViewOffset = 0;
/**
 * options pushable with long video makes it slow, so instead of miliseconds we cut in decyseconds HH:mm:ss:SS
 */
class VideoRangeTrimmer extends React.Component {

    static propTypes = {
        length: PropTypes.number.isRequired, //in ms
        currentTime: PropTypes.number.isRequired, //in ms
        onRangeChange: PropTypes.func.isRequired,
        onSeek: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        //1x represnts
        scale = props.length / BAR_WIDTH;
        this.state = {
            rangeStyle: {
                left: 0,
                right: 0,
            },
            currentStyle: props.currentTime / scale,
            moveType: false,
            range: {
                begin: 0,
                end: props.length,
                current: props.currentTime,
            },
            // once we zoom the width increases
            sliderWidth: BAR_WIDTH,
        };


    }

    componentWillReceiveProps ({currentTime}) {

        if(currentTime !== this.state.range.current){
            this.setState({
                currentStyle: currentTime / scale,
                range: {
                    ...this.state.range,
                    current: currentTime
                },
            })
        }

    }

    componentWillMount() {
        const that = this;
        this._panResponder = PanResponder.create({
           // onStartShouldSetPanResponder: (evt, gestureState) => true,
           // onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onStartShouldSetPanResponder: (a,b) => true,
            onPanResponderGrant: (e, gestureState) => {

                let touches = e.nativeEvent.touches;
                if (touches.length === 2) {
                    initialZoomDistance = that.calcDistance(touches[0].pageX, touches[0].pageY,
                        touches[1].pageX, touches[1].pageY);
                    widthBeforeScaling = this.state.sliderWidth;
                    return that.setState({
                        moveType: MOVE_TYPES.ZOOM,
                    })
                }
                const visibleBarWidthStart = this.state.sliderWidth - scrollViewOffset;
                const left = this.state.rangeStyle.left - scrollViewOffset;
                if(left - TOUCH_MARGIN < gestureState.x0
                    && left + TOUCH_MARGIN > gestureState.x0){
                    return that.setState({
                        moveType: MOVE_TYPES.LEFT_RANGE,
                        rangeStyle: {
                            ...this.state.rangeStyle,
                            borderLeftColor: 'red',
                        }
                    })
                }
                const right = visibleBarWidthStart - this.state.rangeStyle.right;
                if(right - TOUCH_MARGIN < gestureState.x0
                    && right + TOUCH_MARGIN > gestureState.x0){
                    return that.setState({
                        moveType: MOVE_TYPES.RIGHT_RANGE,
                        rangeStyle: {
                            ...this.state.rangeStyle,
                            borderRightColor: 'red',
                        }
                    })
                }
            },

            onPanResponderMove:(e, gestureState) => {

                if (this.state.moveType === MOVE_TYPES.ZOOM && e.nativeEvent.touches.length === 2) {
                    const touches = e.nativeEvent.touches;
                    const distance = that.calcDistance(touches[0].pageX, touches[0].pageY,
                        touches[1].pageX, touches[1].pageY);
                    const diff = (distance - initialZoomDistance) * (widthBeforeScaling / BAR_WIDTH) ;//increase the  zoom impact
                    const newWidth = widthBeforeScaling + diff < BAR_WIDTH ? BAR_WIDTH:
                        widthBeforeScaling + diff;
                    scale = this.props.length / newWidth;

                    const right = (this.props.length - this.state.range.end) / scale;
                    const left = this.state.range.begin / scale;

                    return that.setState({
                        sliderWidth: newWidth,
                        rangeStyle: {
                            ...this.state.rangeStyle,
                            right: right,
                            left: left
                        },
                        currentStyle: this.state.range.current / scale,
                    })

                }


                if(this.state.moveType === MOVE_TYPES.LEFT_RANGE){
                    const left = gestureState.moveX < 0 ? 0 : gestureState.moveX;
                    const visibleBarWidthStart = this.state.sliderWidth - scrollViewOffset;
                    const maxLeft = visibleBarWidthStart - this.state.rangeStyle.right;
                    if(left + TOUCH_MARGIN > maxLeft) return;

                    return that.setState({
                        rangeStyle: {
                            ...this.state.rangeStyle,
                            left: left + scrollViewOffset,
                        },
                        range: {
                            ...this.state.range,
                            begin: (left + scrollViewOffset) * scale,
                        }
                    })
                }

                if(this.state.moveType === MOVE_TYPES.RIGHT_RANGE){
                    const visibleBarWidthStart = this.state.sliderWidth - scrollViewOffset;
                    const maxRight =  this.state.rangeStyle.left - scrollViewOffset;
                    const right = visibleBarWidthStart - gestureState.moveX;
                    if(gestureState.moveX - TOUCH_MARGIN < maxRight) return;

                    return that.setState({
                        rangeStyle: {
                            ...this.state.rangeStyle,
                            right: right,
                        },
                        range: {
                            ...this.state.range,
                            end: (this.state.sliderWidth - right) * scale,
                        }
                    });
                }

            },

            onPanResponderRelease: (e, gestureState) => {
                if(this.state.moveType === MOVE_TYPES.LEFT_RANGE ||
                 this.state.moveType === MOVE_TYPES.RIGHT_RANGE){
                    this.props.onRangeChange(this.state.range.begin,this.state.range.end);
                }



                that.setState({
                    moveType: false,
                    rangeStyle:{
                        ...this.state.rangeStyle,
                        borderLeftColor: 'yellow',
                        borderRightColor: 'yellow',
                        borderColor: 'yellow'
                    }

                });

                const visibleBarWidthStart = this.state.sliderWidth - scrollViewOffset;
                const right = visibleBarWidthStart - this.state.rangeStyle.right;
                const left = this.state.rangeStyle.left - scrollViewOffset;
                if(left < gestureState.x0 && gestureState.x0 < right){
                    const left = gestureState.x0;
                    that.props.onSeek((left + scrollViewOffset) * scale);
                }

            }
        });
    }

    handleScroll(e){
        scrollViewOffset = e.nativeEvent.contentOffset.x;
    }

    render() {

        return <ScrollView ref={ref => this.scrollView = ref} horizontal={true} scrollEnabled={this.state.moveType === false} onScrollEndDrag={this.handleScroll.bind(this)}>
            <View style={style.wrapper} {...this._panResponder.panHandlers}>
            <Text style={[style.rangeText,{ left: this.state.rangeStyle.left }]}>{msToHuman(this.state.range.begin)}</Text>
                <View  style={style.wrapperSeekBar}>
                    <View style={[style.marker, {left: this.state.rangeStyle.left, backgroundColor: this.state.rangeStyle.borderLeftColor}]} />
                    <View style={[style.markerCurrentTime, { left: this.state.currentStyle }]} />
                    <View style={[style.marker, {right: this.state.rangeStyle.right, backgroundColor: this.state.rangeStyle.borderRightColor}]} />
                <View style={[style.range, this.state.rangeStyle]} />
            </View>
            <Text style={[style.rangeText,style.rangeTextRight, { right: this.state.rangeStyle.right }]}>{msToHuman(this.state.range.end)}</Text>
                {this.renderScale()}
        </View>
        </ScrollView>
    }

    renderScale(){
        const spaceBetweenMarks =  BAR_WIDTH / 6;
        const density = (this.state.sliderWidth) / spaceBetweenMarks; // screen width - margin

        return (
            <Svg
                style={style.scaleSVG}
                height="20"
                width={this.state.sliderWidth}
            >
                <Line
                    x1="0"
                    y1="20"
                    x2={this.state.sliderWidth}
                    y2="20"
                    stroke="white"
                    strokeWidth="2"
                />

                {times(density + 1 , (i) =>  <Line key={i}
                        x1={ i * spaceBetweenMarks}
                        y1="20"
                        x2={i * spaceBetweenMarks}
                        y2="15"
                        stroke="white"
                        strokeWidth="2"
                    />
                )}

                {times(density +1, (i) =>  {
                    if(i % 3 !== 0) return null;


                    let x = 0; //first
                    if(i > 0 ){
                        x = i * spaceBetweenMarks - (spaceBetweenMarks /2)
                    }
                    if( i === density){
                        x = (i-1) * spaceBetweenMarks;
                    }
                    return <SvgText key={i}
                                    fontSize="12"
                                    fill="white"
                                    x={x}
                                    y="10"
                    >{msToHuman(i * spaceBetweenMarks *scale)}</SvgText>

                })}

            </Svg>
        );
    }

    calcDistance(x1, y1, x2, y2) {
        let dx = Math.abs(x1 - x2)
        let dy = Math.abs(y1 - y2)
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }
}

export default VideoRangeTrimmer;
