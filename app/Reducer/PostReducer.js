import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { remove } from 'ramda'

const { Types, Creators } = createActions({
    setPosts: ['posts'],
    addPosts: ['posts'],
    removePost: ['post'],
    cleanPosts: null,
    updateCampaignPostResponse: ['post'],
});

const INITIAL_STATE = Immutable({
    postsList: []
});

const setPosts = (state, {posts}) =>
    state.merge({
        postsList: posts
    });


const addPosts = (state, {posts}) => {
    return state.merge({
        postsList: [
            ...state.postsList,
            ...posts
        ]
    })
}

const updatePost = (state, { post } ) => {
    return state.merge({
        postsList: state.postsList.map(
            (content, i) => content.id === post.id ? post : content
        )
    })
}

const removePost = (state, { post }) => {
    const index = state.postsList.indexOf(post);
    return state.merge({
        postsList: remove(index, 1, state.postsList)
    })
}

const cleanPosts = state =>
    state.merge({
      postsList: []
    });

const reducer = createReducer(INITIAL_STATE, {
    [Types.SET_POSTS]: setPosts,
    [Types.ADD_POSTS]: addPosts,
    [Types.CLEAN_POSTS]: cleanPosts,
    [Types.UPDATE_CAMPAIGN_POST_RESPONSE]: updatePost,
    [Types.REMOVE_POST]: removePost,
});


export {
    reducer,
    INITIAL_STATE,
    Types,
    Creators
};