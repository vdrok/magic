import React from 'react';

import './Style/SelectStyle.scss';

import { Icon, Grid, Image } from 'semantic-ui-react'
import { folder_icons } from '../../Helpers';

class DropdownOptionComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            optionData: props.option,
            selectHandler: props.selectHandler,
            selected: props.selected,
            expanded: false,
            level: props.level,
            path: props.path,
            selectedPath: props.selectionPath
        };

        this.expand = this.expand.bind(this);
        this.select = this.select.bind(this);
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            selected: newProps.selected,
            selectedPath: newProps.selectionPath
        }, () => {
            this.checkForExpand();
        });
    }

    componentDidMount() {
        this.checkForExpand();
    }

    checkForExpand() {
        if (this.state.optionData.id !== 0 && this.state.selectedPath.indexOf(this.state.optionData.id) > -1)
            this.expand();
    }

    render() {
        const {name} = this.state.optionData;

        return <div className="option-wrapper">
            <div className={this.getOptionStyle()} style={{paddingLeft: this.getIndentLevel() * 5}}>
                <div className="row">
                    <div className="label-wrapper" onClick={this.select}>
                        {this._renderIcon()}
                        <div className="label">
                            <label>{name}</label>
                        </div>
                    </div>

                    {this._renderArrow()}

                </div>
            </div>
            {this._renderSubOptions()}
        </div>
    }

    _renderIcon() {
        if (!this.state.optionData)
            return;

        if (typeof this.state.optionData.icon === 'undefined')
            return;

        const icon = this.state.optionData.icon ? folder_icons[this.state.optionData.icon] : folder_icons.folder;

        return <Image src={icon} className="folder-icon" />;
    }

    _renderArrow() {
        if (!this.state.optionData.sub_folders || this.state.optionData.sub_folders.length === 0)
            return;

        const arrow = this.state.expanded ? 'angle up' :'angle down';
        return <Icon name={arrow} onClick={this.expand} className="arrow-icon"/>;
    }

    _renderSubOptions() {
        if (!this.state.optionData.sub_folders || !this.state.expanded)
            return;

        return this.state.optionData.sub_folders.map((option, index) => {
            return <DropdownOptionComponent key={index}
                                            option={option}
                                            selectHandler={this.state.selectHandler}
                                            selected={this.state.selected}
                                            level={this.state.level + 1}
                                            selectionPath={this.state.selectedPath}
                                            path={this.getCurrentPath()}
            />;
        });
    }

    getCurrentPath() {
        return this.state.level === 0 ? [this.state.optionData.id] : [...this.state.path, this.state.optionData.id];
    }

    expand() {
        this.setState({
            expanded: !this.state.expanded
        });
    }

    select() {
        this.state.selectHandler(this.state.optionData, this.getCurrentPath());
    }

    getOptionStyle() {
        let className = "option";
        return this.isSelected() ? `${className} selected` : className;
    }

    getIndentLevel() {
        return this.state.level > 3 ? 3 : this.state.level;
    }

    isSelected() {
        return this.state.optionData.id === this.state.selected.id
    }
}

export default DropdownOptionComponent;