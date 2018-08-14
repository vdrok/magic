import React from 'react';
import Facebook from './BaseFacebook'


export default class FacebookWeb extends Facebook{

    constructor(){
        super()
    }

    static loginWithPermissions():Promise {
        return new Promise((resolve, reject) => {
            FB.login(function(response) {
                if (response.status === 'connected') {
                    resolve(response);
                }
                else{
                    reject(response);
                }
            }, {scope: 'pages_show_list, publish_pages, read_insights'});
        });
    }

    static loginWithInstagramPermissions():Promise {
        return new Promise((resolve, reject) => {
            FB.login(function(response) {
                if(response.status === 'connected') {
                    resolve(response)
                } else {
                    reject(response)
                }
            }, {scope: 'manage_pages, instagram_basic, instagram_manage_insights'})
        })
    }

    static getAccessToken():Promise{
        return new Promise((resolve, reject) => {
            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    resolve(response.authResponse.accessToken);
                }
                reject();
            });
        });
    }

    static getPages():Promise {
        return new Promise((resolve, reject) => {
            FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                    const accessToken = response.authResponse.accessToken;
                    FB.api('/me/accounts', 'GET', {
                        access_token: accessToken,
                        fields: 'access_token,category,id,perms,picture,description,name'
                    },function(result){
                        if (!result || result.error) {
                            reject(result);
                            return;
                        }

                        let pages = [];
                        result.data.forEach((page)=>{
                            pages.push({
                                id: page.id,
                                name: page.name,
                                type: Facebook.Types.PAGE,
                                access_token: page.access_token,
                                category: page.category,
                                thumbnail: page.picture.data.url
                            });
                        })
                        resolve(pages);
                    });
                }else{
                    reject('not logged in');
                }
            } );
        });
    }

    static getProfile(): Promise {
        return new Promise((resolve, reject) => {
            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    const accessToken = response.authResponse.accessToken;
                    FB.api('/me', 'GET', {
                        access_token: accessToken,
                        fields: 'id,picture,name'
                    }, function (result) {
                        if (!result || result.error) {
                            reject(result);
                            return;
                        }

                        const myProfile = {
                            id: result.id,
                            name: result.name,
                            type: Facebook.Types.ACCOUNT,
                            thumbnail: result.picture.data.url

                        };
                        resolve(myProfile);

                    });
                }else{
                    reject('not logged in');
                }
            });
        });
    }

    static getInstagramBusinessAccount(page): Promise {
        return new Promise((resolve, reject) => {
            FB.api('/' + page.id, 'GET', {
                access_token: page.access_token,
                fields: 'instagram_business_account{username, profile_picture_url}'
            }, function (response) {
                if (!response || response.error) {
                    reject(response);
                    return;
                }

                if(response.instagram_business_account) {
                    const account = {
                        pageName: page.name,
                        id: page.id,
                        name: response.instagram_business_account.username,
                        thumbnail: response.instagram_business_account.profile_picture_url,
                        access_token: page.access_token
                    }

                    resolve(account);
                }

                resolve(null)

            })
        });
    }
};
