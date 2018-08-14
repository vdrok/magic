import React from 'react';
import PropTypes from 'prop-types';
import {logo_socials, post_status, truncateText} from '../../Helpers';
import {Header, Image} from 'semantic-ui-react'

import './Style/PublishingContentSmall.scss';

class PublishingContentSmallComponent extends React.Component {

    static propTypes = {
        post: PropTypes.shape({}).isRequired,
        showChannel: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.state = {
            post: props.post,
            showChannel: props.showChannel
        }
    }

    _renderChannelName(){

        if(!this.state.showChannel){
            return null;
        }

     return  <div>
         <Header as='h4' image className='channel-wrapper'>
             <Header.Content>
                 {this._renderChannel()}
             </Header.Content>
         </Header>
         <span className='floated-right text-gray'>{post_status[this.state.post.status]}</span>
     </div>;
    }

    render() {
        return <div>

            {this._renderChannelName()}

            <div className="post-container">
                {this._renderPostThumbnail()}
                <p>
                    {truncateText(this.state.post.message, 85)}
                </p>
            </div>
        </div>
    }

    _renderChannel() {
        const {channel} = this.state.post

        return <p>
            <Image src={logo_socials[channel.type]} alt={channel.type} spaced className="channel-image"/>
            {channel.name}
        </p>
    }

    _renderPostThumbnail() {
        const {media} = this.state.post

        if (!media || media.length === 0) {
            return null;
        }

        return <Image src={media[0].thumbnail} size="tiny" floated='left'/>
    }

}


PublishingContentSmallComponent.defaultProps = {
    showChannel: true
};

export default PublishingContentSmallComponent;