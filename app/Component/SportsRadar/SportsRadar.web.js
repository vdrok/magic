import React from 'react';
import PropTypes from 'prop-types';
import ApiMediaFilesMetadata from '../../API/ApiMediaFilesMetadata';
import { Icon, Label, Table } from 'semantic-ui-react'
import './Style/SportsRadar.scss';

class SportsRadar extends React.Component {

    static propTypes = {
        media: PropTypes.object.isRequired,
        goTo: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            data: []
        }


        this.onClick = this.onClick.bind(this);
        this.fetchSportData = this.fetchSportData.bind(this);

    }

    componentDidMount(){
        this.fetchSportData();
    }


    fetchSportData(){
        const that = this ;
        ApiMediaFilesMetadata.getLiveSportData(that.props.media.id).then(function(d){
            that.setState({
                'data': d.data
            });

            if(d.status === 200){
                setTimeout(that.fetchSportData, 30000);
            }
        })
    }


    render() {
        const { data } = this.state;

        if(!data) return null;

        return <Table celled selectable className="sport-data">
            <Table.Body>
                {data.map((object, i) => this.sportsRadarRow(object))}
            </Table.Body>
            </Table>
    }

    /**
     * commentaries
     * @param r
     * @returns {*}
     */
    sportsRadarRow(r){
        return <Table.Row onClick={() => this.onClick(r.time)} key={r.id}>
            <Table.Cell id={r.id}>
                    <Label ribbon color={SportsRadar._typeToRibonColor(r.type)}>{ r.match_clock ? r.match_clock : r.match_time + ":00" }</Label>
                {SportsRadar._typeToText(r.type)}
            </Table.Cell>
            <Table.Cell>
            { r.commentaries && r.commentaries.map( (c, i) => SportsRadar.renderComments(c, i , r))  }
            </Table.Cell>
        </Table.Row>
    }

    onClick(time){
        this.props.goTo(time * 1000);
    }

    static renderComments(comment,i, row){
        return <p key={row.id+'_cm' + i}>
            { comment.text }
        </p>
    }

    static _typeToText(type){
        switch(type) {
            case "score_change":
                return <Icon name='soccer' size='large'/>;
            case "yellow_card":
                return <Icon name='square' color='yellow' size='large' />;
            case "yellow_red_card":
                return <span><Icon name='square' color='yellow' size='large' /><Icon name='square' color='yellow' size='large' /></span>;
            case "red_card":
                return <Icon name='square' color='red' size='large' />;
        }

        return null;
    }

    static _typeToRibonColor(type){
        switch(type) {
            case "score_change":
                return "green";
            case "yellow_card":
                return "yellow";
            case "yellow_red_card":
                return "yellow";
            case "red_card":
                return "red";
        }

        return null;
    }
}

export default SportsRadar;
