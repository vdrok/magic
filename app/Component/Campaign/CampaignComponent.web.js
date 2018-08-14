import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Card, Button, Feed, Icon, Header } from 'semantic-ui-react';
import moment from 'moment/moment';
import * as MdIcon from 'react-icons/lib/md';
import CampaignEditModalComponent from '../CampaignEditModal/CampaignEditModalComponent.web';
import './Style/Campaign.scss';
const numeral = require('numeral');

class CampaignComponent extends React.Component {
    static propTypes = {
        campaign: PropTypes.shape({}).isRequired,
        placeholder: PropTypes.bool,
        onClick: PropTypes.func,
        hideEditButtons: PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.state = {
            campaign: this.props.campaign
        };

        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleEditSuccessCallback = this.handleEditSuccessCallback.bind(this);
    }

    render() {
        const { name, start_date, end_date, publishing_content_count, publishing_content_drafts_count, analytics } = this.state.campaign;

        const additionalClass = this.props.placeholder ? ' placeholder ' : '';
        return (
            <Card className={ 'campaign-card' + additionalClass } fluid onClick={this.handleOnClick}>
                <Card.Content>
                    <Feed>
                        <Feed.Event>
                            <Feed.Content>
                                <Feed.Date>
                                    {moment(start_date).format('ll')}
                                    {end_date && (
                                        <span> - {moment(end_date).format('ll')}</span>
                                    )}
                                    {!end_date && <span> - ...</span>}
                                </Feed.Date>
                                <Feed.Summary>
                                    <Header as="h3">{name}</Header>
                                    { analytics && analytics.nett_reach > 0 &&
                                        <p className='analytics'><span className='values'>{ numeral(analytics.nett_reach).format('0.0a') }</span>gross reach</p>
                                    }

                                    { analytics && analytics.nett_reach > 0 &&
                                    <p className='analytics'><span className='values'>{ numeral((analytics.shares + analytics.comments + analytics.favourite + analytics.clicks) /  analytics.nett_reach).format('0.00%') }</span>engagement rate</p>
                                    }

                                </Feed.Summary>
                                {(!this.props.placeholder  && !this.props.hideEditButtons) && <div className="campaign-action">
                                    <Button icon compact={true} onClick={this.handleEdit}>
                                        <MdIcon.MdEdit size="15" className="campaign-edit" />
                                    </Button>
                                </div> }
                            </Feed.Content>
                        </Feed.Event>
                    </Feed>
                </Card.Content>
                <Card.Content extra>{publishing_content_count} posts, {publishing_content_drafts_count} drafts</Card.Content>
                <CampaignEditModalComponent
                    campaign={this.state.campaign}
                    onSuccessCallback={this.handleEditSuccessCallback}
                    ref="campaignEditModal"
                />
            </Card>
        );
    }

    handleOnClick(){
        if(this.props.placeholder) return;

        if(this.props.onClick){
            this.props.onClick();
        }
    }

    handleEdit(event) {
        this.refs.campaignEditModal.show();
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
    }

    handleEditSuccessCallback(data) {
        this.refs.campaignEditModal.close();
        this.setState({
            campaign: { ...this.state.campaign, name: data.name }
        });
    }
}

export default withRouter(CampaignComponent);
