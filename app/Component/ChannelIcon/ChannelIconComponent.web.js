import React from 'react';
import PropTypes from 'prop-types';
import {logo_socials, logo} from "../../Helpers";
import './Style/ChannelIconComponentStyle.scss'
import FacebookManager from '../../Manager/BaseFacebook'
import Ionicon from 'react-ionicons'

class ChannelIcon extends React.Component {

    static propTypes = {
        channel: PropTypes.oneOf([
            'facebook',
            FacebookManager.Types.PAGE,
            FacebookManager.Types.ACCOUNT,
            'levuro',
            'twitter',
            'linkedin',
            'instagram',
            'instagram-business',
            'youtube',
            'ott']).isRequired,
        className: PropTypes.string,
        /* if yo use icon over the image */
        icon: PropTypes.bool,
        fontSize: PropTypes.string,
        color: PropTypes.string,
    }

    render() {
        const { channel, className } = this.props;
        let icon = null;
        switch(channel){
            case 'facebook': case FacebookManager.Types.PAGE: case FacebookManager.Types.ACCOUNT:
                icon = logo_socials.facebook;
                if(this.props.icon){
                    icon = 'logo-facebook' ;
                }
                break;
            case 'twitter':
                icon = logo_socials.twitter;
                if(this.props.icon){
                    icon = 'logo-twitter' ;
                }
                break;
            case 'linkedin':
                icon = logo_socials.linkedin;
                if(this.props.icon){
                    icon = 'logo-linkedin' ;
                }
                break;
            case 'instagram':
            case 'instagram-business':
                icon = logo_socials.instagram;
                if(this.props.icon){
                    icon = 'logo-instagram' ;
                }
                break;
            case 'youtube':
                icon = logo_socials.youtube;
                if(this.props.icon){
                    icon = 'logo-youtube' ;
                }
                break;
            default:
                icon = logo;
                break;
        }
        if(this.props.icon){
            return <Ionicon icon={icon} color={this.props.color} fontSize={this.props.fontSize}  className={"channel-logo " + className }  />
        }

        return <img src={ icon } className={"channel-logo " + className } />
    }
}

ChannelIcon.defaultProps = {
    className: ''
};



export default ChannelIcon;