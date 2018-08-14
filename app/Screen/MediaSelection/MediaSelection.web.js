import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { pathOr, remove } from 'ramda';
import { Grid, Dimmer, Loader, Table, Header, Image, Icon, Button, Modal } from 'semantic-ui-react'
import { CHANNEL_TYPES, TWITTER } from '../../Helpers';
import SearchComponent from '../../Component/SearchBar/SearchBarComponent.web';
import MediaElementComponent from '../../Component/MediaElement/MediaElementComponent.web';
import FolderSelectorComponent from '../../Component/FolderSelector/FolderSelectorComponent.web';
import {Creators as MediaFilesAction} from '../../Reducer/MediaFilesReducer';
import InfiniteScroll from 'react-infinite-scroller';
import './Style/MediaScreen.scss';

class MediaSelection extends React.Component {

    static propTypes = {
        media: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.shape({})
        ]),
        selectedMedia: PropTypes.array.isRequired,
        updateMedia: PropTypes.func.isRequired,
        closeMedia: PropTypes.func,
        channel: PropTypes.shape({}),
        rules: PropTypes.shape({
            max: PropTypes.number,
            types: PropTypes.array // allowed media types
        })
    };

    constructor(props) {
        super(props);

        this.state = {
            media: [],
            selectedMedia: props.selectedMedia,
            refreshing: false,
            hasMore: true,
        };

        this.close = this.close.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }

    componentWillReceiveProps(newProps) {

        this.setState({
            hasMore: newProps.hasMore,
            media: pathOr(this.state.media,['media'], newProps),
            refreshing: newProps.refreshing,
        });
    }

    loadMore(){
        if(this.state.refreshing || !this.state.hasMore) return;

        this.props.getMediaFilesPage();
    }

    render() {

        return <Modal open={true} closeIcon className='media-selection' onClose={() => this.close()}>
            <Modal.Header className="media-selection-header">
                <Grid width={8}>
                    <Grid.Row stretched={true}>
                        <Grid.Column width={8}>
                            <FolderSelectorComponent />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <SearchComponent onSearchSubmit={this.runSearch.bind(this)}/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Header>
            <Modal.Content image scrolling>
                <InfiniteScroll
                            pageStart={0}
                            loadMore={this.loadMore.bind(this)}
                            hasMore={this.state.hasMore}
                            initialLoad={false}
                            useWindow={false}
                        >
                            <Grid columns={4} doubling stackable>
                                {this._renderElementsList()}
                                {this.state.refreshing && <Grid.Column key='loader' stretched>
                                    <Dimmer active inverted>
                                        <Loader inverted>Loading</Loader>
                                    </Dimmer>
                                </Grid.Column> }
                            </Grid>
                        </InfiniteScroll>
            </Modal.Content>
            <Modal.Actions>
                {this._renderSidebar()}
                <Button className="btn compose-save" onClick={this.submitHandler}>
                    Choose
                </Button>
            </Modal.Actions>

        </Modal>;
    }

    _renderSidebar() {

        return <div>
            <Table basic='very' celled collapsing className="swipe-menu-table">
                <Table.Body>
                    {this._renderSelectedList()}
                </Table.Body>
            </Table>
        </div>;
    }

    _renderSelectedList() {
        if(this.state.selectedMedia.length === 0){
            return <Table.Row>
                <Table.Cell>
                    <Header as='h4' image>
                        <Header.Content>
                            Nothing selected
                            <Header.Subheader>click on some media</Header.Subheader>
                        </Header.Content>
                    </Header>
                </Table.Cell>
            </Table.Row>
        }


        return this.state.selectedMedia.map((selectedMedia, index) => {
            return <Table.Row key={index}>
                <Table.Cell>
                    <Header as='h4' image>
                        <Image src={selectedMedia.thumbnail} size='mini' />
                        <Header.Content>
                            {selectedMedia.name}
                            <Header.Subheader>Folder: {selectedMedia.folder_name}</Header.Subheader>
                        </Header.Content>
                    </Header>
                </Table.Cell>
                <Table.Cell>
                    <Button onClick={() => this.onSelectHandler(selectedMedia)}>
                        <Icon name="close"/>
                    </Button>
                </Table.Cell>
            </Table.Row>
        })
    }

    _renderElementsList() {
        return this.state.media.map((media) => {
            return <Grid.Column key={media.id} stretched>

                <MediaElementComponent media={media}
                                       onSelectHandler={this.onSelectHandler.bind(this)}
                                       selected={this.isSelected(media)}
                                       selectMode={true}/>
            </Grid.Column>;
        });
    }

    onSelectHandler(media) {
        let mediaList = this.state.selectedMedia;
        const {rules, channel} = this.props;

        if (this.isSelected(media)) {
            let index = mediaList.indexOf(media);
            mediaList = remove(index, 1, mediaList);
        }
        else {
            if(rules && rules.types && rules.types.indexOf(media.type) === -1){
                alert(`Not supported type`);
                return;
            }
            if (rules && rules.max && mediaList.length >= rules.max) {
                alert(`You can select maximum ${rules.max} media`);
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
        });
    }

    isSelected(media) {
        return this.state.selectedMedia.filter(e => e.id === media.id).length === 1;
    }

    close(){
        if (this.props.closeMedia && typeof this.props.closeMedia === 'function') {
            this.props.closeMedia();
        } else {
            this.props.updateMedia(this.props.selectedMedia);
        }
    }

    submitHandler() {
        this.props.updateMedia(this.state.selectedMedia);
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
    getMediaFilesPage: page => dispatch(MediaFilesAction.getMediaFilesPage(page)),
    searchMedia: (term) => dispatch(MediaFilesAction.getSearchResult(term))
});

export default connect(mapStateToProps, mapDispatchToProps)(MediaSelection);