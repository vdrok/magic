import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { path } from 'ramda';
import { Icon, Grid } from 'semantic-ui-react'

import { arrow_icon } from '../../Helpers';

import './Style/SelectStyle.scss';

import DropdownOptionComponent from './DropdownOptionComponent.web';

class DropdownSelectorComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false,
            options: props.options,
            onUpdateHandler: props.onUpdateHandler,
            selected: {},
            selectionPath: []
        };

        this.expand = this.expand.bind(this);
        this.select = this.select.bind(this);
    }

    componentWillReceiveProps({options}) {
        this.setState({ options });
    }

    componentDidMount() {
        this.setState({
            selected: this.getRecentlyUsed()
        }, () => {
            this.state.onUpdateHandler(this.state.selected.id)
        })
    }

    render() {
        return <div className="select-field">
            <div className="selected-value" onClick={this.expand}>
                <label>{this.state.selected.name || 'default'}</label>
                {this._renderArrow()}
            </div>
            {this._renderOptionsDropdown()}
        </div>;
    }

    _renderOptionsDropdown() {
        if (!this.state.expanded)
            return;

        return <div className="selected-options">
            {this._renderOptions()}
        </div>
    }

    _renderOptions() {
        let result = [];

        result.push(<DropdownOptionComponent
            key={-1}
            option={this.getRecentlyUsed()}
            selectHandler={this.select}
            selected={this.state.selected}
            selectionPath={this.state.selectionPath}
            level={0}
        />);

        result.push(this.state.options.map((option, index) => {
            return <DropdownOptionComponent key={index}
                                            option={option}
                                            selectHandler={this.select}
                                            selected={this.state.selected}
                                            selectionPath={this.state.selectionPath}
                                            level={0}
            />
        }));

        return result;
    }

    _renderArrow() {
        const arrow = this.state.expanded ? 'angle up' :'angle down';
        return <Icon name={arrow} />;
    }

    expand() {
        this.setState({
            expanded: !this.state.expanded
        });
    }

    select(option, path) {
        this.setState({
            selected: option,
            expanded: false,
            selectionPath: path
        });

        this.state.onUpdateHandler(option);
    }

    getRecentlyUsed() {
        return {
            id: 0,
            name: "Recently Used"
        }
    }
}


const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DropdownSelectorComponent));