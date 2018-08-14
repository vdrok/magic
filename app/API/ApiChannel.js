import axios from 'axios';
import BaseApi from './BaseApi';
import {serializeParams} from '../Helpers';

//Must be function instead of Object as Generators don't work with complex structure...I guess.
const ApiChannel = ()=>{

    const _api = BaseApi.api;

    const getChannels = () => {
        let queryParams = '';
        if(BaseApi.clientId){
            queryParams += '?clientId=' + BaseApi.clientId;
        }

        return _api.get('publishing-channels' + queryParams);
    };

    const addChannel = (data) => {
        const clientId = BaseApi.clientId ? BaseApi.clientId : null;

        return _api.post('publishing-channels',{
            'channelId': data.id,
            'name': data.name,
            'accessToken': data.access_token,
            'type': data.type,
            'isMobile': data.isMobile,
            clientId
        });
    };

    const getContent = (channelId, page = 0, searchText = '') => {
        let url = `publishing-channels/${channelId}/content?page=${page}`;

        if (searchText && searchText.length) {
            url += '&query=' + searchText
        }

        return _api.get(url);
    };

    const getChannelContentSearch = (channelId, searchText) => {
        let url = `publishing-channels/${channelId}/content`;

        if (searchText && searchText.length) {
            url += '?query=' + searchText
        }

        return _api.get(url)
    }

    const getTwitterAuthUrl = (callback_url) => {
        return _api.post('twitter-auth', {
            'callbackUrl': callback_url
        });
    };

    const getTwitterUserData = (data) => {
        return _api.post('twitter-access-token', {
            oauthToken: data.oauth_token,
            oauthTokenSecret: data.oauth_token_secret,
            oauthVerifier: data.oauth_verifier
        })
    };

    const getInstagramUserDataMobile = (token) => {
        return axios.get(`https://api.instagram.com/v1/users/self/?access_token=${token}`);
    };

    const getInstagramUserDataWeb = (options) => {
        let urlBase = 'https://api.instagram.com/v1/',
            callbackName = 'insta' + Math.round(new Date().getTime() / 1000) + Math.floor(Math.random() * 100);

        options = options || {};
        options.data = options.data || {};
        options.data.callback = callbackName;

        let queryString = serializeParams(options.data);

        if (options.url) {
            options.url = urlBase + options.url + '?' + queryString;

            window[callbackName] = function(data) {

                if (typeof options.success === 'function') {
                    options.success(data);
                }

                script.parentNode.removeChild(script);
                delete window[callbackName];
            };

            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = options.url;
            document.getElementsByTagName('body')[0].appendChild(script);

        }
    };

    const getChannelAnalytics = (data) => {
        return _api.get('publishing-channels/' + data.channelId + '/analytics?' + serializeParams(data.options))
    };

    const getChannelContentAnalytics = (channelId) => {
        return _api.get('publishing-channels/' + channelId + '/content/analytics')
    };

    const getYouTubeCategories = (channelId) => {
        return _api.get('publishing-channels/' + channelId + '/youtube/category')
    };

    return {
        getChannels,
        addChannel,
        getContent,
        getTwitterAuthUrl,
        getTwitterUserData,
        getInstagramUserDataMobile,
        getInstagramUserDataWeb,
        getChannelAnalytics,
        getChannelContentAnalytics,
        getChannelContentSearch,
        getYouTubeCategories,
    }
};

export default ApiChannel();
