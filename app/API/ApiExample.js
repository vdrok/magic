import BaseApi from './BaseApi'

//Must be function instead of Object as Generators don't work with complex structure...I guess.
const ApiExample = ()=>{

    const _api = BaseApi.api;

    const getExampleUserData = () => {
        return _api.get('users');
    }

    return {
        getExampleUserData,

    }
};

export default ApiExample();
