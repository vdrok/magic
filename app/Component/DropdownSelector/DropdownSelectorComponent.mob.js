import React from 'react';
import { connect } from 'react-redux';
import { TouchableWithoutFeedback, Text, View, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import DropdownSelectorComponent from './DropdownOptionComponent.mob';

import { folder_icons, arrow_icon } from '../../Helpers';

import Style from "./Style/SelectStyle";

class DropdownSectionComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            expended: false,
            selected: {},
            chosen: {},
            options: props.options,
            onUpdateHandler: props.onUpdateHandler,
            chosenPath: []
        };

        this.buttonPressed = this.buttonPressed.bind(this);
        this.selectHandler = this.selectHandler.bind(this);
        this.chooseHandler = this.chooseHandler.bind(this);
    }

    componentWillReceiveProps({options}) {
        this.setState({ options });
    }

    componentDidMount() {
        const recentlyUsed = this.getRecentlyUsed();
        this.setState({
            selected: recentlyUsed,
            chosen: recentlyUsed
        }, () => {
            this.state.onUpdateHandler(this.state.chosen.id)
        })
    }

    render() {
        return <View>
            <View style={this.state.expended && Style.wrapper}>
                <ScrollView>
                        <TouchableWithoutFeedback onPress={this.buttonPressed}>
                            <View style={[Style.button, Style.buttonMain]}>
                                <View style={Style.textWrapper}>
                                    {this.getSelectedIcon()}
                                    <Text style={[Style.buttonText, Style.buttonTextMain]}>
                                        {this.getSelectedTitle()}
                                    </Text>
                                </View>
                                {this._renderDropdownArrow()}
                            </View>
                        </TouchableWithoutFeedback>
                        {this._renderDropdown()}
                </ScrollView>
            </View>

            {this._renderChooseButton()}
        </View>;
    }

    _renderDropdown() {
        if (!this.state.expended)
            return;

        let result = [];

        result.push(this._renderDropdownElement(this.getRecentlyUsed(), -1))

        result.push(this.state.options.map((option, index) => {
            return this._renderDropdownElement(option, index);
        }));

        return result;
    }

    _renderDropdownElement(element, index) {
        let {selected, chosen} = this.state;

        return <DropdownSelectorComponent
                    key={index}
                    option={element}
                    selectHandler={this.selectHandler}
                    selected={selected}
                    chosen={chosen}
                    chosenPath={this.state.chosenPath}
                    level={0}
                />;
    }

    _renderChooseButton() {
        if (!this.state.expended)
            return;

        return <TouchableWithoutFeedback onPress={this.chooseHandler}>
            <View style={Style.chooseButton}>
                <Text style={Style.chooseButtonText}>Select Folder</Text>
            </View>
        </TouchableWithoutFeedback>;
    }

    _renderDropdownArrow() {
        return this._renderArrow(this.state.expended);
    }

    _renderArrow(open = false) {
        let arrowIcon = open ? "open" : "close";

        return <Image source={arrow_icon[arrowIcon]} style={Style.buttonArrow}/>;
    }

    selectHandler(selectedObject, path = []) {
        this.setState({
            selected: selectedObject,
            chosenPath: path
        });
    }

    chooseHandler() {
        this.setState({
            chosen: this.state.selected,
            expended: false
        }, () => {
            this.state.onUpdateHandler(this.state.chosen.id);
        });
    }

    buttonPressed() {
        this.setState({
            expended: !this.state.expended
        });
    }

    getSelectedTitle() {
        return this.state.chosen.name || 'default';
    }

    getSelectedIcon() {
        if (typeof this.state.chosen.icon === 'undefined')
            return;

        const icon = !this.state.chosen.icon ? folder_icons.folder : folder_icons[this.state.chosen.icon];

        return <Image style={Style.buttonIcon} source={icon}/>
    }

    getRecentlyUsed() {
        return {
            id: 0,
            name: "Recently Used"
        }
    }
}

export default DropdownSectionComponent;