import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';
import styles from './Style/ChannelIconComponentStyle'
import { logo_socials, logo } from '../../Helpers';
import FacebookManager from '../../Manager/BaseFacebook'
import { Icon } from 'native-base'

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
        style: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.number,
            PropTypes.shape({}),
        ]),
        /* if yo use icon over the image */
        icon: PropTypes.bool,
    }

    render() {
        const { channel, style } = this.props;

        let icon = null;
        switch(channel){
            case 'facebook': case FacebookManager.Types.PAGE: case FacebookManager.Types.ACCOUNT:
                icon =  logo_socials.facebook;
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
                return <Image source={ icon } style={[styles.channel_logo, style]} />
                break;
        }

        if(this.props.icon){
            return <Icon name={icon} style={[styles.channel_icon, style]} />
        }

        return <Image source={ icon } style={[styles.channel_logo, style]} />
    }
}


export default ChannelIcon;