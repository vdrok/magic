import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, ActivityIndicator, TouchableWithoutFeedback, Button, Image } from 'react-native';
import { Form, Item, Input } from 'native-base';
import Modal from "react-native-modal";
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome';

import APIMediaFile from '../../API/ApiMediaFiles';
import {logo} from '../../Helpers';
import Colors from '../../Styles/Colors';
import Style from './Style/VideoEditorStyle';
import VideoRangeTrimmer from "../../Component/VideoEditor/VideoRangeTrimmer/VideoRangeTrimmer.mob";
import styles from "../Storyline/Style/StorylineScreenStyle";
import ButtonComponent from "../../Component/Button/ButtonComponent.mob";
import {NavigationActions, withNavigation} from "react-navigation";
import {connect} from "react-redux";

class VideoEditor extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const saveHandler = navigation.state.params && navigation.state.params.saveHandler ?
            navigation.state.params.saveHandler : () => {};

        return {
            headerLeft: <Button
                title="Back"
                onPress={() => { navigation.goBack(null) }}
            />,
            headerRight: <Button
                title="Save As"
                onPress={saveHandler}
            />,
            title: <Image source={ logo } style={styles.header_logo} />,

        };
    };

    static propTypes = {

        navigation: PropTypes.shape({
            state: PropTypes.shape({
                params: PropTypes.shape({
                    media: PropTypes.shape({
                        id: PropTypes.number.isRequired,
                        name: PropTypes.string.isRequired,
                    }).isRequired,
                }).isRequired
            }).isRequired
        }),

    };

    constructor(props) {
        super(props);
        const { media } = this.props.navigation.state.params;

        this.videoPlayer = null;
        this.state = {
            saving: false,
            name: media.name,
            showModal: false,
            loading: true,
            source: null,
            paused: false,
            ended: false,
            currentTime: 0,
            duration: 0,
            startTime: 0,
            endTime: 0,
        };

        this.handleVideoLoad = this.handleVideoLoad.bind(this);
        this.handleVideoProgress = this.handleVideoProgress.bind(this);
        this.handleMainVideoButtonTouch = this.handleMainVideoButtonTouch.bind(this);
        this.handleVideoEnd = this.handleVideoEnd.bind(this);
        this.handleRangeChange = this.handleRangeChange.bind(this);
        this.handleSeek = this.handleSeek.bind(this);
    }

    componentWillMount() {
        this.props.navigation.setParams({
            saveHandler: this.handleSave.bind(this)
        });
    }


    componentDidMount() {
        APIMediaFile.getFileUrl(this.props.navigation.state.params.media.id)
            .then(r => {
                if (r.status === 200) {
                    this.setState({ source: r.data });
                }
            })
            .catch(e => {
                alert(e && e.message);
            });
    }

    render() {
        const {  source, paused } = this.state;

        if (!source) {
            return (
                <View style={Style.container}>
                    <ActivityIndicator size="large" color={Colors.green} style={Style.loader} />
                </View>
            );
        }

        return <View style={Style.container}>
                    <TouchableWithoutFeedback onPress={this.handleMainVideoButtonTouch} style={Style.videoPlayer}>
                        <View style={Style.videoPlayer}>

                        <Video
                        paused={paused}
                        source={{ uri: source }}
                        style={Style.videoPlayer}
                        resizeMode="contain"
                        onLoad={this.handleVideoLoad}
                        onProgress={this.handleVideoProgress}
                        onEnd={this.handleVideoEnd}
                        ref={ref => {
                            this.videoPlayer = ref;
                        }}
                        />
                            {paused && <Icon name='pause' style={Style.videoIcon} size={72} color='white'/>}
                        </View>
                    </TouchableWithoutFeedback>

                    <View style={Style.trimContainer}>
                        {this.renderRangeTrimmer()}
                    </View>
                    {this.renderModal()}
                </View>;
    }

    renderModal(){

        if(!this.state.showModal) return null;

        return <Modal
                onSwipe={() => this.setState({showModal: false})}
                onBackdropPress={() => this.setState({showModal: false})}
                onBackButtonPress={() => this.setState({showModal: false})}
                isVisible={this.state.showModal}
                onRequestClose={() => this.setState({showModal: false})}
        >
            <View style={{ flex: 0, backgroundColor: '#fff' }}>
                <Text style={Style.modalHeader}>How to name the new video?</Text>
                <Form>
                    <Item error={this.state.name.length === 0}>
                        <Input placeholder="video name" onChangeText={(text) => this.setState({ name: text})} />
                    </Item>
                    {this.state.error && <Text style={Style.error}>{this.state.error}</Text>}
                </Form>

                <ButtonComponent busy={this.state.saving} onPress={() => this.submit()} style={{zIndex: 20}}>
                    <Text>Save as new</Text>
                </ButtonComponent>
            </View>
        </Modal>
    }

    renderRangeTrimmer(){
        if(this.state.duration === 0) return null;

        return <VideoRangeTrimmer length={this.state.duration} currentTime={this.state.currentTime}
                                  onRangeChange={this.handleRangeChange}
                                  onSeek={this.handleSeek}/>
    }

    handleSeek(time){
        this.videoPlayer.seek(time / 1000);
    }

    handleRangeChange(left, right){
        if(this.state.currentTime < left ||
            this.state.currentTime  > right){
            this.videoPlayer.seek(left / 1000);
            return this.setState({
                startTime: left,
                endTime: right,
                currentTime: left,
            })
        }

        return this.setState({
            startTime: left,
            endTime: right,
        })

    }

    handleSave() {
        if (this.state.endTime - this.state.startTime > 1000 * 60 * 10) {
            alert('The new video cannot be longer than 10 minutes');
            return;
        }

        this.setState({
            showModal: true,
            error: false,
            paused: true
        })
    }

    submit(){
        this.setState({
            saving: true,
        });
        APIMediaFile.createVideo(
            this.props.navigation.state.params.media.id,
            this.state.startTime,
            this.state.endTime,
            this.state.name).then(
            (success) => {
                this.setState({showModal: false});
                this.props.redirect('MediaScreen');
            },
            (error) => this.setState({saving: false, error: "Error while saving. Please try again or contact tech support"}))
    }

    handleMainVideoButtonTouch() {
        this.setState(state => {
            return {
                paused: !state.paused
            };
        });
    }

    handleVideoProgress(progress) {
        if(progress.currentTime *1000 >= this.state.duration){
            this.setState({
                duration: progress.currentTime * 1000,
            });
            return;
        }

        if(this.state.endTime && progress.currentTime * 1000 >= this.state.endTime){
            return this.videoPlayer.seek(this.state.startTime / 1000);
        }

        return this.setState({
            currentTime: progress.currentTime * 1000
        });
    }

    handleVideoEnd() {
        return this.videoPlayer.seek(this.state.startTime);
    }

    handleVideoLoad(meta) {
        //only first time load
        if(this.state.duration === 0){
            this.setState({
                duration: meta.duration * 1000,
                startTime: 0,
                endTime: meta.duration * 1000,
                loading: false
            });
        }

    }

}

const mapDispatchToProps = dispatch => ({
    redirect: (scene) => dispatch(NavigationActions.navigate({ routeName: scene })),
});

export default connect(null, mapDispatchToProps)(VideoEditor);
