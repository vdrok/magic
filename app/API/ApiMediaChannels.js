import BaseApi from './BaseApi'

//Must be function instead of Object as Generators don't work with complex structure...I guess.
const ApiMediaChannels = () =>{

    const _api = BaseApi.api;

    const getAll = () => {
        let queryParams = '';
        if(BaseApi.clientId){
            queryParams += '?clientId=' + BaseApi.clientId;
        }

        return _api.get('media-channels' + queryParams);
    };

    return {
        getAll,

    }
};

export default ApiMediaChannels();
