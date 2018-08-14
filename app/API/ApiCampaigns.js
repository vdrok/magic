import BaseApi from './BaseApi'

//Must be function instead of Object as Generators don't work with complex structure...I guess.
const ApiCampaigns = ()=>{

    const _api = BaseApi.api;

    const getCampaigns = () => {
        let queryParams = '';
        if(BaseApi.clientId){
            queryParams += '?clientId=' + BaseApi.clientId;
        }
        return _api.get('campaign' + queryParams);
    };

    const getCampaignPosts = (campaignId, page = 0, searchText = '') => {
        let url = `campaign/${campaignId}/content?page=${page}`;

        if (searchText && searchText.length) {
            url += '&query=' + searchText
        }

        return _api.get(url);
    };

    const getCampaignPostsSearch = (campaignId, searchText) => {
        let url = `campaign/${campaignId}/content`;

        if (searchText && searchText.length) {
            url += '?query=' + searchText
        }

        return _api.get(url)
    }

    const getCampaignAnalytics = (campaignId) => {
        return _api.get('campaign/' + campaignId + '/analytics');
    };

    const updateCampaign = (campaignId, data) => {
        return _api.patch('campaign/' + campaignId, data);
    };

    return {
        getCampaigns,
        getCampaignPosts,
        getCampaignAnalytics,
        getCampaignPostsSearch,
        updateCampaign
    }
};

export default ApiCampaigns();
