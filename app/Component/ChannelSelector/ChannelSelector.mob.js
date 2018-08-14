import React from 'react';
import PropTypes from 'prop-types';
import {View, Image, Text, TextInput, TouchableWithoutFeedback, Modal } from 'react-native';
import { Button } from 'native-base'
import Style from "./Style/ChannelSelector";
import Icon from 'react-native-vector-icons/dist/Entypo';
import Colors from '../../Styles/Colors'
import ChannelIcon from "../ChannelIcon/ChannelIconComponent.mob";
import { Picker, Item } from 'native-base'
import ChannelActions from "../../Reducer/ChannelReducer";
import {connect} from "react-redux";
import FacebookManager from "../../Manager/BaseFacebook";
import ButtonComponent from "../Button/ButtonComponent.mob";

class ChannelSelector extends React.Component {

    static propTypes = {
        channel: PropTypes.shape({
            thumbnail: PropTypes.string,
            name: PropTypes.string,
            id: PropTypes.number,
        }).isRequired,
        type: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        allowCustomChannel: PropTypes.bool.isRequired,
    };


    constructor(props) {
        super(props);

        this.state = {
            channels: [
                props.channel
            ],
            otherChannelName: props.channel.name ?    props.channel.name : '',
            selectedChannelId: props.channel.id ?    props.channel.id : null,
            showCustomNamePopup: false,
        }

    }

    componentWillMount(){
        this.props.getChannels();
    }

    componentWillReceiveProps({channels}){

        let newChannels = [];
        //other channel selected initailly
        if(this.state.otherChannelName.length > 0 && this.props.allowCustomChannel){
            newChannels.push({
                id: null,
                name:  this.state.otherChannelName,
                type:  this.props.type
            });
        }

        newChannels.push(
            ...channels
        );

        if(this.props.allowCustomChannel){
            newChannels.push(
                {
                    id: -1,
                    name: "+ Other channel",
                    type: this.props.type
                }
            );
        }

        this.setState({
            channels: newChannels
        })
    }

    isCorrectChannelType(type){
        if(type ===  FacebookManager.Types.PAGE && this.props.type === FacebookManager.Types.ACCOUNT) return true;
        if(type ===  FacebookManager.Types.ACCOUNT && this.props.type === FacebookManager.Types.PAGE) return true;
        if(type === 'instagram-business' && this.props.type === 'instagram') return true;
        if(type === 'instagram' && this.props.type === 'instagram-business') return true;
        return type === this.props.type;
    }


    render() {
        const selectedStyle = this._isSelected() ? Style.selectedWrapper : null;
        const that = this;

        return <View style={[Style.wrapper, selectedStyle]}>

            {this.renderPopup()}
            {this._renderIcon()}
            <Picker
                mode="dropdown"
                placeholder="Click to select the channel"
                note={false}
                style={{ minWidth: 300}}

                selectedValue={this.state.selectedChannelId}
                onValueChange={this.onChange.bind(this)}>

                {this.state.channels.filter(c=> that.isCorrectChannelType(c.type)).map((channel) =>{
                        return <Item label={channel.name} value={channel.id} key={channel.id} />;
                    }
                )}

            </Picker>
        </View>
    }


    renderPopup(){

        return <Modal
            animationType={'fade'}
            visible={this.state.showCustomNamePopup}
            onRequestClose={() => this.setState({showCustomNamePopup: false})}
            transparent
            onRequestClose={() => this.setState({showCustomNamePopup: false})}
        >
            <View style={Style.contentWrapper}>
                <View style={Style.container}>
                    <TouchableWithoutFeedback onPress={() => this.setState({showCustomNamePopup: false})}>
                        <View style={Style.closeButton}>
                            <Text style={Style.closeText}>X</Text>
                        </View>
                    </TouchableWithoutFeedback>

                    <View style={Style.content}>
                        <Text style={Style.heading}>Publishing channel name</Text>

                        <TextInput
                            ref={e => { this.otherChannelInput = e }}
                            placeholder={"Other Channel Name"}
                            value={this.state.otherChannelName}
                            onChangeText={(val) => {
                                this.setState({otherChannelName: val});
                            }}
                            blurOnSubmit={false}
                            returnKeyType={"done"}
                            onSubmitEditing={() => this.saveOtherChannel.bind(this)}
                            style={[Style.input]}
                        />

                        <ButtonComponent onPress={this.saveOtherChannel.bind(this)} active={true}>
                            OK
                        </ButtonComponent>

                    </View>
                </View>
            </View>
        </Modal>;

    }


    _renderIcon(){

        const channel = this.state.channels.find(c => c.id === this.state.selectedChannelId);

        if(!channel) {
            return <View style={[Style.iconWrapper, { width: iconSize} ]}>
                <ChannelIcon channel={this.props.type} style={Style.channelIcon}/>
            </View>
        }

        const { thumbnail, type } = channel;
        if(thumbnail){

            const styleSelected = this._isSelected() ? Style.thumbImgSelected : null;

            return <View style={[Style.iconWrapper]}>
                <Image source={{uri: thumbnail}} style={[Style.thumbImg, styleSelected]} resizeMode={Image.resizeMode.contain}/>
            </View>
        }
        const iconSize = this._isSelected() ? 30 : 45;

        return <View style={[Style.iconWrapper, { width: iconSize} ]}>
            <ChannelIcon channel={type} style={Style.channelIcon}/>
        </View>
    }


    _isSelected(){
        return this.state.channels.some(c => c.id === this.state.selectedChannelId);
    }

    onChange(value){
        const that = this;
        this.setState({
            selectedChannelId: value
        });

        //ask for custom channel name
        if(value === -1){
            this.setState({
                selectedChannelId: null,
                otherChannelName: '',
                showCustomNamePopup: true
            }, () => that.otherChannelInput.focus());
        }else{
            this.props.onChange(this.state.channels.find(c=>c.id === value));
        }
    }

    saveOtherChannel(){
        this.setState({
            selectedChannelId: null,
            showCustomNamePopup: false,
            channels:[
                {
                    id: null,
                    name: this.state.otherChannelName,
                    type: this.props.type
                },
                ...this.state.channels,

            ]
        });

        this.props.onChange(this.state.channels.find(c=>c.id === null));
    }
}

const mapStateToProps = state => ({
    channels: state.channel.list
});
const mapDispatchToProps = dispatch => ({
    getChannels: () => dispatch(ChannelActions.getChannels())
});

export default connect(mapStateToProps, mapDispatchToProps)(ChannelSelector);