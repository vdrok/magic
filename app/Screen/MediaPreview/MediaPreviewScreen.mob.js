import React from 'react';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import {
    Image,
    Button,
    ScrollView,
    Modal,
    TouchableWithoutFeedback,
    ImageBackground,
    View,
    Text,
    TextInput,
    ActivityIndicator,
    Platform,
    CameraRoll,
    PermissionsAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import prompt from 'react-native-prompt-android';

import { Toast } from 'native-base';
import APIMediaFile from '../../API/ApiMediaFiles';
import {
    CHANNEL_TYPES,
    TWITTER,
    logo,
    folder_icons,
    humanFileSize,
    getThumbnailUrl
} from '../../Helpers';
import ButtonComponent from '../../Component/Button/ButtonComponent.mob';
import VideoPlayer from '../../Component/VideoPlayer/VideoPlayer.mob';
import ImagePreview from '../../Component/ImagePreview/ImagePreview.mob';
import AddPostChannelsModalComponent from '../../Component/AddPostChannelsModal/AddPostChannelsModalComponent.mob';
import OoyalaDetails from '../../Component/MediaPreview/OoyalaDetails/OoyalaDetails.mob';
import MediaDeleteModalComponent from '../../Component/MediaDeleteModal/MediaDeleteModalComponent.mob';
import Colors from '../../Styles/Colors';
import styles from './Style/MediaPreviewScreenStyle';
import RNFetchBlob from 'react-native-fetch-blob';
import RNFS from 'react-native-fs';
import ProgressBar from 'react-native-progress/Bar';

class MediaPreviewScreen extends React.Component {
    static propTypes = {
        navigation: PropTypes.shape({
            state: PropTypes.shape({
                params: PropTypes.shape({
                    media: PropTypes.shape({}).isRequired
                })
            })
        })
    };

    static navigationOptions = ({ navigation }) => {
        const headerLeft = (
            <Button
                title="Back"
                onPress={() => {
                    navigation.navigate('MediaScreen');
                }}
            />
        );

        const { media } = navigation.state.params;
        const headerRight =
            media.type === 'video' || media.type === 'live' ? (
                <Button
                    title="Edit"
                    onPress={() =>
                        navigation.navigate(
                            'HeaderNav',
                            {},
                            {
                                type: 'Navigate',
                                routeName: 'VideoEditorScreen',
                                params: { media: media }
                            }
                        )
                    }
                />
            ) : (
                <Button
                    title="Edit"
                    onPress={() =>
                        navigation.navigate(
                            'HeaderNav2',
                            {},
                            {
                                type: 'Navigate',
                                routeName: 'ImageEditorScreen',
                                params: { media: media }
                            }
                        )
                    }
                />
            );

        return {
            headerLeft,
            headerRight,
            title: <Image source={logo} style={styles.header_logo} />,
            tabBarLabel: 'Media',
            tabBarIcon: ({ tintColor }) => <Icon name="perm-media" size={30} color={tintColor} />
        };
    };

    constructor(props) {
        super(props);

        const { media } = this.props.navigation.state.params;

        this.state = {
            media,
            preview: false,
            error: false,
            editName: false,
            name: media.name,
            showToast: false,
            isDownloading: false,
            downloadProgress: 0,
            isDownloadingThumbnail: false,
            downloadThumbnailProgress: 0,

            /* state for adding a closer */
            selectedCloser: [],
            showSaveModal: false,
            newName: media.name,
            errorCreate: null
        };

        this.promptEdit = this.promptEdit.bind(this);
        this.setCloser = this.setCloser.bind(this);
    }

    promptEdit() {
        if (this.state.editName) {
            return;
        }

        prompt(
            '',
            'Enter media name',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: name => this.updateMedia({ name }) }
            ],
            {
                type: 'plain-text',
                cancelable: false,
                defaultValue: this.state.name
            }
        );
    }

    updateMedia(params) {
        const data = {
            name: params.name ? params.name : this.state.media.name
        };

        this.setState({
            editName: true
        });

        APIMediaFile.updateMediaFile(this.state.media.id, data)
            .then(success => {
                this.setState({
                    editName: false,
                    name: data.name
                });
            })
            .catch(error => {
                this.setState({
                    editName: false,
                    error:
                        error.response.status === 400
                            ? error.response.data.message
                            : 'Error while saving. Please try again or contact tech support'
                });
            });
    }

    render() {
        return (
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ flexGrow: 1 }}
                scrollEnabled={!this.state.preview}
            >
                {this._renderPreview()}
                {this._renderThumbnail()}
                {this._renderFileInfo()}
                {this._renderFolder()}
                {/* {this._renderTags()} */}
                {this._renderButtons()}
                {this._renderMediaChannelsDetails()}
                {this._renderAddPostChannelsModal()}
                {this._renderMediaDeleteModal()}
                {this._renderSaveNewModal()}
            </ScrollView>
        );
    }

    _renderMediaChannelsDetails() {
        const { media } = this.state;
        if (media.type !== 'video') {
            return null;
        }
        return <OoyalaDetails ooyala={media.ooyala ? media.ooyala : []} mediaId={media.id} />;
    }

    _renderPreview() {
        if (!this.state.preview) return null;

        const player =
            this.state.media.type === 'video' || this.state.media.type === 'live' ? (
                <VideoPlayer
                    media={this.state.media}
                    onClose={() => this.setState({ preview: false })}
                />
            ) : (
                <ImagePreview
                    media={this.state.media}
                    onClose={() => this.setState({ preview: false })}
                />
            );
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.preview}
                onRequestClose={() => this.setState({ preview: false })}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.iconClose}>
                        <Icon
                            name="close"
                            size={30}
                            color={Colors.green}
                            onPress={() => this.setState({ preview: false })}
                        />
                    </View>
                    {player}
                </View>
            </Modal>
        );
    }

    _renderThumbnail() {
        if (this.state.preview) return null;

        const icon = this.state.media.type !== 'video' && this.state.media.type !== 'live' ? 'zoom-in' : 'play-arrow';
        return (
            <TouchableWithoutFeedback onPress={() => this.setState({ preview: true })}>
                <ImageBackground
                    source={{ uri: getThumbnailUrl(this.state.media) }}
                    style={styles.thumbnail}
                    resizeMode={Image.resizeMode.cover}
                >
                    <Icon
                        onPress={() => this.setState({ preview: true })}
                        name={icon}
                        size={70}
                        color={Colors.white}
                        style={styles.iconPlay}
                    />
                </ImageBackground>
            </TouchableWithoutFeedback>
        );
    }

    _renderFileInfo() {
        const { width, height, size, modified, mime_type, owner } = this.state.media;
        const resolution = width + 'x' + height;

        if (this.state.media.type === 'live') return null;

        return (
            <View style={styles.infoBox}>
                <View style={styles.infoHeading}>
                    <Text style={styles.headingText}>File Info</Text>
                </View>
                <View style={styles.infoWrapper}>
                    <View style={[styles.dataList, styles.justifyCenter]}>
                        {this._renderInfoField('Resolution', resolution)}
                        {this._renderInfoField('Size', humanFileSize(size))}
                    </View>

                    <View style={[styles.dataList, styles.justifyCenter]}>
                        {this._renderInfoField('Format', mime_type)}
                        {this._renderInfoField('Modified', null)}
                    </View>

                    <View style={[styles.dataList, styles.justifyCenter]}>
                        {this._renderInfoField('Owner', owner)}
                        {this._renderInfoField()}
                    </View>
                </View>
            </View>
        );
    }

    _renderInfoField(label = '', value = '') {
        label = label ? `${label}:` : '';
        return (
            <View style={[styles.dataList, styles.justifyCenter, styles.infoColumn]}>
                <Text style={[styles.infoText, styles.labelField]}>{label}</Text>
                <Text style={styles.infoText}>{value}</Text>
            </View>
        );
    }

    _renderFolder() {
        const folderIcon = folder_icons.folder;
        const { folder_name } = this.state.media;

        return (
            <View>
                <View style={styles.fileNameView}>
                    <View style={styles.fileNameContainer}>
                        <Text style={styles.fileName} onPress={this.promptEdit}>
                            {this.state.name}
                        </Text>
                    </View>
                    <View style={styles.fileNameEditContainer}>
                        {!this.state.editName && (
                            <Icon
                                name="edit"
                                size={25}
                                style={styles.fileNameEdit}
                                onPress={this.promptEdit}
                            />
                        )}
                        {this.state.editName && (
                            <ActivityIndicator size="small" style={styles.fileNameEdit} />
                        )}
                    </View>
                </View>
                {this.state.error && <Text style={styles.fileNameError}>{this.state.error}</Text>}
                <View style={[styles.dataList, styles.folderInfo]}>
                    <Image source={folderIcon} />
                    <Text style={styles.folderName}>{folder_name}</Text>
                </View>
            </View>
        );
    }

    _renderTags() {
        const { tags } = this.state.media;
        const tagsListJoined = tags ? tags.join(', ') : null;

        return (
            <View>
                <View style={[styles.dataList, styles.folderInfo]}>
                    <Icon name="label-outline" size={30} color={'#2AB45A'} />
                    <Text style={styles.folderName}>Tags</Text>
                </View>
                <Text style={styles.fileName}>{tagsListJoined}</Text>
            </View>
        );
    }

    _renderButtons() {
        const downloadButton = this.state.isDownloading ? null : (
            <ButtonComponent
                onPress={this.downloadMedia.bind(this)}
                style={styles.downloadButton}
                children="Download"
            />
        );

        const progressBar = !this.state.isDownloading ? null : (
            <View style={styles.progressBarWrapper}>
                <Text>Dowloading file...</Text>
                <ProgressBar progress={this.state.downloadProgress} color={Colors.LinkColor} />
            </View>
        );

        const downloadButtonSection =
            this.state.media.type === 'live' ? null : (
                <View style={styles.downloadButtonSection}>
                    {downloadButton}
                    {progressBar}
                </View>
            );

        return (
            <View>
                {this.state.media.type !== 'live' && (
                    <ButtonComponent
                        onPress={() => this.refs.addPostChannelsModal.show()}
                        style={styles.composeButton}
                        children="Compose"
                    />
                )}

                {this.state.media.type === 'video' && (
                    <ButtonComponent
                        onPress={this.goToChangeThumbnail.bind(this)}
                        style={styles.changeThumbnailButton}
                        children="Change Thumbnail"
                    />
                )}

                {downloadButtonSection}

                {this.state.media.type === 'video' && (
                    <View style={styles.downloadButtonSection}>
                        {!this.state.isDownloadingThumbnail && (
                            <ButtonComponent
                                onPress={this.downloadThumbnail.bind(this)}
                                style={styles.downloadButton}
                                children="Download Thumbnail"
                            />
                        )}
                        {this.state.isDownloadingThumbnail && (
                            <View style={styles.progressBarWrapper}>
                                <Text>Downloading thumbnail...</Text>
                                <ProgressBar
                                    progress={this.state.downloadThumbnailProgress}
                                    color={Colors.LinkColor}
                                />
                            </View>
                        )}
                    </View>
                )}

                {this.state.media.type === 'video' && (
                    <ButtonComponent
                        onPress={this.selectCloser.bind(this)}
                        style={styles.changeThumbnailButton}
                        children="Add closer"
                    />
                )}

                 <ButtonComponent
                    onPress={this.handleDelete.bind(this)}
                    style={[styles.dangerButton, styles.deleteButton]}
                    children="Delete"
                />
            </View>
        );
    }

    _renderAddPostChannelsModal() {
        return (
            <AddPostChannelsModalComponent
                onClick={this.goToCompose.bind(this)}
                ref="addPostChannelsModal"
            />
        );
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

    async requestPermissions() {
        try {
            const result = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Allow access to external storage',
                    message: 'Allow access to the external storage to download the media?'
                }
            );
            return result === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            //console.warn(err)
        }

        return false;
    }

    async downloadMedia() {
        const media = this.state.media;

        const response = await APIMediaFile.getDownloadUrl(this.state.media.id);

        const downloadUrl = response.data;

        if (Platform.OS === 'android') {
            // On Android, get the file via the built-in download manager
            const granted = await this.requestPermissions();
            if (!granted) {
                Toast.show({
                    text: 'The application does not have permission to download the media.',
                    duration: 3000
                });
                return;
            }
            const path = RNFetchBlob.fs.dirs.DownloadDir + '/' + media.name;
            const fetchConfig = {
                addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: false,
                    mime: media.mime_type,
                    path: path
                }
            };

            try {
                const response = await RNFetchBlob.config(fetchConfig).fetch('GET', downloadUrl);
            } catch (error) {
                Toast.show({
                    text: 'There was an error downloading "' + media.name + '"',
                    duration: 3000
                });
            }
        } else {
            // iOS
            const filePath = RNFS.DocumentDirectoryPath + '/' + media.name;

            this.setState({ isDownloading: true, downloadProgress: 0 });

            RNFS.downloadFile({
                fromUrl: downloadUrl,
                toFile: filePath,
                progress: async result => {
                    this.setState({ downloadProgress: result.bytesWritten / result.contentLength });

                    // downloadFile() doesn't have an "onComplete" event so we need to check this way
                    if (result.bytesWritten === result.contentLength) {
                        this.setState({ isDownloading: false });
                        const cameraRollUrl = await CameraRoll.saveToCameraRoll(
                            filePath,
                            media.type === 'video' ? 'video' : 'photo'
                        );
                        Toast.show({
                            text: '"' + media.name + '" has been saved on your phone.',
                            duration: 3000
                        });
                    }
                }
            });
        }
    }

    async downloadThumbnail() {
        const mediaThumbnail = `${this.state.media.name}.jpg`;
        const response = await APIMediaFile.getVideoThumbnail(this.state.media.id);

        if (Platform.OS === 'android') {
            // On Android, get the file via the built-in download manager
            const granted = await this.requestPermissions();
            if (!granted) {
                Toast.show({
                    text: 'The application does not have permission to download the media.',
                    duration: 3000
                });
                return;
            }
            const filePath = `${RNFetchBlob.fs.dirs.DownloadDir}/${mediaThumbnail}`;
            const fetchConfig = {
                addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: false,
                    mime: 'image/jpeg',
                    path: filePath
                }
            };

            try {
                const dowload = await RNFetchBlob.config(fetchConfig).fetch(
                    response.method,
                    response.url,
                    response.headers
                );
            } catch (error) {
                Toast.show({
                    text: 'There was an error downloading media thumbnail',
                    duration: 3000
                });
            }
        } else {
            // On iOS
            const fetchConfig = {
                fileCache: true,
                appendExt: 'jpg'
            };

            this.setState({
                isDownloadingThumbnail: true,
                downloadThumbnailProgress: 0
            });

            try {
                const dowload = await RNFetchBlob.config(fetchConfig)
                    .fetch(response.method, response.url, response.headers)
                    .progress({ interval: 100 }, (received, total) => {
                        this.setState({
                            downloadThumbnailProgress: Math.floor((received / total) * 100)
                        });
                    });

                const statusCode = dowload.info().status;

                if (statusCode === 200) {
                    const cameraRollSave = await CameraRoll.saveToCameraRoll(
                        dowload.path(),
                        'photo'
                    );

                    dowload.flush(); // remove temp file

                    this.setState({ isDownloadingThumbnail: false });

                    Toast.show({
                        text: `Media thumbnail has been saved on your phone.`,
                        duration: 3000
                    });
                } else {
                    throw new Error(`Invalid status code ${statusCode}`);
                }
            } catch (error) {
                Toast.show({
                    text: `There was an error downloading media thumbnail`,
                    duration: 3000
                });
            }
        }
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

        this.refs.addPostChannelsModal.close();
        this.props.navigation.navigate('PostCompose2Screen', {
            channel: channel,
            post: {
                media: [media]
            }
        });
    }

    goToChangeThumbnail() {
        const { media } = this.state;

        this.props.navigation.navigate(
            'HeaderNav3',
            {},
            {
                type: 'Navigate',
                routeName: 'VideoThumbnailScreen',
                params: { media: media }
            }
        );
    }

    handleDelete() {
        this.refs.mediaDeleteModal.getWrappedInstance().show();
    }

    handleDeleteCallback() {
        this.props.navigation.navigate('MediaScreen');
    }

    selectCloser() {
        this.props.navigation.navigate('MediaSelection', {
            customSubmitHandler: this.setCloser,
            channel: null,
            post: {
                media: []
            },
            campaign: null,
            rules: {
                types: ['video'],
                max: 1
            }
        });
    }

    setCloser(media) {
        if (!media || !media[0]) {
            alert(`You need to select a media`);
            return;
        }
        
        this.setState({
            showSaveModal: true,
            selectedCloser: media
        });
        return this.props.navigation.goBack(null);
    }

    handleAddCloserSave() {
        if (!this.state.selectedCloser[0]) {
            this.setState({
                saving: false,
                errorCreate: 'Please refresh the page and try again'
            });
            return;
        }

        this.setState({
            saving: true
        });
        APIMediaFile.createVideoCloser(
            this.state.media.id,
            this.state.selectedCloser[0].id,
            (this.state.newName ? this.state.newName : this.state.media.name)
        ).then(
            success => {
                this.setState({ showSaveModal: false, errorCreate: null });
                this.props.navigation.navigate('MediaScreen');
            },
            error => {
                this.setState({
                    saving: false,
                    errorCreate: 'Error while saving. Please try again or contact tech support'
                });
            }
        );
    }

    _renderSaveNewModal() {
        return (
            <Modal
                animationType={'fade'}
                visible={this.state.showSaveModal}
                transparent
                onRequestClose={() => this.setState({ showSaveModal: false, errorCreate: null })}
            >
                <View style={styles.modalContentWrapper}>
                    <View style={styles.modalContentContainer}>
                        <TouchableWithoutFeedback onPress={() => this.setState({ showSaveModal: false, errorCreate: null })}>
                            <View style={styles.modalCloseButton}>
                                <Text style={styles.modalCloseText}>X</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalHeading}>How to name the new with closer?</Text>
                            <Text>New video name</Text>
                            <TextInput
                                placeholder={this.state.media.name}
                                onChangeText={text => this.setState({ newName: text })}
                                value={this.state.newName}
                                autoCapitalize="none"
                                blurOnSubmit={true}
                                returnKeyType={'done'}
                                style={
                                    this.state.errorCreate
                                        ? [styles.modalInput, styles.modalInputError]
                                        : styles.modalInput
                                }
                            />
                            {this.state.errorCreate && (
                                <Text style={styles.modalErrorMessage}>{this.state.errorCreate}</Text>
                            )}
                            <ButtonComponent busy={this.state.saving}
                                onPress={() => this.handleAddCloserSave()}
                            >
                                <Text>Create new video</Text>
                            </ButtonComponent>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

export default withNavigation(
    connect(
        null,
        null
    )(MediaPreviewScreen)
);
