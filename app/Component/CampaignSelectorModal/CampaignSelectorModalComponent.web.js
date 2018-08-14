import React from 'react';
import PropTypes from 'prop-types';
import { List, Header, Modal } from 'semantic-ui-react';
import { pathOr} from 'ramda'
import {connect} from "react-redux";
import {Creators as CampaignsActions} from "../../Reducer/CampaignReducer";


class CampaignSelectorModalComponent extends React.Component {
    static propTypes = {
        onClick: PropTypes.func.isRequired
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
        this.props.getCampaigns();
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
        return <Modal size="small" open={this.state.opened} closeIcon onClose={this.close.bind(this)}>
            <Header as="h1">Select campaign</Header>

            <Modal.Content>
                <List selection>
                    {this.state.allowEmpty ?
                        <List.Item key={0} active={this.state.selected === 0} onClick={() => this.onCampaignClick(0)}>
                            <List.Header as="h3">None</List.Header>
                        </List.Item> : null}
                    {this.state.campaigns ? this.state.campaigns.map(campaign => {
                        return this._renderCampaign(campaign)
                    }) : null}
                </List>
            </Modal.Content>
        </Modal>
    }

    _renderCampaign(campaign) {
        const active = this.state.selected === campaign.id;

        return <List.Item key={campaign.id} selected active={active} onClick={() => this.onCampaignClick(campaign)}>
            <List.Header as="h3">{campaign.name}</List.Header>
            <List.Description>{campaign.type}</List.Description>
        </List.Item>
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