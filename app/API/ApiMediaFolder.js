import BaseApi from './BaseApi'

//Must be function instead of Object as Generators don't work with complex structure...I guess.
const ApiMediaFolder = ()=>{

    const _api = BaseApi.api;

    const getMediaFolders = () => {
        let queryParams = '';
        if(BaseApi.clientId){
            queryParams += '?clientId=' + BaseApi.clientId;
        }

        return _api.get('folders' + queryParams);
    };

    return {
        getMediaFolders,

    }
};

export default ApiMediaFolder();
