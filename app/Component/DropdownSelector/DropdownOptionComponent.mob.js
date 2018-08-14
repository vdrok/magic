import React from 'react';
import { connect } from 'react-redux';
import { TouchableWithoutFeedback, Text, View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { folder_icons, arrow_icon } from '../../Helpers';

import Style from "./Style/SelectStyle";

class DropdownOptionComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            optionData: props.option,
            selectHandler: props.selectHandler,
            selected: props.selected,
            chosen: props.chosen,
            expended: false,
            level: props.level,
            chosenPath: props.chosenPath || [],
            path: props.path
        };

        this.expend = this.expend.bind(this);
        this.selectOption = this.selectOption.bind(this);
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            selected: newProps.selected
        });
    }

    componentDidMount() {
        this.checkForExpend();
    }

    checkForExpend() {
        if (this.state.optionData.id !== 0 && this.state.chosenPath.indexOf(this.state.optionData.id) > -1)
            this.expend();
    }

    render() {
        return <View>
            <TouchableWithoutFeedback onPress={this.selectOption}>
                <View style={this.buttonStyle()}>
                    <View style={Style.textWrapper}>
                        {this.getIcon()}
                        {this.getLabel()}
                    </View>
                    {this._renderArrow()}
                </View>
            </TouchableWithoutFeedback>
            {this._renderDropdown()}
        </View>
    }

    _renderDropdown() {
        if (!this.state.expended || !this.state.optionData.sub_folders)
            return;

        let {selectHandler, selected, chosen} = this.state;

        return this.state.optionData.sub_folders.map((element, index) => {
            return <DropdownOptionComponent
                        key={index}
                        option={element}
                        selectHandler={selectHandler}
                        selected={selected}
                        chosen={chosen}
                        level={this.state.level+1}
                        chosenPath={this.state.chosenPath}
                        path={this.getPath()}
                    />
        });
    }

    _renderArrow() {
        if (!this.state.optionData.sub_folders || this.state.optionData.sub_folders.length === 0)
            return;

        let arrowIcon = this.state.expended ? "open" : "close";

        return <TouchableWithoutFeedback onPress={this.expend}>
            <Image source={arrow_icon[arrowIcon]} style={Style.buttonArrow}/>
        </TouchableWithoutFeedback>;
    }

    getPath() {
        return this.state.level === 0 ? [this.state.optionData.id] : [...this.state.path, this.state.optionData.id];
    }

    selectOption() {
        this.state.selectHandler({
            id: this.state.optionData.id,
            name: this.state.optionData.name,
            icon: this.state.optionData.icon
        }, this.getPath());
    }

    expend() {
        this.setState({
            expended: !this.state.expended
        });
    }

    getIcon() {
        if (typeof this.state.optionData.icon === 'undefined')
            return;

        const icon = this.state.optionData.icon === null ? folder_icons.folder : folder_icons[this.state.optionData.icon];

        return <Image style={Style.buttonIcon} source={icon}/>
    }

    getLabel() {
        return <Text style={this.textStyle()}>
            {this.state.optionData.name}
        </Text>;
    }

    textStyle() {
        if (!this.isChosen())
            return Style.buttonText;

        return [
            Style.buttonText,
            Style.activeButtonText
        ];
    }

    buttonStyle() {
        const paddingLeft = 22 + 5 * this.getNestingLevel();

        if (!this.isSelected())
            return [
                Style.button,
                {paddingLeft}
            ];

        return [
            Style.button,
            Style.activeButton,
            {paddingLeft}
        ];
    }

    getNestingLevel() {
        return this.state.level > 3 ? 3 : this.state.level;
    }

    isSelected() {
        return this.state.selected.id == this.state.optionData.id;
    }

    isChosen() {
        return this.state.chosen.id === this.state.optionData.id;
    }
}

export default DropdownOptionComponent;