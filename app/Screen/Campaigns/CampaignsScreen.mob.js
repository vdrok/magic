import React from 'react';
import { connect } from 'react-redux';
import { View, Image, SectionList, TouchableWithoutFeedback, Button } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { withNavigation } from 'react-navigation';
import { logo, campaign_placeholder } from '../../Helpers';
import styles from './Style/CampaignsScreenStyle';
import WhiteBox from '../../Component/WhiteBox/WhiteBoxComponent.mob'
import Text from '../../Component/Text/TextComponent.mob'
import Colours from '../../Styles/Colors'
import { Creators as TemplateActions } from '../../Reducer/TemplateReducer'
import ButtonComponent from "../../Component/Button/ButtonComponent.mob";
import TemplateQuestionaryModalComponent from '../../Component/TemplateQuestionaryModal/TemplateQuestionaryModalComponent.mob';
import TextSeparator from "../../Component/Layout/TextSeparator/TextSeparator.mob";

export class CampaignsScreen extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: <Text style={styles.headerLeftTitle}>New story</Text>,
        headerLeft: <Button title="Back" onPress={() => navigation.goBack()} />,
    });

    constructor(){
        super();
        this.state = {
            templates: [],
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

                return this.props.navigation.navigate('StorylineScreen', {
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
            templates: this.__tranformToSectionList(newProps.categories,newProps.templates),
            busy: newProps.loading
        });

    }
    __tranformToSectionList(categories, templates){
        let sections = [];

        categories.forEach( c => {
            let CategoryWithData = { data: [], title: c };
            templates.filter( t =>  t.category === c).forEach(t => {
                CategoryWithData.data.push(t);
            })
            sections.push(CategoryWithData);
        });

        return sections;
    }

    renderHeader(section){
        return <View style={styles.sectionWrapper} key={section.title}>
            <Text style={styles.sectionText}>{section.title}</Text>
        </View>
    }

    renderItem(item){
        const disabled = item.template_item_count === 0
        const disabledBackground = disabled ? styles.disabledBackground : {}
        const disabledText = disabled ? styles.disabledText : {}

        return <TouchableWithoutFeedback onPress={() => this.showModal(item)} disabled={disabled}>
            <View>
            <WhiteBox style={[styles.campaignBox, disabledBackground]} key={item.id}>
                <Icon name="keyboard-arrow-right" size={30} color={Colours.boxBorder} style={styles.campaignArrow}/>
                <View style={styles.campaignImageWrapper}>
                    <Image source={ campaign_placeholder } style={styles.campaignImage} />
                </View>
                <View style={styles.campaignTextWrapper}>
                    <Text style={[styles.campaignTitle, disabledText]}>{item.name}</Text>
                    <Text style={[styles.campaignDescription, disabledText]}>{item.description}</Text>
                </View>
            </WhiteBox>
            </View>
        </TouchableWithoutFeedback>;
    }

    render() {
        return <View style={styles.container}>
            <TextSeparator text='Select story template' />
            {this._renderError()}
            <SectionList contentContainerStyle={styles.list}
                         keyExtractor={(item, index) => index}
                         onRefresh={false}
                renderItem={({item}) => this.renderItem(item)}
                renderSectionHeader={({section}) => this.renderHeader(section)}
                sections={this.state.templates}
            />
            <ButtonComponent onPress={this.createCustomCampaign.bind(this)} style={styles.button}>Custom Story +</ButtonComponent>
            {this._renderModal()}
        </View>;
    }

    _renderError() {
        if(this.state.error)
            return <Text style={[styles.errorMessage, {marginBottom: 10}]}>Unable to create campaign</Text>
    }

    createCustomCampaign() {
        this.showModal({
            name: 'Custom Story'
        });
    }

    showModal(template) {
        this.setState({
            selectedTemplate: template
        }, () => {
            this.refs.templateModal.show()
        });
    }

    onCloseCallback(submitted, data) {
        let templateId = this.state.selectedTemplate.id;

        this.setState({
            selectedTemplate: {}
        });

        if (!submitted) {
            return false;
        }

        this.setState({
            creatingCampaign: true,
            error: false
        });

        this.props.createFromTemplate(templateId, data);
    }

    _renderModal() {
        return <TemplateQuestionaryModalComponent
            ref="templateModal"
            template={this.state.selectedTemplate}
            closeCallback={this.onCloseCallback.bind(this)}
        />
    }
}


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

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(CampaignsScreen));