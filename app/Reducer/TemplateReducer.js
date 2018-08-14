import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

const { Types, Creators } = createActions({
    getTemplates: null,  //creates events name GET_EXAMPLE_API_DATA which we can map with reducers below
    getTemplatesResponse: ['templates'],
    createFromTemplate: ['template_id', 'questionary'],
    createFromTemplateResponse: ['campaign'],
    clearCampaign: null
})

const INITIAL_STATE = Immutable({
    list: [],
    categories: [],
    loading: false,
    createdCampaign: null
})

//reducers here
const setLoading = (state) =>
    state.merge({ loading: true })

const setTemplates = (state, { templates }) =>{

    //Find unique categories
    let cat = templates.map(item => item.category)
    cat = cat.filter((v,i) =>  cat.indexOf(v) == i );

    return state.merge({
        loading: false,
        list: templates,
        categories: cat,
    })
}

const createFromTemplate = state =>
    state.merge({
        loading: true,
        createdCampaign: null
    });

const createFromTemplateResponse = (state, {campaign}) =>
    state.merge({
        loading: false,
        createdCampaign: campaign
    });

const clearNewCampaign = (state) =>
    state.merge({
        createdCampaign: null
    });

const reducer = createReducer(INITIAL_STATE, {
    [Types.GET_TEMPLATES]: setLoading,
    [Types.GET_TEMPLATES_RESPONSE]: setTemplates,
    [Types.CREATE_FROM_TEMPLATE]: createFromTemplate,
    [Types.CREATE_FROM_TEMPLATE_RESPONSE]: createFromTemplateResponse,
    [Types.CLEAR_CAMPAIGN]: clearNewCampaign
})


export {
    reducer,
    INITIAL_STATE,
    Types,
    Creators
};