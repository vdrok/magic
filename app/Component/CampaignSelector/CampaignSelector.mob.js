import React from 'react';
import PropTypes from 'prop-types';
import { View  } from 'react-native';
import Style from "./Style/ChannelSelector";
import { Picker, Item } from 'native-base'
import {connect} from "react-redux";
import {pathOr} from 'ramda';
import {Creators as CampaignAction} from "../../Reducer/CampaignReducer";

class CampaignSelector extends React.PureComponent {

    static propTypes = {
        selected: PropTypes.object,
        style: PropTypes.any,
        onChange: PropTypes.func.isRequired,
    };


    constructor(props) {
        super(props);
        this.state = {
            campaigns: [],
            selected: props.selected,
        }
    }

    componentWillMount(){
        this.props.getCampaigns();
    }

    componentWillReceiveProps(newProps){
        this.setState({
            campaigns: pathOr(this.state.campaigns, ['campaigns'], newProps),
            loading  : newProps.loading
        })
    }

    onChange(value){

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


    render() {
        const selectedId = this.state.selected ? this.state.selected.id : null;

        return <View style={[Style.wrapper, this.props.style]}>

            <Picker
                mode="dropdown"
                placeholder="Not assigned"
                note={false}
                textStyle={ Style.selected }
                style={{ height: 'auto', paddingBottom: 0}}
                placeholderStyle={[Style.placeholder,Style.textNormal]}
                selectedValue={selectedId}
                onValueChange={this.onChange.bind(this)}>
                <Picker.Item label="Not assigned" value="0" key="0" />
                {this.state.campaigns.map((campaign) =>{
                        return <Picker.Item label={campaign.name} value={campaign.id} key={campaign.id} />;
                    }
                )}

            </Picker>
        </View>
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