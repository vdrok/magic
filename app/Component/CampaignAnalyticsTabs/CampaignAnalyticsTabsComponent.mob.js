import React from 'react';
import { View, Text} from 'react-native';
import PropTypes from 'prop-types';
import { Tabs, Tab, DefaultTabBar, Picker, Item, Icon } from 'native-base';

import { tabs, pickerList } from './CampaignAnalyticsTabsProps'

import style from './Style/CampaignAnalyticsTabStyle';
import GreenBar from "../GreenBar/GreenBar.mob";

class CampaignAnalyticsTabsComponent extends React.Component {

    static propTypes = {
        onChange: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            onChange: props.onChange,
            activeTab: tabs[0],
            activeValue: this.getDefaultActiveValueByTab(tabs[0])
        }

        this.onValueChange = this.onValueChange.bind(this)
        this.onChangeTab = this.onChangeTab.bind(this)
    }

    componentDidMount() {
        this.props.onChange(this.state.activeValue)
    }

    render() {
        return <Tabs
            onChangeTab={this.onChangeTab}
            renderTabBar={() =>
                <DefaultTabBar
                    underlineStyle={style.tabUnderline}
                    tabContainerStyle={style.tabContainer}/>
            }>
            {this._renderTabs()}
        </Tabs>
    }

    _renderTabs() {
        return tabs.map((tab, index) => {
            return this._renderTab(tab, index)
        })
    }

    _renderTab(tab, index) {
        const borderRight = index === tabs.length - 1 ? {} : style.borderRight

        return <Tab
            heading={tab.title.toUpperCase()}
            key={tab.key}
            tabStyle={[style.tab, style.borderTop, borderRight]}
            activeTabStyle={[style.activeTab, style.borderTop, borderRight]}
            activeTextStyle={[style.tabText, style.activeTabText]}
            textStyle={style.tabText}>
            <View style={style.picker}>
                <GreenBar text='Total per channel' />
                {this._renderPicker(tab)}
            </View>
        </Tab>
    }

    _renderPicker(tab) {

        if (tab.key === 'conversions') {
            return null;
        }

        return <View style={style.pickerWrapper}>
            <Picker
                iosHeader="Analytics type"
                iosIcon={<Icon name="ios-arrow-down-outline" />}
                selectedValue={this.state.activeValue.key}
                headerBackButtonTextStyle={style.pickerBackButton}
                textStyle={{color: '#ffffff', textAlign: 'right'}}
                style={style.pickerStyle}
                onValueChange={this.onValueChange}>
                {pickerList[tab.key].map(item => {
                    return this._renderPickerItem(item)
                })}
            </Picker>
            { /*<Icon style={style.pickerArrow} name="arrow-drop-down" size={28} color='#ffffff'/> */}
        </View>
    }


    _renderPickerItem(item) {
        return <Item key={item.key} label={item.title} value={item.key}/>
    }

    getDefaultActiveValueByTab(tab) {
        return pickerList[tab.key][0]
    }

    onValueChange(value) {
        this.setState({
            activeValue: pickerList[this.state.activeTab.key].find(item => item.key === value)
        }, () => {
            this.props.onChange(this.state.activeValue)
        })
    }

    onChangeTab(tab) {
        const activeTab = tabs[tab.i]

        this.setState({
            activeValue: this.getDefaultActiveValueByTab(activeTab),
            activeTab: activeTab
        }, () => {
            this.props.onChange(this.state.activeValue)
        })
    }

}

export default CampaignAnalyticsTabsComponent;