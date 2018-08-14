import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { pathOr } from 'ramda';
import { Creators as CampaignAction } from '../../Reducer/CampaignReducer';
import CampaignComponent from '../../Component/Campaign/CampaignComponent.web';
import { Grid, Header, Button, Item, Container, Card, Statistic} from 'semantic-ui-react'
import './Style/HomeScreen.scss'
import moment from "moment/moment";
import LoadingContent from "../../Component/LoadingContent/LoadingContent.web";

class HomeScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            campaignsList: []
        }

        this.handleStoryClick = this.handleStoryClick.bind(this);
    }

    componentDidMount () {
        this.props.getCampaigns();
    }

    componentWillReceiveProps(props) {
        this.setState({
            campaignsList: pathOr(this.state.campaignsList,['campaigns'], props),
        });
    }

    handleStoryClick(campaign){
        this.props.history.push('/campaign-posts', {
            campaign: campaign
        });
    }


    render() {
        return <Container className="screen-home">
                {this._renderHeader()}
                {this._renderEmpty()}
                {this._renderLoading()}
                {this._renderCampaignsList()}
            </Container>;
    }

    redirectToNewCampaign(){
        this.props.history.push('/campaigns', {
            campaign: this.props.campaign
        });
    }

    _renderHeader() {

        return <Grid stackable columns={2}>
                <Grid.Column  width={6} textAlign='left'>
                    <Header as="h1">Stories</Header>
                </Grid.Column>
                <Grid.Column  width={6} textAlign='right' floated='right'>
                    <Button className="btn" content="New Story +" onClick={() => this.redirectToNewCampaign() } />
                </Grid.Column>
            </Grid>;
    }

    _renderLoading(){
        if(this.props.loading && this.state.campaignsList.length === 0)
            return <LoadingContent className='loading'/>

        return null;
    }

    _renderEmpty(){
        if(this.state.campaignsList.length === 0 && !this.props.loading)
            return <div><Card.Group>

                <CampaignComponent placeholder={true} campaign={{
                    name: 'Your first story',
                    publishing_content_count: 4,
                    publishing_content_drafts_count: 1,
                    start_date: moment().subtract('5 days').toISOString(),
                    analytics: {
                        nett_reach: 123123,
                        comments: 12335,
                        shares: 0,
                        favourite: 224,
                        clicks: 123
                    }
                }} />
            </Card.Group>

                <Header as="h2" className='promo-text'>Create your first story and assign your posts</Header>
            </div>;
    }

    _renderCampaignsList() {
        return <Card.Group>

            {this.state.campaignsList.map((campaign, index) =>
                <CampaignComponent campaign={campaign} key={index} onClick={() => this.handleStoryClick(campaign)}/>) }
        </Card.Group>;
    }
}

const mapStateToProps = state => ({
    campaigns: state.campaign.list,
    loading: state.campaign.loading,
});

const mapDispatchToProps = dispatch => ({
    getCampaigns: () => dispatch(CampaignAction.getCampaigns())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeScreen));