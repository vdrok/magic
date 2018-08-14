import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Header,
    Icon,
    Card,
    Container,
    Button,
    Image,
    Grid,
    Modal,
    Dropdown,
    Input,
    Form
} from 'semantic-ui-react';
import * as MdIcon from 'react-icons/lib/md';

import APIMediaFile from '../../API/ApiMediaFiles';
import {
    CHANNEL_TYPES,
    TWITTER,
    folder_icons,
    getThumbnailUrl,
    humanFileSize
} from '../../Helpers';
import VideoPlayer from '../../Component/VideoPlayer/VideoPlayer.web';
import ImagePreview from '../../Component/ImagePreview/ImagePreview.web';
import OoyalaDetails from '../../Component/MediaPreview/OoyalaDetails/OoyalaDetails.web';
import BackButtonComponent from '../../Component/BackButton/BackButtonComponent.web';
import ChannelIcon from '../../Component/ChannelIcon/ChannelIconComponent.web';
import ChannelActions from '../../Reducer/ChannelReducer';
import MediaSelection from '../../Screen/MediaSelection/MediaSelection.web';
import MediaElementComponent from '../../Component/MediaElement/MediaElementComponent.web';
import MediaDeleteModalComponent from '../../Component/MediaDeleteModal/MediaDeleteModalComponent.web';
import './Style/MediaPreviewScreenStyle.scss';

class MediaPreviewScreen extends React.Component {
    static propTypes = {
        location: PropTypes.shape({
            state: PropTypes.shape({
                media: PropTypes.shape({}).isRequired
            })
        })
    };

    constructor(props) {
        super(props);

        const { media } = this.props.location.state;

        this.state = {
            preview: false,
            downloadInProgress: false,
            downloadThumbnailInProgress: false,
            media,
            channels: [],
            saving: false,
            error: false,
            name: media.name,
            editName: false,
            /* state for adding a closer */
            selectedCloser: [],
            showMediaSelector: false,
            newName: media.name,
            errorCreate: null
        };
        this.updateMedia = this.updateMedia.bind(this);
        this.setCloser = this.setCloser.bind(this);
        this.closeCloser = this.closeCloser.bind(this);
    }

    componentDidMount() {
        this.props.getChannels();
    }

    componentWillReceiveProps({ channels }) {
        this.setState({
            channels: channels
        });
    }

    render() {
        return (
            <Grid className="page-settings" stackable>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <BackButtonComponent
                            onClickCallback={() => {
                                this.props.history.push('/media');
                            }}
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={8}>
                        {this._renderPreview()}
                        {this._renderThumbnail()}
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Header as="h3">File Info</Header>
                        {this._renderInfoList()}
                        {this._renderFolder()}
                        {/* {this._renderTags()} */}
                        {this._renderButtons()}
                        {this._renderMediaChannelsDetails()}
                        {this._renderMediaPopup()}
                        {this._renderSaveNewModal()}
                        {this._renderMediaDeleteModal()}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }

    _renderPreview() {
        const player =
            this.state.media.type === 'video' || this.state.media.type === 'live' ? (
                <VideoPlayer media={this.state.media} />
            ) : (
                <ImagePreview media={this.state.media} />
            );
        return (
            <Modal
                closeIcon="close"
                size="small"
                onClose={() => this.setState({ preview: false })}
                open={this.state.preview}
            >
                <Modal.Content>{player}</Modal.Content>
            </Modal>
        );
    }

    _renderThumbnail() {
        const icon =
            this.state.media.type === 'video' || this.state.media.type === 'live' ? (
                <Icon name="play" inverted={true} size="huge" />
            ) : (
                <Icon name="zoom" inverted={true} size="huge" />
            );

        return (
            <div className="thumbnail-wrapper" onClick={() => this.setState({ preview: true })}>
                <Image src={getThumbnailUrl(this.state.media)} />
                {icon}
            </div>
        );
    }

    _renderMediaChannelsDetails() {
        const { media } = this.state;
        if (media.type !== 'video') {
            return null;
        }
        return <OoyalaDetails ooyala={media.ooyala ? media.ooyala : []} mediaId={media.id} />;
    }

    _renderInfoList() {
        const { width, height, size, updated_at, mime_type, type } = this.state.media;

        if (type === 'live') return null;

        return (
            <dl className="row media-info">
                <dt className="col-sm-3">Resolution</dt>
                <dd className="col-sm-9">
                    {width} x {height}
                </dd>

                <dt className="col-sm-3">Size</dt>
                <dd className="col-sm-9">{humanFileSize(size)}</dd>

                <dt className="col-sm-3">Type</dt>
                <dd className="col-sm-9">{mime_type}</dd>
                {/*
            <dt className="col-sm-3">Owner</dt>
            <dd className="col-sm-9">{owner}</dd>


            <dt className="col-sm-3">Modified at</dt>
            <dd className="col-sm-9">{updated_at}</dd>
            */}
            </dl>
        );
    }

    _renderFolder() {
        const { folder_name } = this.state.media;

        return (
            <div>
                <div className="section-heading">
                    <img src={folder_icons.folder} alt="folder_icon" />
                    <p>{folder_name}</p>
                </div>
                {!this.state.editName && (
                    <p
                        className="section-value"
                        onClick={() => {
                            this.setState({ editName: true });
                        }}
                    >
                        {this.state.name}
                        <MdIcon.MdEdit size="15" className="name-edit-icon" />
                    </p>
                )}
                {this.state.editName && (
                    <div className="section-value">
                        <Input
                            value={this.state.name}
                            onChange={event =>
                                this.setState({
                                    name: event.target.value
                                })
                            }
                            action={
                                <Button
                                    content="Save"
                                    className="btn"
                                    loading={this.state.saving}
                                    onClick={this.updateMedia}
                                />
                            }
                        />
                        {this.state.error && <p className="error">{this.state.error}</p>}
                    </div>
                )}
                <br />
            </div>
        );
    }

    _renderTags() {
        const { tags } = this.state.media;
        const joinedTags = tags ? tags.join(', ') : null;

        return (
            <div>
                <div className="section-heading">
                    <i className="material-icons">label_outline</i>
                    <p>Tags</p>
                </div>
                <p className="section-value">{joinedTags}</p>
            </div>
        );
    }

    _renderButtons() {
        return (
            <div className="buttons-list">
                {this._renderAddPostList()}
                <Button className="btn" onClick={this.goToEdit.bind(this)}>
                    Edit
                </Button>
                {this.state.media.type === 'video' && (
                    <Button className="btn" onClick={this.goToChangeThumbnail.bind(this)}>
                        Change Thumbnail
                    </Button>
                )}
                {this.state.media.type !== 'live' && (
                    <Button
                        className="btn"
                        loading={this.state.downloadInProgress}
                        onClick={this.download.bind(this)}
                    >
                        Download
                    </Button>
                )}

                {this.state.media.type === 'video' && (
                    <Button
                        className="btn"
                        loading={this.state.downloadThumbnailInProgress}
                        onClick={this.downloadThumbnail.bind(this)}
                    >
                        Download Thumbnail
                    </Button>
                )}

                {this.state.media.type === 'video' && (
                    <Button className="btn" onClick={this.selectCloser.bind(this)}>
                        Add closer
                    </Button>
                )}

                <Button className="btn btn-danger" onClick={this.handleDelete.bind(this)}>
                    Delete
                </Button>
            </div>
        );
    }

    _renderAddPostList() {
        if (this.state.media.type === 'live') return;

        return (
            <Dropdown text="Compose" icon="plus" floating labeled button className="icon btn">
                <Dropdown.Menu>
                    {this.state.channels.map(channel => {
                        if (channel.type === CHANNEL_TYPES.OTT) {
                            return null;
                        }

                        const icon =
                            typeof channel.type === 'undefined' ? null : (
                                <div className="channel-icon">
                                    <ChannelIcon channel={channel.type} />
                                </div>
                            );

                        return (
                            <Dropdown.Item
                                onClick={() => this.goToCompose(channel)}
                                key={channel.id}
                            >
                                <Header>
                                    {icon} {channel.name}
                                </Header>
                            </Dropdown.Item>
                        );
                    })}
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    updateMedia() {
        const data = {
            name: this.state.name ? this.state.name : this.state.media.name
        };

        this.setState({
            saving: true
        });

        APIMediaFile.updateMediaFile(this.state.media.id, data)
            .then(success => {
                this.setState({
                    saving: false,
                    editName: false,
                    name: data.name
                });
            })
            .catch(error => {
                this.setState({
                    saving: false,
                    error:
                        error.response.status === 400
                            ? error.response.data.message
                            : 'Error while saving. Please try again or contact tech support'
                });
            });
    }

    goToCompose(channel) {
        const { media } = this.state;

        if (
            channel &&
            channel.type === CHANNEL_TYPES.TWITTER &&
            media.type === 'video' &&
            parseInt(media.length) &&
            parseInt(media.length) > TWITTER.VIDEO_MAX_LENGTH_MS
        ) {
            alert(
                `You can't select video longer than ${TWITTER.VIDEO_MAX_LENGTH_MS /
                    1000}s for Twitter`
            );
            return;
        }

        return this.props.history.push('/compose-post2', {
            channel: channel,
            post: {
                media: [media]
            }
        });
    }

    selectCloser() {
        this.setState({
            showMediaSelector: true
        });
    }

    closeCloser() {
        this.setState({
            showMediaSelector: false,
            showSaveModal: false,
            selectedCloser: []
        });
    }

    setCloser(media) {
        if (!media || !media[0]) {
            alert(`You need to select a media`);
            return;
        }

        this.setState({
            showMediaSelector: false,
            showSaveModal: true,
            selectedCloser: media
        });
    }

    handleAddCloserSave() {
        if (!this.state.selectedCloser[0]) {
            this.setState({
                saving: false,
                selectedCloser: [],
                errorCreate: 'Please refresh the page and try again'
            });
            return;
        }

        this.setState({
            saving: true
        });
        APIMediaFile.createVideoCloser(
            this.props.location.state.media.id,
            this.state.selectedCloser[0].id,
            this.state.newName
        ).then(
            success => this.props.history.push('/media'),
            error =>
                this.setState({
                    saving: false,
                    selectedCloser: [],
                    errorCreate: 'Error while saving. Please try again or contact tech support'
                })
        );
    }

    goToEdit() {
        const { media } = this.state;

        if (media.type === 'video' || media.type === 'live') {
            this.props.history.push('/video-editor', {
                media
            });
        } else {
            this.props.history.push('/image-editor', {
                media
            });
        }
    }

    goToChangeThumbnail() {
        const { media } = this.state;

        if (this.state.media.type === 'video') {
            this.props.history.push('/video-thumbnail', {
                media
            });
        }
    }

    download() {
        this.setState({
            downloadInProgress: true
        });
        const that = this;
        APIMediaFile.getDownloadUrl(this.state.media.id).then(url => {
            const link = document.createElement('a');
            link.href = url.data;
            link.download = this.state.media.name;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            //window.open(url.data, '_blank');
            that.setState({
                downloadInProgress: false
            });
        });
    }

    handleDelete() {
        this.refs.mediaDeleteModal.getWrappedInstance().show();
    }

    handleDeleteCallback() {
        this.props.history.push('/media');
    }

    downloadThumbnail() {
        this.setState({
            downloadThumbnailInProgress: true
        });

        const that = this;

        APIMediaFile.getVideoThumbnail(this.state.media.id).then(response => {
            let filename = `${this.state.media.name}.jpg`;
            const disposition = response.request.getResponseHeader('Content-Disposition');
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');

            // Use filename from "Content-Disposition" header
            if (disposition && disposition.indexOf('attachment') !== -1) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);

                if (matches !== null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, '');
                }
            }

            link.href = url;
            link.setAttribute('download', filename);
            link.click();
            window.URL.revokeObjectURL(url);

            that.setState({
                downloadThumbnailInProgress: false
            });
        });
    }

