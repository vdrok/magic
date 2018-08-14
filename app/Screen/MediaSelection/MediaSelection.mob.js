import React from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { pathOr, findIndex, remove, propEq } from 'ramda';
import {ScrollView, View, Image, Button, ActivityIndicator, TouchableWithoutFeedback, Platform, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

import { logo, CHANNEL_TYPES, TWITTER } from '../../Helpers';
import styles from './Style/MediaScreenStyle';
import colors from '../../Styles/Colors';

import SwipeMenuComponent from '../../Component/SwipeMenu/SwipeMenu.mob';
import FolderSelectorComponent from '../../Component/FolderSelector/FolderSelectorComponent.mob';
import SearchBarComponent from '../../Component/SearchBar/SearchBarComponent.mob';
import MediaElementComponent from '../../Component/MediaElement/MediaElementComponent.mob';
import Text from '../../Component/Text/TextComponent.mob'

import {Creators as MediaFilesAction} from '../../Reducer/MediaFilesReducer';
import Notification from "../../Component/Notification/Notification.mob";

class MediaSelection extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const headerLeft = <Text style={styles.headerLeftTitle}>Media</Text>;
        const submitHandler = navigation.state.params && navigation.state.params.submitHandler ? navigation.state.params.submitHandler : () => {};

        const headerRight = <Button title="Done" color={colors.LinkColor} onPress={submitHandler} />

        return {
            headerLeft,
            headerRight,
            title: <Image source={ logo } style={styles.header_logo} />,
            tabBarLabel: 'Select media',
            tabBarIcon: ({ tintColor }) => (
                <Icon name="perm-media" size={30} color={tintColor } />
            ),
        };
    };

    static propTypes = {
        media: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.shape({})
        ]),
        navigation: PropTypes.shape({
            state: PropTypes.shape({
                params: PropTypes.shape({
                    channel:PropTypes.shape({}),
                    post:PropTypes.shape({
                        media: PropTypes.array.isRequired
                    }),
                    campaign:PropTypes.shape({}),
                    rules: PropTypes.shape({
                        types: PropTypes.array, // allowed media types
                        max: PropTypes.number
                    }),
                    customSubmitHandler: PropTypes.func
                })
            })
        })
    };

    constructor(props) {
        super(props);

        this.state = {
            media: [],
            selectedMedia: props.navigation.state.params.post.media,
            refreshing: false,
            hasMore: false,
        };
    }

    componentWillMount() {
            this.props.navigation.setParams({
                submitHandler: this.submitHandler.bind(this),
            });
        this.props.navigation.addListener(
            'didFocus',
            this.onFocus.bind(this)
        );
    }


    onFocus(){
        this.setState({
            selectedMedia: this.props.navigation.state.params.post.media
        })
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            hasMore: newProps.hasMore,
            media: newProps.media,
            refreshing: pathOr(this.state.refreshing,['refreshing'], newProps),
        });
    }

    loadMore(){
        if(this.state.refreshing || !this.state.hasMore) return;

        this.props.getMediaFilesPage();
    }

    render() {
        /** style={[styles.flexList, styles.list]}  */
        return <View style={[styles.fullHeight, styles.container]}>
            <View style={[styles.container, styles.fullHeight]}>
                <Notification/>
                <SearchBarComponent onSearchSubmit={this.runSearch.bind(this)}/>
                <FolderSelectorComponent/>
                {this._renderLoader()}
                <FlatList
                    numColumns={3}
                    keyExtractor={(media) => media.id}
                    data={this.state.media}
                    onEndReachedThreshold={0.5}
                    onEndReached={this.loadMore.bind(this)}
                    renderItem={e => <MediaElementComponent key={e.item.id}
                                                               media={e.item}
                                                               selectMode={true}
                                                               isSelected={this.isSelected(e.item)}
                                                               selectCallback={this.selectMedia.bind(this)}
                    />}
                />
            </View>
            {this._renderSelectedListSwipe()}
        </View>;
    }

    _renderLoader(){
         if(this.state.refreshing) return <ActivityIndicator size='large' color={colors.green} style={[styles.loader, { flex: 0, width: '100%', }]}/>
        return null;
    }


    _renderSelectedListSwipe() {

        return <SwipeMenuComponent expanded={true} style={{position: 'absolute', bottom: 0, width: '80%'}}>
            <ScrollView style={{maxHeight: 250}}>
                {this._renderSwipeElements()}
            </ScrollView>
        </SwipeMenuComponent>
    }

    _renderSwipeElements() {
        if (this.state.selectedMedia.length === 0)
            return <Text style={{textAlign: 'center', marginVertical: 10}}>Click on media to add</Text>

        return this.state.selectedMedia.map((media, index) => {
            return <View key={index} style={styles.swipeElement}>
                <Image source={{uri: media.thumbnail}} resizeMode={Image.resizeMode.contain} style={styles.elementImage}/>
                <Text style={styles.elementText}>{media.name}</Text>
                <TouchableWithoutFeedback onPress={() => this.selectMedia(media)}>
                    <Icon name="close" size={20} style={{paddingTop: 4, textAlign: 'right'}}/>
                </TouchableWithoutFeedback>
            </View>;
        });
    }

    selectMedia(media) {
        let { rules, channel } = this.props.navigation.state.params;
        let mediaList = this.state.selectedMedia;

        if (this.isSelected(media)) {
            let index = mediaList.indexOf(media);
            mediaList = remove(index, 1, mediaList);
        }
        else{
            if (rules && rules.max && mediaList.length >= rules.max) {
                alert(`You can select maximum ${rules.max} media`);
                return;
            }
            if (rules && rules.types && rules.types.indexOf(media.type) === -1) {
                alert(`Not supported type`);
                return;
            }
            if (channel && channel.type === CHANNEL_TYPES.TWITTER && media.type === 'video' && parseInt(media.length) && parseInt(media.length) > TWITTER.VIDEO_MAX_LENGTH_MS) {
                alert(`You can't select video longer than ${TWITTER.VIDEO_MAX_LENGTH_MS / 1000}s for Twitter`);
                return;
            }
            mediaList = mediaList.concat(media);
        }

        this.setState({
            selectedMedia: mediaList
        })
    }

    isSelected(mediaToTest) {
        return this.state.selectedMedia.filter(e => e.id === mediaToTest.id).length === 1;
    }



    submitHandler() {
        let {post, campaign, channel, customSubmitHandler} = this.props.navigation.state.params;
        post.media = this.state.selectedMedia;

        if (customSubmitHandler && typeof customSubmitHandler === 'function') {
            customSubmitHandler(this.state.selectedMedia);
        }
        else {
            return this.props.navigation.navigate('PostCompose2Screen', {
                post,
                campaign,
                channel
            });
        }
    }

    runSearch(searchTerm) {
        this.props.searchMedia(searchTerm)
    }
}

const mapStateToProps = state => ({
    hasMore: state.media.hasMore,
    media: state.media.list,
    refreshing: state.media.loading,
});

const mapDispatchToProps = dispatch => ({
    getMediaFilesPage: () => dispatch(MediaFilesAction.getMediaFilesPage()),
    getMediaFiles: () => dispatch(MediaFilesAction.getMediaFiles()),
    searchMedia: (term) => dispatch(MediaFilesAction.getSearchResult(term))
});

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(MediaSelection));