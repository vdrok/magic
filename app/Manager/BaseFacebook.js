import React from 'react';


const PAGE = 'facebook-page',
    ACCOUNT = 'facebook-account';

export default class Facebook {

    static get Types() {
        return {
            PAGE,
            ACCOUNT
        };
    }

    static loginWithPermissions():Promise {
        throw new Error('method not implemented');
    }

    static getPages(): Promise {
        throw new Error('method not implemented');
    }

    static getProfile(): Promise {
        throw new Error('method not implemented');
    }
};
