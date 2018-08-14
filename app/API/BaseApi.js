import axios from 'axios'

class BaseApi {

    _baseURL = process.env.API_URL;
    _api = null;
    _clientId = null;
    constructor(){
        if(!this._api){
            const baseURL = process.env.API_URL;
            this._api = axios.create({
                baseURL,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                timeout: 60000,
            });

            if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test'){
                return;
            }

            this._api.interceptors.request.use(function (config) {
                console.log('%cREQUEST: '+config.method.toUpperCase() + ' %c'+ config.baseURL + config.url ,  'color: blue; font-weight: bold;', 'color: black;font-weight: normal;', config.data, config.headers);
                return config;
            }, function (error) {
                console.log('%cREQUEST: '+error , 'color: red; font-weight: bold;');
                return Promise.reject(error);
            });

            this._api.interceptors.response.use(function (response) {
                console.log('%cRESPONSE: '+response.status + ' %c'+  response.config.url,  'color: blue; font-weight: bold;', 'color: black;font-weight: normal;', response.data);
                return response;
            }, function (error) {
                console.log('%cRESPONSE: '+error , 'color: red; font-weight: bold;');
                return Promise.reject(error);
            });
        }
    }

    get baseUrl(){
        return this._baseURL;
    }

    get api(){
        return this._api;
    }

    get authToken(){
        return this._api.defaults.headers.common['Authorization'];
    }

    set authToken(token){
        if(token === null){
            delete this._api.defaults.headers.common['Authorization'];
            return;
        }
        this._api.defaults.headers.common['Authorization'] = "Bearer "+token;
    }

    get clientId(){
        return this._clientId;
    }

    set clientId(clientId){
        this._clientId = clientId;
    }

}

export default new BaseApi;
