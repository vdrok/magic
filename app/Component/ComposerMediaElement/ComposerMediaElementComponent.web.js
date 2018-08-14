import React from 'react';
import PropTypes from 'prop-types';

import {Image, Icon} from 'semantic-ui-react';

import './Style/ComposerMediaElement.scss';
import {getThumbnailUrl} from "../../Helpers";

export default class ComposerMediaElementComponent extends React.Component {
    static propTypes = {
        media: PropTypes.object.isRequired,
        onClick: PropTypes.func
    };

    render() {
        const {thumbnail, type, name} = this.props.media;
        const onClick = this.props.onClick || (() => {});

        const videoIcon = type === 'video' ?
            <Icon name="play" inverted={true} /> : null;

        return <div className="media-element-wrapper">
            <div className="hover-wrapper">
                <div className="close" onClick={() => onClick(this.props.media)}>
                    X
                </div>
                {videoIcon}
                <Image src={getThumbnailUrl(this.props.media)} size="small"/>
            </div>
            <label>{name}</label>
        </div>
    }
}