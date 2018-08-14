import React from 'react';
import { connect } from 'react-redux';
import { withRouter} from 'react-router-dom';
import { path } from 'ramda';

import DropdownSelectorComponent from '../DropdownSelector/DropdownSelectorComponent.web';

import { Creators as MediaFolderAction } from '../../Reducer/MediaFolderReducer';
import { Creators as MediaFilesAction } from '../../Reducer/MediaFilesReducer';

class FolderSelector extends React.Component {
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
        return <DropdownSelectorComponent options={this.state.foldersList} onUpdateHandler={this.onUpdateHandler}/>;
    }

    onUpdateHandler(folderSelected) {
        if (!folderSelected || folderSelected.id === 0) {
            this.props.getMediaFiles();
            return;
        }

        this.props.getMediaFilesFolder(folderSelected.id);
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FolderSelector));