    _renderMediaDeleteModal() {
        return (
            <MediaDeleteModalComponent
                media={this.state.media}
                onSuccess={this.handleDeleteCallback.bind(this)}
                ref="mediaDeleteModal"
            />
        );
    }

    _renderMediaPopup() {
        if (!this.state.showMediaSelector) return null;

        return (
            <MediaSelection
                selectedMedia={this.state.selectedCloser}
                updateMedia={this.setCloser}
                closeMedia={this.closeCloser}
                channel={null}
                rules={{
                    types: ['video'],
                    max: 1
                }}
            />
        );
    }

    _renderSaveNewModal() {
        return (
            <Modal
                open={this.state.showSaveModal}
                closeIcon
                onClose={() => this.setState({ showSaveModal: false, errorCreate: null })}
            >
                <Modal.Header>How to name the new with closer?</Modal.Header>
                <Modal.Content>
                    <MediaElementComponent
                        media={this.state.selectedCloser[0]}
                        onSelectHandler={() => {}}
                        selected={false}
                        selectMode={false}
                    />

                    <Form loading={this.state.saving}>
                        <Form.Field required>
                            <label>New video name</label>
                            <input
                                name="name"
                                required
                                placeholder={this.props.location.state.media.name}
                                value={this.state.newName}
                                onChange={v => this.setState({ newName: v.target.value })}
                            />
                        </Form.Field>
                    </Form>
                    {this.state.errorCreate && <p className="error">{this.state.errorCreate}</p>}
                </Modal.Content>
                <Modal.Actions>
                    <Form.Button
                        disabled={this.state.saving}
                        onClick={() => this.handleAddCloserSave()}
                    >
                        Create new video
                    </Form.Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    channels: state.channel.list
});

const mapDispatchToProps = dispatch => ({
    getChannels: () => dispatch(ChannelActions.getChannels())
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(MediaPreviewScreen)
);
