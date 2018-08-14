import BaseApi from './BaseApi'

//Must be function instead of Object as Generators don't work with complex structure...I guess.
const ApiTemplate = ()=>{

    const _api = BaseApi.api;

    const getTemplates = () => {
        return _api.get('campaign-template');
    };

    const createFromTemplate = (data) => {
        const clientId = BaseApi.clientId ? BaseApi.clientId : null;
        return _api.post('campaign', {...data, clientId})
    };

    return {
        getTemplates,
        createFromTemplate
    }
};

export default ApiTemplate();
