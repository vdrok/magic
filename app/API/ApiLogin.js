import BaseApi from './BaseApi'

//Must be function instead of Object as Generators don't work with complex structure...I guess.
const ApiLogin = ()=>{

    const _api = BaseApi.api;

    const login = (email, password) => {
        return _api.post('login',{
            '_username': email,
            '_password': password
        });
    };

    const register = (data) => {
        return _api.post('public/user', data);
    };

    const refreshToken = refresh_token => {
        return _api.post('token/refresh', {
            refresh_token
        });
    };

    const resetPasswordRequest = mail => {
        return _api.post('public/user/reset-password', {
            user: mail
        })
    };

    const verifyPin = (data) => {
        return _api.post('public/user/verify-confirmation-pin', data)
    };

    const verifyToken = (data) => {
        return _api.post('public/user/verify-confirmation-token', data)
    };

    const changePassword = plainPassword => {
        return _api.post('user/change-password', { plainPassword });
    };

    return {
        login,
        register,
        refreshToken,
        resetPasswordRequest,
        verifyPin,
        verifyToken,
        changePassword
    }
};

export default ApiLogin();
