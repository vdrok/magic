import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

const { Types, Creators } = createActions({
    getMediaFiles: null,
    getMediaFilesResponse: ['media_files'],
    getMediaFilesPage: null,
    getMediaFilesPageResponse: ['media_files'],
    updateMediaFile: ['mediaFile'],
    getSearchResult: ['text'],
    getMediaFilesFolder: ['selectedFolder'],
    putMediaFile: ['file_type', 'file', 'name', 'size','mime_type'],
    putMediaFileResponse: ['id' , 'file_type', 'name', 'size'],
    uploadMediaFile: ['id', 'content'],
    uploadMediaFileProgress: ['id', 'progress', 'stats', 'name'],
    uploadMediaFileCompleted: ['id'],
    postMediaFile: ['id', 'status'],
    deleteMediaFile: ['id'],
    deleteMediaFileResponse: ['response'],
    clean: null,
});

const INITIAL_STATE = Immutable({
    hasMore: true,
    pageLoaded: 0,
    searchQuery: null,
    list: [],
    loading: false,
    selectedFolder: null,
    uploading: [],
    responseDelete: null
});

const setStartUploading = (state,{id , file_type, name, size}) => {
    return state.merge({
        uploading: [
            ...state.uploading,
            {
                'id': id,
                'progress': 0,
                'name': name,
                'stats': null,
            }
        ]
    })
}


const setUploadProgress = (state, {id ,progress, stats, name}) => {
    const index = state.uploading.findIndex(v => v.id === id);
    if(index === -1){
        return state.merge({
            uploading: [
                ...state.uploading,
                {
                    'id': id,
                    'progress': progress,
                    'name': name,
                    'stats': stats,
                }
            ]
        })


    }
    //update
    return state.merge({ uploading: state.uploading.map((c, i) => i !== index ? c : {
            'id': id,
            'progress': progress,
            'stats': stats,
            'name': name,
        }) })
}

const setLoading = (state) =>
    state.merge({ loading: true, searchQuery: null, selectedFolder: null })

const setMediaFilesFolder = (state, {selectedFolder}) =>
    state.merge({
        loading: true,
        pageLoaded: 0,
        selectedFolder: selectedFolder !== 0 ? selectedFolder : null
    })

const setSearchTerm = (state, {text}) =>
    state.merge({
        loading: true,
        pageLoaded: 0, //new search terms reset pagination
        searchQuery: text
    })


const setMediaFiles = (state, {media_files}) => {
    const hasMore = media_files.length > 0;
    return state.merge({
        hasMore: hasMore,
        pageLoaded: 1,
        loading: false,
        list: media_files
    });
}

const addMediaFiles = (state, {media_files}) =>{

    const hasMore = media_files.length > 0;
    return state.merge({
        hasMore: hasMore,
        pageLoaded: state.pageLoaded + 1,
        list: [
            ...state.list,
            ...media_files
        ],
        loading: false
    });

}


const setUploadCompleted = (state, { id }) =>
    state.merge({
        uploading: state.uploading.filter(e => e.id !== id),
    });

const updateMediaFile = (state, { mediaFile }) =>
    state.merge({ list: state.list.map((m) => m.id !== mediaFile.id ? m : mediaFile) })

const clean = (state) => state.merge({
    ...INITIAL_STATE,
    ...state.uploading
})

const setDeleteMedia = (state) => {
    return state.merge({ loading: true, responseDelete: null });
}

const setDeleteMediaResponse = (state, {response}) => {
    return state.merge({ loading: false, responseDelete: response });
}

const reducer = createReducer(INITIAL_STATE, {
    [Types.CLEAN]: clean,
    [Types.GET_MEDIA_FILES]: setLoading,
    [Types.GET_MEDIA_FILES_RESPONSE]: setMediaFiles,
    [Types.GET_MEDIA_FILES_PAGE_RESPONSE]: addMediaFiles,
    [Types.GET_MEDIA_FILES_FOLDER]: setMediaFilesFolder,
    [Types.GET_SEARCH_RESULT]: setLoading,
    [Types.PUT_MEDIA_FILE_RESPONSE]: setStartUploading,
    [Types.UPLOAD_MEDIA_FILE_PROGRESS]: setUploadProgress,
    [Types.UPLOAD_MEDIA_FILE_COMPLETED]: setUploadCompleted,
    [Types.UPDATE_MEDIA_FILE]: updateMediaFile,
    [Types.GET_SEARCH_RESULT]: setSearchTerm,
    [Types.DELETE_MEDIA_FILE]: setDeleteMedia,
    [Types.DELETE_MEDIA_FILE_RESPONSE]: setDeleteMediaResponse,
});


export {
    reducer,
    INITIAL_STATE,
    Types,
    Creators
};