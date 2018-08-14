import React from 'react';
import PropTypes from 'prop-types';
import {
    Dimensions,
    Text,
    View,
    ScrollView,
    Image,
    PanResponder,
    PixelRatio,
    TouchableWithoutFeedback,
    ActivityIndicator
} from 'react-native';
import MdIcon from 'react-native-vector-icons/MaterialIcons';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import { Surface } from 'gl-react-native';
import rectCrop from 'rect-crop';
import rectClamp from 'rect-clamp';

import { logo } from '../../../Helpers';
import Colors from '../../../Styles/Colors';
import Style from './Style/ImageCropStyle';

const { GLImage } = require('./GLImage').default;
const { width: screenWidth } = Dimensions.get('window');

const imageDimensionsAfterZoom = (viewport, dimensions, zoom) => {
    const ImageRatio = dimensions.width / dimensions.height;
    const ViewportRatio = viewport.width / viewport.height;

    if (ImageRatio > ViewportRatio) {
        return {
            height: Math.floor(viewport.height / zoom),
            width: Math.floor(viewport.height * ImageRatio / zoom)
        };
    } else {
        return {
            height: Math.floor(viewport.width / ImageRatio / zoom),
            width: Math.floor(viewport.width / zoom)
        };
    }
};

const getRelativeWidth = (ratio, height) => {
    return height * ratio;
};

const getRelativeHeight = (ratio, width) => {
    return width / ratio;
};

