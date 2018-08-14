import { call, put } from 'redux-saga/effects'
import { path } from 'ramda'
import { Creators as TemplateActions } from '../Reducer/TemplateReducer'
import ApiTemplate from '../API/ApiTemplate'
import { callWithAuthToken } from './AuthSaga';

export function * fetchTemplates () {
    try{
        const response = yield callWithAuthToken(ApiTemplate.getTemplates);

        if (response.status === 200) {
            const templates = path(['data'], response);
            yield put(TemplateActions.getTemplatesResponse(templates));
        }
    }catch(e){
        //500 in the api
    }
}

export function * createFromTemplate(event) {
    try {
        let request = {
            ...event.questionary
        };

        if (event.template_id) {
            request.template_id = event.template_id;
        }

        const response = yield callWithAuthToken(ApiTemplate.createFromTemplate, request);

        if (response.status === 200) {
            const campaign = path(['data'], response);
            yield put(TemplateActions.createFromTemplateResponse(campaign))
        }
    } catch (e) {
        yield put(TemplateActions.createFromTemplateResponse(null))
    }
}