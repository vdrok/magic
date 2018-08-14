// @flow
import BaseApi from './BaseApi'
import type { DataChannelAnalytics } from '../Data/APIs'

//Must be function instead of Object as Generators don't work with complex structure...I guess.
const ApiAnalytics = () =>{

    const _api = BaseApi.api;

    const getChannelAnalytics = (period: string): DataChannelAnalytics => {
        let queryParams = '?period=' + period;
        if(BaseApi.clientId){
            queryParams += '&clientId=' + BaseApi.clientId;
        }
        return _api.get('analytics/channel' + queryParams);
    };



    return {
        getChannelAnalytics,
    }
};

export default ApiAnalytics();
