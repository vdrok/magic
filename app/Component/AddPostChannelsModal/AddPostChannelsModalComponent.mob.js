import React from 'react';
import PropTypes from 'prop-types';
import { View, Modal, Text, TouchableWithoutFeedback, ScrollView } from 'react-native';

import ChannelListComponent from '../ChannelList/ChannelListComponent.mob';
import Style from './Style/AddPostChannelsModalStyle';


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
            onRequestClose={()=> this.close()}
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
                            <ChannelListComponent onClick={this.onClickHandler.bind(this)}/>
                        </ScrollView>
                    </View>
                </View>
            </View>

        </Modal>;
    }

    onClickHandler(channel) {
        this.props.onClick(channel);
    }

}

export default AddPostModalComponent;