import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements'
import style from './Style/Notification';
import { pathOr } from 'ramda';
import ProgressBar from 'react-native-progress/Bar';
import {connect} from "react-redux";
import Colors from '../../Styles/Colors';

class Notification extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            uploading: [],
            hide: false,
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            uploading: pathOr(this.state.uploading,['uploading'], newProps),
        });
        if(this.state.uploading === false){
            this.setState({
                hide: false,
            });
        }
    }

    _closeNotification(){
        this.setState({hide: true});
    }

    render() {
        if(this.state.hide) return null;
        if(this.state.uploading.length === 0) return null;

        const that = this;
        return this.state.uploading.map(function(uploadedFile){
            return that._renderProgress(uploadedFile.id, uploadedFile.name, uploadedFile.progress)
        });
    }

    _renderProgress(id, name, progress){
        return <View style={[style.notificationBar,style.horizontal]} key={id}>
            <View style={[style.notificationInner]}>
                <View style={style.horizontal}>
                    <Icon name="cloud-upload" size={20} color={Colors.LinkColor}  />
                    <Text style={style.notificationName}>{name}</Text>
                </View>

                <ProgressBar progress={progress / 100}
                             width={null}
                             color={Colors.LinkColor}/>
            </View>

            <Icon name="eye-with-line" type="entypo" size={20} style={style.notificationIcon} onPress={this._closeNotification.bind(this)}/>
        </View>
    }

}

const mapDispatchToProps = dispatch => ({

});

const mapStateToProps = (state) => {
    return {
        uploading: state.media.uploading
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Notification)