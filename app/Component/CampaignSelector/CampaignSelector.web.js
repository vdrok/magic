import React from 'react';
import { remove } from 'ramda';
import { Dropdown } from 'semantic-ui-react'
import PropTypes from 'prop-types';
import {pathOr} from 'ramda';
import {connect} from "react-redux";
import './Style/style.scss';
import {Creators as CampaignAction} from "../../Reducer/CampaignReducer";

class CampaignSelector extends React.Component {

    static propTypes = {
        selected: PropTypes.object,
        onChange: PropTypes.func.isRequired,
    };

    constructor(props){
        super(props);
        this.state = {
            selected: props.selected,
            campaigns: []
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        this.props.getCampaigns();
    }

    componentWillReceiveProps(newProps){
        this.setState({
            campaigns: pathOr(this.state.campaigns, ['campaigns'], newProps),
            loading  : newProps.loading
        })
    }



    render() {
        const { selected, loading } = this.state;
        let options = [];
        options.push({
            key: 0,
            text: 'Not assigned',
            value: 0
        });
        this.state.campaigns.map(c => {
            options.push({
            key: c.id,
            text: c.name,
            value: c.id});
        } );



        return <div className="campaign-selector">
            <Dropdown
                loading={loading}
                options={options}
                placeholder='Not assigned'
                defaultValue='Not assigned'
                search
                selection
                value={selected ? selected.id : null}
                onChange={(e, selected) => this.handleChange(selected.value)}
            />
        </div>

    }

    handleChange(value){

        const selectedObject = this.state.campaigns.filter( c => c.id === value);
        if(selectedObject[0]){
            this.setState({
                selected: selectedObject[0]
            });
            this.props.onChange(selectedObject[0]);
        }else{
            this.setState({
                selected: null
            });
            this.props.onChange(null);
        }

    }

}

const mapStateToProps = state => ({
    campaigns: state.campaign.list,
    loading: state.campaign.loading,
});
const mapDispatchToProps = dispatch => ({
    getCampaigns: () => dispatch(CampaignAction.getCampaigns())
});

export default connect(mapStateToProps, mapDispatchToProps)(CampaignSelector);