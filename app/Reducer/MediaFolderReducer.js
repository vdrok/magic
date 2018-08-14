import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { filter, propEq, reject} from 'ramda'

const { Types, Creators } = createActions({
    getMediaFolders: null,  //creates events name GET_EXAMPLE_API_DATA which we can map with reducers below
    getMediaFoldersResponse: ['folders'],
    clean: null,
});

const INITIAL_STATE = Immutable({
    list: [],
    loading: false,
});

const setLoading = (state) =>
    state.merge({ loading: true })

/**
 * search for the folder in the tree structure, recursive search
 * We assuming tree structure as
 * [{
 *   id:
 *   parent: null|parentId
 *   sub_folders: [
 *      {
 *      id:
 *      parent: parentId
 *      sub_folders: []
 *      }
 *   ]
 * }]
 *
 */
const findTheFolderInTree = (tree, folderId) => {
    let result = tree.filter((el, index) => {
        if(el.id === folderId){
            return el;
        }
        //if subfolders recursive
        if(el.sub_folders && el.sub_folders.length > 0){
            let found = findTheFolderInTree(el.sub_folders, folderId);
            if(found !== null){
                return found
            }
            return null;
        }

    });

    if(result && result.length > 0){
        return result[0];
    }
    return null;

}
/**
 * transfor API flat structure of folders to tree structure use in the app
 * @param state
 * @param folders
 */
const setMediaFolders = (state, { folders }) => {
    //add sub_folders
    folders.forEach((el) => el.sub_folders = []);
    // add all without parent
    let folderTreeStructure = filter(propEq('parentId', null))(folders);
    // remove them from the original list
    folders = reject(propEq('parentId', null))(folders);

    //add all children
    while (folders.length > 0){
        let parent = findTheFolderInTree(folderTreeStructure,folders[0].parentId);
        if(parent){
            parent.sub_folders.push(folders[0]);
            folders.splice(0,1);
        }
    }

    return state.merge({
        loading: false,
        list: folderTreeStructure
    });
}

const clean = state => state.merge(INITIAL_STATE)


const reducer = createReducer(INITIAL_STATE, {
    [Types.CLEAN]: clean,
    [Types.GET_MEDIA_FOLDERS]: setLoading,
    [Types.GET_MEDIA_FOLDERS_RESPONSE]: setMediaFolders,
});


export {
    reducer,
    INITIAL_STATE,
    Types,
    Creators
};