import React from 'react';
import PropTypes from 'prop-types';
import { Image, Icon } from 'semantic-ui-react';
import './Style/PostMediaStyle.scss';
import {getThumbnailUrl} from "../../Helpers";

export default class PostMediaComponent extends React.Component {
    static propTypes = {
        media: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            thumbnail: PropTypes.string,
        }))
    };

    render() {
        const { media } = this.props;

        if (!media || media.length === 0) {
            return null;
        }

        return <div className="images-wrapper">
            {this.renderBigImage()}
            {this.renderSmallImagesSection()}
            {this.renderTotalMedia()}
        </div>;
    }

    renderBigImage() {
        const { media } = this.props;

        const firstImage = media[0];

        const videoIcon = firstImage.type === 'video' ?
            <Icon name="play" inverted={true} size='big' /> : null;

        return <div className="big-image-wrapper">
                {videoIcon}
                <Image src={getThumbnailUrl(firstImage)} floated='left' className="post-big-image" />
            </div>
    }

    renderSmallImagesSection() {
        const { media } = this.props;

        if (media.length === 1) {
            return null;
        }

        return <div className="small-image-wrapper">
            {this.renderSmallImages()}
        </div>;
    }

    renderSmallImages() {
        const { media } = this.props;

        return media.map((element, index) => {
            if (index === 0 || index > 3) {
                return null;
            }

            const videoIcon = element.type === 'video' ?
                <Icon name="play" inverted={true} size='large' /> : null;

            return <div className="post-image" key={element.id}>
                    {videoIcon}
                    <Image src={getThumbnailUrl(element)} />
                </div>;
        })
    }

    renderTotalMedia() {
        const { media } = this.props;

        if (media.length < 5) {
            return null;
        }

        const videoMedia = media.filter(element => element.type === 'video');
        const totalVideos = videoMedia.length;
        const totalImages = media.length - totalVideos;

        return <p>{totalVideos} video, {totalImages} images</p>
    }
}