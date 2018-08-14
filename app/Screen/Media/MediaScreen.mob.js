import React from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { pathOr, findIndex, remove, propEq } from 'ramda';
import { View, Image, Button, ActivityIndicator, Platform, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

import { logo, getFilenameFromPath } from '../../Helpers';
import styles from './Style/MediaScreenStyle';
import colors from '../../Styles/Colors';

import FolderSelectorComponent from '../../Component/FolderSelector/FolderSelectorComponent.mob';
import SearchBarComponent from '../../Component/SearchBar/SearchBarComponent.mob';
import MediaElementComponent from '../../Component/MediaElement/MediaElementComponent.mob';
import Text from '../../Component/Text/TextComponent.mob';

import { Creators as MediaFilesAction } from '../../Reducer/MediaFilesReducer';
import Notification from '../../Component/Notification/Notification.mob';
import ImagePicker from 'react-native-image-picker';
import * as mime from 'react-native-mime-types';

import moment from 'moment';

class MediaScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const headerLeft = <Text style={styles.headerLeftTitle}>Media</Text>;

        const uploadHandler =
            navigation.state.params && navigation.state.params.uploadHandler
                ? navigation.state.params.uploadHandler
                : () => { };

        const headerRight = (
            <Button title="Upload" color={colors.LinkColor} onPress={uploadHandler} />
        );

        return {
            headerLeft,
            headerRight,
            title: <Image source={logo} style={styles.header_logo} />,
            tabBarLabel: 'Media',
            tabBarIcon: ({ tintColor }) => <Icon name="perm-media" size={30} color={tintColor} />
        };
    };

    static propTypes = {
        media: PropTypes.oneOfType([PropTypes.array, PropTypes.shape({})]),
        navigation: PropTypes.shape({
            state: PropTypes.shape({
                params: PropTypes.shape({})
            })
        })
    };

    constructor(props) {
        super(props);

        this.state = {
            media: [],
            refreshing: false,
            hasMore: false,
            selectedFolder: null
        };
    }

    componentWillMount() {
        this.props.navigation.setParams({
            uploadHandler: this.upload.bind(this)
        });
    }

    upload() {
        if (Platform.OS === 'android') {
            //return this._uploadAndroid();
        }

        //TODO on android we need to enable video upload
        const options = {
            title: 'Video or Image to upload',
            storageOptions: {
                skipBackup: true,
                path: 'images'
            },
            takePhotoButtonTitle: null,
            chooseFromLibraryButtonTitle: null,
            customButtons: [
                { name: 'photos', title: 'Select a photo' },
                { name: 'video', title: 'Select a video' }
            ],
            noData: true,
            mediaType: Platform.OS === 'ios' ? 'mixed' : 'image'
        };

        let that = this;
        ImagePicker.showImagePicker(options, response => {
            if (response.customButton) {
                //IOS
                const options = {
                    storageOptions: {
                        skipBackup: true,
                        path: 'images'
                    },
                    noData: true,
                    mediaType: response.customButton
                };
                const type = response.customButton === 'photos' ? 'image' : 'video';
                ImagePicker.launchImageLibrary(options, response => {
                    if (response.error) {
                        alert(
                            'You need to grant application permission to access your photo library'
                        );
                        return;
                    }

                    if (response.didCancel) {
                        return;
                    } else {
                        const uri = Platform.OS === 'ios' ? response.uri : response.path;
                        const mime_type = mime.lookup(uri);
                        //android doens't provide filename
                        const filename = response.fileName
                            ? response.fileName
                            : getFilenameFromPath(response.path);

                        that.props.upload(
                            type,
                            response.uri,
                            filename,
                            response.fileSize,
                            mime_type
                        );
                    }
                });
            }
        });
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            hasMore: newProps.hasMore,
            media: newProps.media,
            refreshing: pathOr(this.state.refreshing, ['refreshing'], newProps),
            selectedFolder: newProps.selectedFolder
        });
    }

    loadMore() {
        if (this.state.refreshing || !this.state.hasMore) return;
        this.props.getMediaFilesPage();
    }

    onRefresh() {
        this.setState({ refreshing: true });
        if (this.state.selectedFolder) {
            this.props.getMediaFilesFolder(this.state.selectedFolder);
        } else {
            this.props.getMediaFiles();
        }
    }

    render() {
        /** style={[styles.flexList, styles.list]}  */
        return (
            <View style={[styles.fullHeight, styles.container]}>
                <View style={[styles.container, styles.fullHeight]}>
                    <Notification />
                    <SearchBarComponent onSearchSubmit={this.runSearch.bind(this)} />
                    <FolderSelectorComponent />
                    {/* {this._renderLoader()} */}
                    <FlatList
                        numColumns={3}
                        keyExtractor={media => media.id}
                        data={this.state.media}
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh.bind(this)}
                        onEndReachedThreshold={0.5}
                        onEndReached={this.loadMore.bind(this)}
                        renderItem={e => (
                            <MediaElementComponent
                                key={e.item.id}
                                media={e.item}
                                selectMode={false}
                                isSelected={false}
                                selectCallback={this.goToPreview.bind(this)}
                            />
                        )}
                    />
                </View>
            </View>
        );
    }

    _renderLoader() {
        if (this.state.refreshing)
            return (
                <ActivityIndicator
                    size="large"
                    color={colors.green}
                    style={[styles.loader, { flex: 0, width: '100%' }]}
                />
            );
        return null;
    }

    goToPreview(media) {
        if(media.type  === 'live' && moment(media.start_time).isAfter(moment())){
            return;
        }

        return this.props.navigation.navigate('MediaPreview', {
            media
        });
    }

    runSearch(searchTerm) {
        this.props.searchMedia(searchTerm);
    }
}

const mapStateToProps = state => ({
    hasMore: state.media.hasMore,
    media: state.media.list,
    refreshing: state.media.loading,
    selectedFolder: state.media.selectedFolder
});

const mapDispatchToProps = dispatch => ({
    getMediaFilesPage: () => dispatch(MediaFilesAction.getMediaFilesPage()),
    getMediaFiles: () => dispatch(MediaFilesAction.getMediaFiles()),
    getMediaFilesFolder: (folderId) => dispatch(MediaFilesAction.getMediaFilesFolder(folderId)),
    upload: (type, uri, name, size, mime_type) => {
        return dispatch(MediaFilesAction.putMediaFile(type, uri, name, size, mime_type));
    },
    searchMedia: term => dispatch(MediaFilesAction.getSearchResult(term)),
});

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(MediaScreen));