class ImageCropComponent extends React.Component {
    static propTypes = {
        image: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            image: this.props.image,
            template: 'original',
            imageWidth: 300,
            imageHeight: 300,
            imageDimHeight: 0,
            imageDimWidth: 0,
            imageRatio: 1.0,
            cropWidth: 300,
            cropHeight: 300,
            cropMaxWidth: 0,
            cropMaxHeight: 0,
            pixelRatio: PixelRatio.get(),
            centerX: 0.5,
            centerY: 0.5,
            zoom: 1
        };
    }

    componentWillMount() {
        Image.getSize(this.state.image, (width, height) => {
            const aspectRatio = width / height;
            const cropWidth = screenWidth;

            // update state
            this.setState({
                loading: false,
                imageWidth: width,
                imageHeight: height,
                imageRatio: aspectRatio,
                cropWidth: cropWidth,
                cropHeight: getRelativeHeight(aspectRatio, cropWidth)
            });
        });

        // get dimensions after crop
        this._dimensionAfterZoom = imageDimensionsAfterZoom(
            { height: this.state.cropHeight, width: this.state.cropWidth },
            { height: this.state.imageHeight, width: this.state.imageWidth },
            this.state.zoom
        );

        this.setState({
            imageDimHeight: this._dimensionAfterZoom.height,
            imageDimWidth: this._dimensionAfterZoom.width
        });

        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderTerminationRequest: (evt, gestureState) => false,
            onShouldBlockNativeResponder: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                // move variables
                this.offsetX = this.state.centerX;
                this.offsetY = this.state.centerY;

                // zoom variables
                this.zoomLastDistance = 0;
                this.zoomCurrentDistance = 0;
            },

            onPanResponderMove: (evt, gestureState) => {
                // we are moving the image
                if (evt.nativeEvent.changedTouches.length <= 1) {
                    const trackX = gestureState.dx / this.state.cropWidth * this.state.zoom;
                    const trackY = gestureState.dy / this.state.cropHeight * this.state.zoom;
                    let newPosX = Number(this.offsetX) - Number(trackX);
                    let newPosY = Number(this.offsetY) - Number(trackY);
                    if (newPosX > 1) newPosX = Number(1);
                    if (newPosY > 1) newPosY = Number(1);
                    if (newPosX < 0) newPosX = Number(0);
                    if (newPosY < 0) newPosY = Number(0);

                    this.setState({
                        centerX: newPosX,
                        centerY: newPosY
                    });
                } else {
                    // we are zooming the image
                    if (this.zoomLastDistance == 0) {
                        let a =
                            evt.nativeEvent.changedTouches[0].locationX - evt.nativeEvent.changedTouches[1].locationX;
                        let b =
                            evt.nativeEvent.changedTouches[0].locationY - evt.nativeEvent.changedTouches[1].locationY;
                        let c = Math.sqrt(a * a + b * b);
                        this.zoomLastDistance = c.toFixed(1);
                    } else {
                        let a =
                            evt.nativeEvent.changedTouches[0].locationX - evt.nativeEvent.changedTouches[1].locationX;
                        let b =
                            evt.nativeEvent.changedTouches[0].locationY - evt.nativeEvent.changedTouches[1].locationY;
                        let c = Math.sqrt(a * a + b * b);
                        this.zoomCurrentDistance = c.toFixed(1);

                        const distance = (this.zoomCurrentDistance - this.zoomLastDistance) / 400;
                        let zoom = this.state.zoom - distance;

                        if (zoom < 0) zoom = 0.0000001;
                        if (zoom > 1) zoom = 1;
                        this.setState({
                            zoom: zoom
                        });
                        this.zoomLastDistance = this.zoomCurrentDistance;
                    }
                }
            }
        });
    }

    handleTemplateChange(template) {
        let cropWidth = screenWidth;
        let cropHeight;
        const aspectRatios = {
            original: this.state.imageRatio,
            landscape: 1.7777,
            levuro: 1.7772,
            'facebook-landscape': 1.7777,
            'facebook-square': 1.0,
            'facebook-story': 0.5625,
            'facebook-vertical': 0.6666,
            'instagram-square': 1.0,
            'instagram-story': 0.5625,
            'instagram-vertical': 0.8,
            'twitter-post': 2.0,
            'twitter-square': 1.0
        };

        template = template || 'original';

        const relativeHeight = getRelativeHeight(aspectRatios[template], cropWidth);

        // Crop height it's bigger than the max height
        if (relativeHeight > this.state.cropMaxHeight) {
            cropHeight = this.state.cropMaxHeight;
            cropWidth = getRelativeWidth(aspectRatios[template], cropHeight);
        } else {
            cropHeight = getRelativeHeight(aspectRatios[template], cropWidth);
        }

        this.setState({
            template: template,
            cropWidth: cropWidth,
            cropHeight: cropHeight
        });
    }

    getCropData() {
        const { cropWidth, cropHeight, imageHeight, imageWidth, zoom, centerX, centerY } = this.state;
        let rect = rectCrop(zoom, [centerX, centerY])(
            { width: cropWidth, height: cropHeight },
            { width: imageWidth, height: imageHeight }
        );
        rect = rectClamp(rect, [0, 0, imageWidth, imageHeight]);

        return {
            x: Math.round(rect[0]),
            y: Math.round(rect[1]),
            width: Math.round(rect[2]),
            height: Math.round(rect[3])
        };
    }

    render() {
        if (this.state.loading) {
            return <ActivityIndicator size="large" color={Colors.green} style={Style.loader} />;
        }

        return (
            <View style={Style.container}>
                <View
                    style={Style.imageContainer}
                    onLayout={event => {
                        const { width, height } = event.nativeEvent.layout;
                        this.setState({
                            cropMaxWidth: width,
                            cropMaxHeight: height
                        });
                    }}>
                    <View {...this._panResponder.panHandlers}>
                        <Surface
                            width={this.state.cropWidth}
                            height={this.state.cropHeight}
                            pixelRatio={this.state.pixelRatio}
                            backgroundColor="transparent">
                            <GLImage
                                source={{ uri: this.state.image }}
                                imageSize={{ height: this.state.imageHeight, width: this.state.imageWidth }}
                                resizeMode="cover"
                                zoom={this.state.zoom}
                                center={[this.state.centerX, this.state.centerY]}
                            />
                        </Surface>
                    </View>
                </View>
                <View style={Style.templatesContainer}>
                    <ScrollView horizontal={true}>
                        <TouchableWithoutFeedback onPress={() => this.handleTemplateChange('original')}>
                            <View style={Style.templateContainer}>
                                <MdIcon
                                    name="camera"
                                    size={35}
                                    style={[Style.template, this.state.template === 'original' && Style.templateActive]}
                                />
                                <Text
                                    style={[
                                        Style.template,
                                        this.state.template === 'original' && Style.templateActive
                                    ]}>
                                    {'Original'}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.handleTemplateChange('landscape')}>
                            <View style={Style.templateContainer}>
                                <MdIcon
                                    name="crop-landscape"
                                    size={35}
                                    style={[
                                        Style.template,
                                        this.state.template === 'landscape' && Style.templateActive
                                    ]}
                                />
                                <Text
                                    style={[
                                        Style.template,
                                        this.state.template === 'landscape' && Style.templateActive
                                    ]}>
                                    {'Landscape\n(16:9)'}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.handleTemplateChange('levuro')}>
                            <View style={Style.templateContainer}>
                                <Image source={logo} style={Style.templateLogoIcon} />
                                <Text
                                    style={[Style.template, this.state.template === 'levuro' && Style.templateActive]}>
                                    {'Levuro OTT'}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.handleTemplateChange('facebook-landscape')}>
                            <View style={Style.templateContainer}>
                                <FaIcon
                                    name="facebook-official"
                                    size={35}
                                    style={[
                                        Style.template,
                                        this.state.template === 'facebook-landscape' && Style.templateActive
                                    ]}
                                />
                                <Text
                                    style={[
                                        Style.template,
                                        this.state.template === 'facebook-landscape' && Style.templateActive
                                    ]}>
                                    {'Full landscape\n(16:9)'}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.handleTemplateChange('facebook-square')}>
                            <View style={Style.templateContainer}>
                                <FaIcon
                                    name="facebook-official"
                                    size={35}
                                    style={[
                                        Style.template,
                                        this.state.template === 'facebook-square' && Style.templateActive
                                    ]}
                                />
                                <Text
                                    style={[
                                        Style.template,
                                        this.state.template === 'facebook-square' && Style.templateActive
                                    ]}>
                                    {'Square\n(1:1)'}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.handleTemplateChange('facebook-story')}>
                            <View style={Style.templateContainer}>
                                <FaIcon
                                    name="facebook-official"
                                    size={35}
                                    style={[
                                        Style.template,
                                        this.state.template === 'facebook-story' && Style.templateActive
                                    ]}
                                />
                                <Text
                                    style={[
                                        Style.template,
                                        this.state.template === 'facebook-story' && Style.templateActive
                                    ]}>
                                    {'Story\n(9:16)'}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.handleTemplateChange('facebook-vertical')}>
                            <View style={Style.templateContainer}>
                                <FaIcon
                                    name="facebook-official"
                                    size={35}
                                    style={[
                                        Style.template,
                                        this.state.template === 'facebook-vertical' && Style.templateActive
                                    ]}
                                />
                                <Text
                                    style={[
                                        Style.template,
                                        this.state.template === 'facebook-vertical' && Style.templateActive
                                    ]}>
                                    {'Vertical\n(2:3)'}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.handleTemplateChange('instagram-square')}>
                            <View style={Style.templateContainer}>
                                <FaIcon
                                    name="instagram"
                                    size={35}
                                    style={[
                                        Style.template,
                                        this.state.template === 'instagram-square' && Style.templateActive
                                    ]}
                                />
                                <Text
                                    style={[
                                        Style.template,
                                        this.state.template === 'instagram-square' && Style.templateActive
                                    ]}>
                                    {'Square\n(1:1)'}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.handleTemplateChange('instagram-story')}>
                            <View style={Style.templateContainer}>
                                <FaIcon
                                    name="instagram"
                                    size={35}
                                    style={[
                                        Style.template,
                                        this.state.template === 'instagram-story' && Style.templateActive
                                    ]}
                                />
                                <Text
                                    style={[
                                        Style.template,
                                        this.state.template === 'instagram-story' && Style.templateActive
                                    ]}>
                                    {'Story\n(9:16)'}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.handleTemplateChange('instagram-vertical')}>
                            <View style={Style.templateContainer}>
                                <FaIcon
                                    name="instagram"
                                    size={35}
                                    style={[
                                        Style.template,
                                        this.state.template === 'instagram-vertical' && Style.templateActive
                                    ]}
                                />
                                <Text
                                    style={[
                                        Style.template,
                                        this.state.template === 'instagram-vertical' && Style.templateActive
                                    ]}>
                                    {'Vertical\n(4:5)'}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.handleTemplateChange('twitter-post')}>
                            <View style={Style.templateContainer}>
                                <FaIcon
                                    name="twitter"
                                    size={35}
                                    style={[
                                        Style.template,
                                        this.state.template === 'twitter-post' && Style.templateActive
                                    ]}
                                />
                                <Text
                                    style={[
                                        Style.template,
                                        this.state.template === 'twitter-post' && Style.templateActive
                                    ]}>
                                    {'Twitter post\n(2:1)'}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.handleTemplateChange('twitter-square')}>
                            <View style={Style.templateContainer}>
                                <FaIcon
                                    name="twitter"
                                    size={35}
                                    style={[
                                        Style.template,
                                        this.state.template === 'twitter-square' && Style.templateActive
                                    ]}
                                />
                                <Text
                                    style={[
                                        Style.template,
                                        this.state.template === 'twitter-square' && Style.templateActive
                                    ]}>
                                    {'Square\n(1:1)'}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

export default ImageCropComponent;
