import React from 'react';
import Facebook from './BaseFacebook'

const FBSDK = require('react-native-fbsdk');
const {
    LoginManager,
    AccessToken,
    GraphRequest,
    GraphRequestManager,
} = FBSDK;

export default class FacebookMobile  extends Facebook{


    static accessToken = null;

    constructor(){
        super()
    }

    static loginWithPermissions():Promise {
        return new Promise((resolve, reject) => {
            LoginManager.logInWithReadPermissions(['pages_show_list', 'read_insights']).then((result) => {
                LoginManager.logInWithPublishPermissions(['publish_pages']).then((result) => {
                    if (!result.isCancelled) {
                        resolve(result);
                    } else {
                        reject(result);
                    }
                }).catch((result) => reject(result) );

            }).catch((result) => reject(result))
        });
    }

    static loginWithInstagramPermissions():Promise {
        return new Promise((resolve, reject) => {
            LoginManager.logInWithReadPermissions(['instagram_basic', 'instagram_manage_insights']).then((result) => {
                LoginManager.logInWithPublishPermissions(['manage_pages']).then((result) => {
                    if (!result.isCancelled) {
                        resolve(result);
                    } else {
                        reject(result);
                    }
                }).catch((result) => reject(result))
            }).catch((result) => reject(result))

        });
    }

    /**
     * {
     *    id:
     *    name:
     *    description:
     *    access_token:
     *    thumbnail:
     * }
     * @returns {Promise}
     */
    static getPages(): Promise {
        return new Promise((resolve, reject) => {
                AccessToken.getCurrentAccessToken().then(
                    //TODO handle missing token

                    (data) => {
                        const infoRequest = new GraphRequest(
                            '/me/accounts',
                            {
                                parameters: {
                                    fields: {
                                        string: 'access_token,category,id,perms,picture,description,name'
                                    },
                                    access_token: {
                                        string: data.accessToken.toString() // put your accessToken here
                                    }
                                }
                            },
                            (error: ?Object, result: ?Object) => {
                                if (error) {
                                    reject(error);
                                } else {
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
                                }
                            }
                        );
                        new GraphRequestManager().addRequest(infoRequest).start();
                    });
        });
    }

    static getAccessToken(){
        return this.accessToken;
    }

    static getProfile(): Promise {
        return new Promise((resolve, reject) => {
            AccessToken.getCurrentAccessToken().then(
                //TODO handle missing token

                (data) => {
                    FacebookMobile.accessToken = data.accessToken.toString();
                    const infoRequest = new GraphRequest(
                        '/me',
                        {
                            parameters: {
                                fields: {
                                    string: 'id,picture,name'
                                },
                                access_token: {
                                    string: data.accessToken.toString() // put your accessToken here
                                }
                            }
                        },
                        (error: ?Object, result: ?Object) => {
                            if (error) {
                                reject(error);
                            } else {
                                const myProfile = {
                                    id: result.id,
                                    name: result.name,
                                    type: Facebook.Types.ACCOUNT,
                                    thumbnail: result.picture.data.url

                                }
                                resolve(myProfile);
                            }
                        }
                    );
                    new GraphRequestManager().addRequest(infoRequest).start();
                });
        });
    }

    static getInstagramBusinessAccount(page): Promise {
        return new Promise((resolve, reject) => {
            const infoRequest = new GraphRequest(
                '/' + page.id,
                {
                    parameters: {
                        fields: {
                            string: 'instagram_business_account{username, profile_picture_url}'
                        },
                        access_token: {
                            string: page.access_token.toString() // put your accessToken here
                        }
                    }
                },
                (error: ?Object, result: ?Object) => {
                    if (error) {
                        reject(error);
                    } else {
                        if(result.instagram_business_account) {
                            const account = {
                                pageName: page.name,
                                id: page.id,
                                name: result.instagram_business_account.username,
                                thumbnail: result.instagram_business_account.profile_picture_url,
                                access_token: page.access_token
                            }
                            resolve(account);
                        }

                        resolve(null)
                    }
                }
            );
            new GraphRequestManager().addRequest(infoRequest).start();
        });
    }
};
