import React from 'react';
import { path } from 'ramda';
import { connect } from 'react-redux';

import DropdownSectionComponent from '../DropdownSelector/DropdownSelectorComponent.mob';

import { Creators as MediaFolderAction } from '../../Reducer/MediaFolderReducer';
import { Creators as MediaFilesAction } from '../../Reducer/MediaFilesReducer';

class FolderSelectorComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            foldersList: []
        };

        this.onUpdateHandler = this.onUpdateHandler.bind(this);
    }

    componentDidMount() {
        this.props.getMediaFolders();
    }

    componentWillReceiveProps({foldersList}){
        this.setState({
            foldersList: foldersList
        });
    }

    render() {
        return <DropdownSectionComponent options={this.state.foldersList} onUpdateHandler={this.onUpdateHandler}/>;
    }

    onUpdateHandler(folderId) {
        if (folderId === 0) {
            this.props.getMediaFiles();
            return;
        }

        this.props.getMediaFilesFolder(folderId);
    }
}


const mapStateToProps = state => ({
    foldersList: state.mediaFolders.list,
});

const mapDispatchToProps = dispatch => ({
    getMediaFolders: () => dispatch(MediaFolderAction.getMediaFolders()),
    getMediaFiles: () => dispatch(MediaFilesAction.getMediaFiles()),
    getMediaFilesFolder: (folderId) => dispatch(MediaFilesAction.getMediaFilesFolder(folderId))
});

export default connect(mapStateToProps, mapDispatchToProps)(FolderSelectorComponent);