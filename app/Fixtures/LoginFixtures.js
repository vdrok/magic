export default{

    login: (mock) => {
        mock.onPost('login').reply((config)=>{
            const {_username, _password } = JSON.parse(config.data);
            if(_password === 'ok'){
                return [200, {
                    token: 'thisIsWorkingToken',
                    refresh_token: 'ThisIsValidRefreshToken'
                }];
            }else{
                return [ 401, {
                    code: 401,
                    message: "Bad credentials"
                }];
            }
        });

        mock.onPost('/public/user').reply(() => {
            return [201];
        });
    }
}




