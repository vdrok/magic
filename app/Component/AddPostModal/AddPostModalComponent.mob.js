import React from 'react';
import PropTypes from 'prop-types';
import { View, Modal, Text, TouchableWithoutFeedback, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Style from './Style/AddPostModalStyle';
import Colours from '../../Styles/Colors'
import WhiteBox from "../WhiteBox/WhiteBoxComponent.mob";
import ChannelIcon from "../ChannelIcon/ChannelIconComponent.mob";


class AddPostModalComponent extends React.Component {
    static propTypes = {
        onClick: PropTypes.func.isRequired,

    };

    constructor(props) {
        super(props);

        this.state = {
            opened: false
        };
    }


    show() {
        this.setState({
            opened: true
        });
    }

    close() {
        this.setState({
            opened: false
        });
    }


    render() {
        const {opened} = this.state;

        return <Modal
                animationType={'fade'}
                visible={opened}
                transparent
                onRequestClose={() => this.close()}
            >
                <View style={Style.contentWrapper}>
                    <View style={Style.container}>
                        <TouchableWithoutFeedback onPress={() => this.close()}>
                            <View style={Style.closeButton}>
                                <Text style={Style.closeText}>X</Text>
                            </View>
                        </TouchableWithoutFeedback>

                        <View style={Style.content}>
                            <Text style={Style.heading}>Select publishing channel</Text>
                            <ScrollView>
                                <WhiteBox style={Style.channelBox}>
                                    <TouchableWithoutFeedback onPress={() => this.props.onClick('facebook-page')}>
                                        <View style={Style.innerContent}>
                                            <ChannelIcon channel='facebook-page' />
                                            <Text style={Style.channelName}>Facebook</Text>
                                            <Icon name="keyboard-arrow-right" size={30} color={Colours.boxBorder} style={Style.channelArrow}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </WhiteBox>
                                <WhiteBox style={Style.channelBox}>
                                    <TouchableWithoutFeedback onPress={() => this.props.onClick('twitter')}>
                                        <View style={Style.innerContent}>
                                            <ChannelIcon channel='twitter' />
                                            <Text style={Style.channelName}>Twitter</Text>
                                            <Icon name="keyboard-arrow-right" size={30} color={Colours.boxBorder} style={Style.channelArrow}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </WhiteBox>
                                <WhiteBox style={Style.channelBox}>
                                    <TouchableWithoutFeedback onPress={() => this.props.onClick('instagram')}>
                                        <View style={Style.innerContent}>
                                            <ChannelIcon channel='instagram' />
                                            <Text style={Style.channelName}>Instagram</Text>
                                            <Icon name="keyboard-arrow-right" size={30} color={Colours.boxBorder} style={Style.channelArrow}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </WhiteBox>
                                <WhiteBox style={Style.channelBox}>
                                    <TouchableWithoutFeedback onPress={() => this.props.onClick('youtube')}>
                                        <View style={Style.innerContent}>
                                            <ChannelIcon channel='youtube' />
                                            <Text style={Style.channelName}>Youtube</Text>
                                            <Icon name="keyboard-arrow-right" size={30} color={Colours.boxBorder} style={Style.channelArrow}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </WhiteBox>
                            </ScrollView>
                        </View>
                    </View>
                </View>

            </Modal>;
    }

}

export default AddPostModalComponent;