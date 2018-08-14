import React from 'react';
import PropTypes from 'prop-types';
import { NavigationActions, withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { View, ScrollView, Text, ActivityIndicator, Button, Image } from 'react-native';
import VideoPlayer from 'react-native-video-controls';

import APIMediaFile from '../../API/ApiMediaFiles';
import ButtonComponent from '../../Component/Button/ButtonComponent.mob';
import { logo } from '../../Helpers';
import Colors from '../../Styles/Colors';
import Style from './Style/VideoThumbnailScreenStyle';

class VideoThumbnailScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const saveHandler =
            navigation.state.params && navigation.state.params.saveHandler
                ? navigation.state.params.saveHandler
                : () => {};

        return {
            headerLeft: (
                <Button
                    title="Back"
                    onPress={() => {
                        navigation.goBack(null);
                    }}
                />
            ),
            headerRight: <Button title="Select" onPress={saveHandler} />,
            title: <Image source={logo} style={Style.header_logo} />
        };
    };

    static propTypes = {
        navigation: PropTypes.shape({
            state: PropTypes.shape({
                params: PropTypes.shape({
                    media: PropTypes.shape({
                        id: PropTypes.number.isRequired,
                        name: PropTypes.string.isRequired
                    }).isRequired
                }).isRequired
            }).isRequired
        })
    };

    constructor(props) {
        super(props);

        const { media } = this.props.navigation.state.params;

        this.videoPlayer = null;
        this.state = {
            loading: true,
            source: null,
            saving: false,
            media: media,
            error: false,
            startTime: 0,
            endTime: 0,
            currentTime: 0,
            currentTimeMs: 0,
            fps: 23.98
        };

        this.handleVideoLoad = this.handleVideoLoad.bind(this);
        this.handleVideoProgress = this.handleVideoProgress.bind(this);
        this.handleVideoEnd = this.handleVideoEnd.bind(this);
    }

    componentWillMount() {
        this.props.navigation.setParams({
            saveHandler: this.handleSave.bind(this)
        });
    }

    componentDidMount() {
        APIMediaFile.getFileUrl(this.state.media.id)
            .then(success => {
                if (success.status === 200) {
                    this.setState({ source: success.data });
                }
            })
            .catch(error => {
                alert(error && error.message);
            });
    }

    handleVideoLoad(meta) {
        this.setState({
            loading: false,
            startTime: 0,
            endTime: meta.duration
        });
    }

    handleVideoProgress(progress) {
        const currentTime = progress.currentTime;
        const currentTimeMs = progress.currentTime * 1000;

        if (currentTime >= this.state.endTime) {
            this.videoPlayer.player.ref.seek(this.state.endTime);
        }
        if (currentTime <= this.state.startTime) {
            this.videoPlayer.player.ref.seek(this.state.startTime);
        }
        this.setState({
            currentTime: currentTime,
            currentTimeMs: parseInt(currentTimeMs)
        });
    }

    handleVideoEnd() {
        this.videoPlayer.player.ref.seek(this.state.startTime);
    }

    handleFramesNav(step) {
        const frameTime = 1 / this.state.fps;
        const dist = frameTime * step;

        this.videoPlayer.player.ref.seek(this.state.currentTime + dist);
    }

    handleSave() {
        this.setState({
            saving: true
        });

        const data = {
            time_ms: this.state.currentTimeMs
        };

        APIMediaFile.createVideoThumbnail(this.state.media.id, data)
            .then(success => {
                this.setState({
                    saving: false
                });
                this.props.navigation.navigate('MediaScreen');
            })
            .catch(error => {
                this.setState({
                    saving: false,
                    error:
                        error.response.status < 500
                            ? error.response.data.message
                            : 'Error while saving. Please try again or contact tech support'
                });
            });
    }

    render() {
        if (!this.state.source) {
            return (
                <View style={Style.container}>
                    <ActivityIndicator size="large" color={Colors.green} style={Style.loader} />
                </View>
            );
        }

        return (
            <View style={Style.container}>
                <View style={Style.videoPlayer}>
                    <VideoPlayer
                        paused={true}
                        source={{ uri: this.state.source }}
                        style={Style.videoPlayer}
                        resizeMode="contain"
                        seekColor={Colors.LinkColor}
                        controlTimeout={5000000} // ms
                        disableFullscreen={true}
                        disablePlayPause={true}
                        disableVolume={true}
                        disableBack={true}
                        onLoad={this.handleVideoLoad}
                        onProgress={this.handleVideoProgress}
                        onEnd={this.handleVideoEnd}
                        ref={ref => {
                            this.videoPlayer = ref;
                        }}
                    />
                    {this.state.error && <Text style={Style.error}>{this.state.error}</Text>}
                </View>
                <View style={Style.framesContainer}>
                    <View style={Style.frameContainer}>
                        <ScrollView>
                            <ButtonComponent
                                onPress={() => {
                                    this.handleFramesNav(-1);
                                }}
                                children="<"
                            />
                            <ButtonComponent
                                onPress={() => {
                                    this.handleFramesNav(-5);
                                }}
                                children="<<"
                            />
                            <ButtonComponent
                                onPress={() => {
                                    this.handleFramesNav(-10);
                                }}
                                children="<<<"
                            />
                        </ScrollView>
                    </View>
                    <View style={Style.frameContainer}>
                        <View style={Style.framesTextContainer}>
                            <Text fontWeight="bold">JUMP TO</Text>
                        </View>
                    </View>
                    <View style={Style.frameContainer}>
                        <ScrollView>
                            <ButtonComponent
                                onPress={() => {
                                    this.handleFramesNav(1);
                                }}
                                children=">"
                            />
                            <ButtonComponent
                                onPress={() => {
                                    this.handleFramesNav(5);
                                }}
                                children=">>"
                            />
                            <ButtonComponent
                                onPress={() => {
                                    this.handleFramesNav(10);
                                }}
                                children=">>>"
                            />
                        </ScrollView>
                    </View>
                </View>
            </View>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    redirect: scene => dispatch(NavigationActions.navigate({ routeName: scene }))
});

export default connect(null, mapDispatchToProps)(VideoThumbnailScreen);
