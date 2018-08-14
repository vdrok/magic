import React from 'react';
import PropTypes from 'prop-types';
import { View, Modal, Text, TouchableWithoutFeedback, ScrollView } from 'react-native';
import {ListItem} from 'react-native-elements'
import Style from './Style/CampaignSelectorModalStyle';
import Colors from '../../Styles/Colors'
import { pathOr} from 'ramda'
import {connect} from "react-redux";
import {Creators as CampaignsActions} from "../../Reducer/CampaignReducer";

class CampaignSelectorModalComponent extends React.Component {
    static propTypes = {
        onClick: PropTypes.func.isRequired,

    };

    constructor(props) {
        super(props);

        this.state = {
            opened: false,
            selected: props.selected ? props.selected.id : 0,
            allowEmpty: props.allowEmpty,
            campaigns: []
        };
    }

    componentDidMount() {
        this.props.getCampaigns()
    }

    componentWillReceiveProps(props) {
        this.setState({
            selected: props.selected ? props.selected.id : 0,
            allowEmpty: props.allowEmpty,
            campaigns: pathOr(this.state.campaigns,['campaigns'], props)
        })
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
                        <Text style={Style.heading}>Select campaign</Text>
                        <ScrollView>
                            {this.state.allowEmpty ?
                                <ListItem
                                    onPress={() => this.onCampaignClick(0)}
                                    key={0}
                                    rightIcon={this.state.selected === 0 ? {name: 'check', color: Colors.LinkColor}: null}
                                    hideChevron={this.state.selected !== 0}
                                    title="None"
                                /> : null }
                            {this.state.campaigns ? this.state.campaigns.map(campaign => {
                                return <ListItem
                                    onPress={() => this.onCampaignClick(campaign)}
                                    rightIcon={campaign.id === this.state.selected ? {name: 'check', color: Colors.LinkColor}: null}
                                    hideChevron={campaign.id !== this.state.selected}
                                    key={campaign.id}
                                    title={campaign.name}
                                    subtitle={campaign.type}
                                />
                            }) : null}
                        </ScrollView>
                    </View>
                </View>
            </View>

        </Modal>;
    }

    onCampaignClick(campaign) {
        this.setState({
            selected: campaign.id || campaign
        })

        this.props.onClick(campaign)
    }

}

const mapStateToProps = state => ({
    campaigns: state.campaign.list
});


const mapDispatchToProps = dispatch => ({
    getCampaigns: () => dispatch(CampaignsActions.getCampaigns())
});

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(CampaignSelectorModalComponent);