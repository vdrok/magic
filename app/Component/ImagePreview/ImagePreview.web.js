import React from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader, Image } from 'semantic-ui-react'

import './Style/ImagePreviewStyle.scss';
import API from '../../API/ApiMediaFiles'

/**
 * This component implement the default style for the text
 */
export default class ImagePreview extends React.Component {

    static propTypes = {
        media: PropTypes.shape({
            id: PropTypes.number.isRequired,
            thumbnail: PropTypes.string.isRequired,
        }).isRequired,
    }

    constructor(props){
        super(props)
        this.state = {
            source: null,
        }
    }


    componentDidMount() {
        const that = this;
        API.getFileUrl(this.props.media.id).then((r) => {
                if (r.status === 200) {
                    that.setState({
                        'source' : r.data
                    })
                }
            }
        );
    }



    render() {
        return <div >
                    <Dimmer active={!this.state.source}><Loader /></Dimmer>
                    {this.state.source && <Image src={this.state.source} /> }
                </div>

    }
}