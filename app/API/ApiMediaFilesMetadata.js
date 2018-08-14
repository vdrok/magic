import BaseApi from './BaseApi';


const ApiMediaFilesMetadata = () => {
    const _api = BaseApi.api;



    const getLiveSportData = id => {
        return _api.get('media/'+id+'/metadata/live-sport' );
    };


    return {
        getLiveSportData,
    };
};

export default ApiMediaFilesMetadata();
