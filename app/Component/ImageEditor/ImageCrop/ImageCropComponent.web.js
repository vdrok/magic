import React from 'react';
import PropTypes from 'prop-types';
import { Loader, Button, Icon, Image } from 'semantic-ui-react';
import * as MdIcon from 'react-icons/lib/md';
import * as FaIcon from 'react-icons/lib/fa';
import Cropper from 'react-cropper';

import { logo } from '../../../Helpers';
import 'cropperjs/dist/cropper.css';
import './Style/ImageCropStyle.scss';

class ImageCropComponent extends React.Component {
    static propTypes = {
        image: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            image: this.props.image,
            template: 'original',
            viewMode: 1,
            aspectRatio: NaN
        };

        this.handleReady = this.handleReady.bind(this);
    }

    handleReady() {
        this.setState({
            loading: false
        });
    }

    handleTemplateChange(template) {
        const aspectRatios = {
            original: NaN,
            landscape: 1.7777,
            levuro: 1.7772,
            'facebook-landscape': 1.7777,
            'facebook-square': 1.0,
            'facebook-story': 0.5625,
            'facebook-vertical': 0.6666,
            'instagram-square': 1.0,
            'instagram-story': 0.5625,
            'instagram-vertical': 0.8,
            'twitter-post': 2.0,
            'twitter-square': 1.0
        };

        template = template || 'original';

        this.setState({
            template: template,
            aspectRatio: aspectRatios[template]
        });
    }

    getCropData() {
        const { x, y, width, height } = this.refs.cropper.getData(true);

        return {
            x,
            y,
            width,
            height
        };
    }

    render() {
        return (
            <div className="image-crop-container">
                {this.state.loading && <Loader active inline="centered" />}
                <div className={!this.state.loading ? null : 'is-loading'}>
                    <Cropper
                        ref="cropper"
                        src={this.state.image}
                        style={{ height: 400, width: '100%' }}
                        alt="image"
                        viewMode={this.state.viewMode}
                        aspectRatio={this.state.aspectRatio}
                        checkCrossOrigin={false}
                        ready={this.handleReady}
                    />
                    <div className="image-crop-buttons">
                        <Button.Group>
                            <Button
                                className={this.state.template === 'original' ? 'template-active' : ''}
                                active={this.state.template === 'original' ? true : false}
                                onClick={() => {
                                    this.handleTemplateChange('original');
                                }}>
                                <MdIcon.MdCameraAlt size="35" />
                                <br />Original<br />&nbsp;
                            </Button>
                            <Button
                                className={this.state.template === 'landscape' ? 'template-active' : ''}
                                active={this.state.template === 'landscape' ? true : false}
                                onClick={() => {
                                    this.handleTemplateChange('landscape');
                                }}>
                                <MdIcon.MdCropLandscape size="35" />
                                <br />Landscape<br />(16:9)
                            </Button>
                            <Button
                                className={this.state.template === 'levuro' ? 'template-active' : ''}
                                active={this.state.template === 'levuro' ? true : false}
                                onClick={() => {
                                    this.handleTemplateChange('levuro');
                                }}>
                                <Image className="template-logo-icon" src={logo} />
                                <br />Levuro OTT<br />&nbsp;
                            </Button>
                            <Button
                                className={this.state.template === 'facebook-landscape' ? 'template-active' : ''}
                                active={this.state.template === 'facebook-landscape' ? true : false}
                                onClick={() => {
                                    this.handleTemplateChange('facebook-landscape');
                                }}>
                                <FaIcon.FaFacebookOfficial size="35" />
                                <br />Full landscape<br />(16:9)
                            </Button>
                            <Button
                                className={this.state.template === 'facebook-square' ? 'template-active' : ''}
                                active={this.state.template === 'facebook-square' ? true : false}
                                onClick={() => {
                                    this.handleTemplateChange('facebook-square');
                                }}>
                                <FaIcon.FaFacebookOfficial size="35" />
                                <br />Square<br />(1:1)
                            </Button>
                            <Button
                                className={this.state.template === 'facebook-story' ? 'template-active' : ''}
                                active={this.state.template === 'facebook-story' ? true : false}
                                onClick={() => {
                                    this.handleTemplateChange('facebook-story');
                                }}>
                                <FaIcon.FaFacebookOfficial size="35" />
                                <br />Story<br />(9:16)
                            </Button>
                            <Button
                                className={this.state.template === 'facebook-vertical' ? 'template-active' : ''}
                                active={this.state.template === 'facebook-vertical' ? true : false}
                                onClick={() => {
                                    this.handleTemplateChange('facebook-vertical');
                                }}>
                                <FaIcon.FaFacebookOfficial size="35" />
                                <br />Vertical<br />(2:3)
                            </Button>
                            <Button
                                className={this.state.template === 'instagram-square' ? 'template-active' : ''}
                                active={this.state.template === 'instagram-square' ? true : false}
                                onClick={() => {
                                    this.handleTemplateChange('instagram-square');
                                }}>
                                <FaIcon.FaInstagram size="35" />
                                <br />Square<br />(1:1)
                            </Button>
                            <Button
                                className={this.state.template === 'instagram-story' ? 'template-active' : ''}
                                active={this.state.template === 'instagram-story' ? true : false}
                                onClick={() => {
                                    this.handleTemplateChange('instagram-story');
                                }}>
                                <FaIcon.FaInstagram size="35" />
                                <br />Story<br />(9:16)
                            </Button>
                            <Button
                                className={this.state.template === 'instagram-vertical' ? 'template-active' : ''}
                                active={this.state.template === 'instagram-vertical' ? true : false}
                                onClick={() => {
                                    this.handleTemplateChange('instagram-vertical');
                                }}>
                                <FaIcon.FaInstagram size="35" />
                                <br />Vertical<br />(4:5)
                            </Button>
                            <Button
                                className={this.state.template === 'twitter-post' ? 'template-active' : ''}
                                active={this.state.template === 'twitter-post' ? true : false}
                                onClick={() => {
                                    this.handleTemplateChange('twitter-post');
                                }}>
                                <FaIcon.FaTwitter size="35" />
                                <br />Twitter post<br />(2:1)
                            </Button>
                            <Button
                                className={this.state.template === 'twitter-square' ? 'template-active' : ''}
                                active={this.state.template === 'twitter-square' ? true : false}
                                onClick={() => {
                                    this.handleTemplateChange('twitter-square');
                                }}>
                                <FaIcon.FaTwitter size="35" />
                                <br />Square<br />(1:1)
                            </Button>
                        </Button.Group>
                    </div>
                </div>
            </div>
        );
    }
}

export default ImageCropComponent;
