import React from 'react';
import PropTypes from 'prop-types';
import {  ActivityIndicator, Image, Dimensions } from 'react-native';
import Style from './Style/ImagePreviewStyle'
import Colors from '../../Styles/Colors';
import API from '../../API/ApiMediaFiles'
/**
 * This component implement the default style for the text
 */
const { height, width } = Dimensions.get('window');

export default class ImagePreview extends React.Component {

    static propTypes = {
        onClose: PropTypes.func.isRequired,
        style: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.number,
            PropTypes.shape({}),
        ]),
        media: PropTypes.shape({
            id: PropTypes.number.isRequired,
            thumbnail: PropTypes.string.isRequired,
        }).isRequired
    }

    constructor(){
        super()
        this.state = {
            source: null,
        }
    }

    componentDidMount(){
        API.getFileUrl(this.props.media.id).then((r) => {
                if (r.status === 200) {
                    this.setState({source: r.data})
                }
            }
        );
    }





    render() {

        const { source } = this.state;
        if(!source) return <ActivityIndicator size='large' color={Colors.green} style={Style.loader}/>;

        return <Image source={{uri: source}} style= {{  height: height, width: width, overflow:'visible' }} resizeMode='contain'/>;
    }
}