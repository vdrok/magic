import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link,  withRouter} from 'react-router-dom'
import { Creators as TemplateActions } from '../../Reducer/TemplateReducer'
import { campaign_placeholder } from '../../Helpers';
import { Header, Item, Card, Container, Button, Image, Message} from 'semantic-ui-react'
import TemplateQuestionaryModalComponent from '../../Component/TemplateQuestionaryModal/TemplateQuestionaryModalComponent.web';

import './Style/CampaignsScreen.scss'

class CampaignsScreen extends React.Component {

    constructor(){
        super();
        this.state = {
            templates: [],
            showModal: false,
            selectedTemplate: {},
            creatingCampaign: false,
            busy: false,
            error: false
        }
    }


    componentDidMount () {
        this.props.getTemplates();
    }


    componentWillReceiveProps (newProps) {
        if (this.state.busy && !newProps.loading && this.state.creatingCampaign) {
            if (newProps.createdCampaign !== null) {
                const campaign = newProps.createdCampaign;
                this.props.clearCampaign();
                this.setState({
                    creatingCampaign: false
                });
                return this.props.history.push('/campaign-posts', {
                    campaign
                });
            }
            else {
                this.setState({
                    creatingCampaign: false,
                    error: true
                });
            }
        }

        this.setState({
            categories: newProps.categories,
            templates: newProps.templates,
            busy: newProps.loading
        })
    }
    renderTemplates(category){
        if(!this.state.templates) return;

        return <Card.Group>
            {
                this.state.templates.filter(t => t.category === category).map((template, ind) => {
                    const disabled = template.template_item_count === 0 ? 'disabled-card' : '';

                    return <Card key={template.id + '_' + category } fluid onClick={() => this.showTemplateModal(template)} className={disabled}>

                            <Card.Content>
                                <Image src={campaign_placeholder} alt={template.name} floated='left' />
                                <Card.Header>{template.name}</Card.Header>
                                <Card.Meta>{template.description}</Card.Meta>
                            </Card.Content>
                        </Card>;

                })
            }


        </Card.Group>

    }


    renderCategories(){
        const that = this;
        if(!this.state.categories) return null;

        return <ul className="categories">
            {this.state.categories.map(function(name,index){

                return (<Container className="template-category" key={index}>
                        <Header as='h3' dividing>
                        {name}
                        </Header>
                    {that.renderTemplates(name)}
                    </Container>
                );
            })}
        </ul>
    }

    render() {
        return <Container className="page-campaign">
            <Container fluid className="clearfix">
                <Header floated="left" as='h1'>Choose story template</Header>
                <Button floated="right" className="btn" onClick={this.createCustomCampaign.bind(this)}>Custom Story +</Button>
            </Container>
            {this._renderError()}
            {this.renderCategories()}
            {this._renderTemplateModal()}
        </Container>;
    }

    _renderError() {
        if (this.state.error)
            return <Message
                error
                content='Unable to create the story'
            />;
    }

    createCustomCampaign() {
        this.showTemplateModal({
            name: 'Custom Campaign'
        });
    }

    showTemplateModal(template) {
        if (template.template_item_count === 0) {
            return;
        }

        this.setState({
            showModal: true,
            selectedTemplate: template
        });
    }

    hideModal(success = false, questionary = {}) {
        this.setState({
            showModal: false
        });

        if (!success) {
            return this.setState({
                selectedTemplate: {}
            });
        }

        this.setState({
            creatingCampaign: true,
            error: false
        });
        this.props.createFromTemplate(this.state.selectedTemplate.id, questionary);
    }

    _renderTemplateModal() {
        if (!this.state.showModal) return null;

        return <TemplateQuestionaryModalComponent
            template={this.state.selectedTemplate}
            closeCallback={this.hideModal.bind(this)}
        />;
    }
}


CampaignsScreen.propTypes = {
    getTemplates: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    templates: state.templates.list,
    categories: state.templates.categories,
    loading: state.templates.loading,
    createdCampaign: state.templates.createdCampaign
});

const mapDispatchToProps = dispatch => ({
    getTemplates: () => dispatch(TemplateActions.getTemplates()),
    createFromTemplate: (template_id, questionary) => dispatch(TemplateActions.createFromTemplate(template_id, questionary)),
    clearCampaign: () => dispatch(TemplateActions.clearCampaign())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CampaignsScreen));