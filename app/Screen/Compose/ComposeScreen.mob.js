import React from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { Image, ScrollView, ListView, TouchableWithoutFeedback, View } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { logo } from '../../Helpers';
import styles from './Style/ComposeScreenStyle'
import WhiteBox from '../../Component/WhiteBox/WhiteBoxComponent.mob'
import ChannelIcon from '../../Component/ChannelIcon/ChannelIconComponent.mob'
import Colours from '../../Styles/Colors'
import ChannelActions from '../../Reducer/ChannelReducer'
import Text from '../../Component/Text/TextComponent.mob'
import GreenBar from "../../Component/GreenBar/GreenBar.mob";

export class ComposeScreen extends React.Component {
    static navigationOptions = {
        title: <Image source={ logo } style={styles.header_logo} />,
        tabBarLabel: 'Compose',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="launch" size={30} color={tintColor } />
        ),
        headerLeft: <Text style={styles.headerLeftTitle}>Compose</Text>
    };

    constructor (props) {
        super(props);

        const rowHasChanged = (r1, r2) => r1.id !== r2.id;
        const ds = new ListView.DataSource({rowHasChanged});
        this.state = {
            channelSource: ds.cloneWithRows([]),
        }
    }

    componentDidMount() {
        this.props.getChannels();
    }

    componentWillReceiveProps({channels}){
        this.setState({
            channelSource: this.state.channelSource.cloneWithRows(channels)
        });
    }


    render() {
        return <View style={[styles.pageWrapper, styles.flex1]}>
            <GreenBar text='Select publishing channel' icon="launch" style={styles.greenBar}/>
            <ScrollView >
                <ListView
                    dataSource={this.state.channelSource}
                    renderRow={this._renderRow.bind(this)}
                    numRows={this.state.channelSource.length}
                    removeClippedSubviews={false}
                    enableEmptySections={true}
                />
            </ScrollView>
        </View>;
    }

    _renderRow(rowData){
        const icon = (typeof rowData.type == 'undefined') ? null : <ChannelIcon channel={rowData.type} />

        return <WhiteBox style={styles.channelBox}>
                <TouchableWithoutFeedback onPress={() => this.goToCompose(rowData)}>
                    <View style={styles.innerContent}>
                        {icon}
                        <Text style={styles.channelName}>{rowData.name}</Text>
                        <Icon name="keyboard-arrow-right" size={30} color={Colours.boxBorder} style={styles.channelArrow}/>
                    </View>
                </TouchableWithoutFeedback>
            </WhiteBox>;
    }

    goToCompose(channel) {
        return this.props.navigation.navigate('ChannelStorylineScreen', {
            channel
        })
    }
}


const mapStateToProps = state => ({
    channels: state.channel.list
});

const mapDispatchToProps = dispatch => ({
    getChannels: () => dispatch(ChannelActions.getChannels())
});

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(ComposeScreen));