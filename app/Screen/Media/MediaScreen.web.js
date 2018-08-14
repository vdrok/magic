import React from 'react';
import { connect } from 'react-redux';
import { withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import { pathOr, remove } from 'ramda';
import { Grid, Dimmer, Loader  } from 'semantic-ui-react'
import SearchComponent from '../../Component/SearchBar/SearchBarComponent.web';
import MediaElementComponent from '../../Component/MediaElement/MediaElementComponent.web';
import MediaUploadButtonComponent from '../../Component/MediaUploadButton/MediaUploadButton.web';
import FolderSelectorComponent from '../../Component/FolderSelector/FolderSelectorComponent.web';
import {Creators as MediaFilesAction} from '../../Reducer/MediaFilesReducer';
import InfiniteScroll from 'react-infinite-scroller';
import './Style/MediaScreen.scss';
import moment from 'moment';

class MediaScreen extends React.Component {

    static propTypes = {
        media: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.shape({})
        ])
    };

    constructor(props) {
        super(props);

        this.state = {
            media: [],
            refreshing: false,
            hasMore: true,
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            hasMore: newProps.hasMore,
            media: pathOr(this.state.media,['media'], newProps),
            refreshing: pathOr(this.state.refreshing,['refreshing'], newProps),
        });
    }

    loadMore(){
        if(this.state.refreshing || !this.state.hasMore) return;
        this.props.getMediaFilesPage();
    }

    render() {

        return <div>
            <Grid width={8}>
                <Grid.Row stretched={true}>
                    <Grid.Column width={8}>
                        <FolderSelectorComponent />
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <SearchComponent onSearchSubmit={this.runSearch.bind(this)}/>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <MediaUploadButtonComponent/>
                    </Grid.Column>
                </Grid.Row>
                { this.state.refreshing && <Grid.Row>
                    <Dimmer active inverted><Loader inverted>Refreshing</Loader></Dimmer>
                </Grid.Row> }
                <Grid.Row>
                    <InfiniteScroll
                        className='scroller'
                        pageStart={0}
                        loadMore={this.loadMore.bind(this)}
                        hasMore={this.state.hasMore}
                        initialLoad={false}
                        loader={<Loader key='scrollLoader'>Loading</Loader>}
                    >
                        <Grid columns={4} doubling stackable>

                            {this._renderElementsList()}

                            <Grid.Column key='media_load_more' stretched className='media_load_more'>
                                { !this.state.loading && this.state.hasMore && <button className="btn " onClick={this.loadMore.bind(this)}>Load more</button> }
                            </Grid.Column>

                        </Grid>

                </InfiniteScroll>
                </Grid.Row>
            </Grid>

        </div>;
    }

    _renderElementsList() {

        return this.state.media.map((media) => {
            return <Grid.Column key={media.id} stretched>

                <MediaElementComponent media={media}
                                       onSelectHandler={this.goToPreview.bind(this)}
                                       selected={false}
                                       selectMode={false}/>
            </Grid.Column>;
        });
    }

    goToPreview(media) {
        //If live event and not started don't let go go in
        if(media.type  === 'live' && moment(media.start_time).isAfter(moment())){
            return;
        }

        this.props.history.push('/media-preview', {
            media
        });
    }

    runSearch(searchTerm) {
        this.props.searchMedia(searchTerm)
    }
}

const mapStateToProps = state => ({
    hasMore: state.media.hasMore,
    media: state.media.list,
    refreshing: state.media.loading
});

const mapDispatchToProps = dispatch => ({
    getMediaFilesPage: page => dispatch(MediaFilesAction.getMediaFilesPage(page)),
    searchMedia: (term) => dispatch(MediaFilesAction.getSearchResult(term))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MediaScreen));