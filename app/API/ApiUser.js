import BaseApi from './BaseApi'

//Must be function instead of Object as Generators don't work with complex structure...I guess.
const ApiUser = ()=>{

    const _api = BaseApi.api;

    const getLoggedInUser = () => {
        return _api.get('user');
    };

    const inviteMember = ({email, name, client, permissions}) => {
        return _api.post('user/invite', {
            email: email,
            name: name,
            clientId: client,
            permissions: permissions
        });
    }

    const getUsers = ({client}) => {
        return _api.get(`users?clientId=${client}`);
    }

    const updatePermissions = ({user, client, permissions}) => {
        return _api.patch(`user/${user}/permissions`, {
            clientId: client,
            permissions: permissions
        })
    }

    const removeAccess = ({user, client}) => {
        return _api.delete(`user/${user}/client/${client}`)
    }

    const newClient = ({name, client}) =>
        _api.post('client', {
            name: name,
            clientId: client
        })

    const createPushToken = ({pushToken}) =>
        _api.post('user/push-token', {
            pushToken: pushToken
        })

    const removePushToken = ({pushToken}) =>
        _api.delete(`user/push-token/${pushToken}`)

    return {
        getLoggedInUser,
        getUsers,
        inviteMember,
        updatePermissions,
        removeAccess,
        newClient,
        createPushToken,
        removePushToken
    }
};

export default ApiUser();
