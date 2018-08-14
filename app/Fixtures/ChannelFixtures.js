import FacebookManager from '../Manager/BaseFacebook'
export default{

    channels: (mock) => {

        mock.onGet(/publishing-channels(\?.+)/).reply(200,
            [
                {id: 1, type: 'facebook-page', name: 'PEO_17', channel_id: 'channel_fb_1', thumbnail: 'https://placeimg.com/60/60/nature'},
                {id: 2, type: 'instagram', name: 'John Brown', channel_id: 'channel_inst_1',thumbnail: 'https://placeimg.com/60/60/nature'},
                {id: 3, type: 'ott',name: 'europeanopen.com', channel_id: 'channel_levuro_1',  thumbnail: 'https://placeimg.com/60/60/nature'},
                {id: 4, type: 'facebook-account',name: 'facebook', channel_id: 'channel_fb_2' , thumbnail: 'https://placeimg.com/60/60/nature'},
                {id: 5, type: 'twitter', name: 'twitter', channel_id: 'channel_tw_1', thumbnail: 'https://placeimg.com/60/60/nature'},
                {id: 6, type: 'linkedin', name: 'linkedIn', channel_id: 'channel_li_1' ,thumbnail: 'https://placeimg.com/60/60/nature'},
                {id: 8, type: 'youtube', name: 'MyYouTubechannel', channel_id: 'youtube_1' ,thumbnail: 'https://placeimg.com/60/60/nature'}
            ]
        );


        mock.onPost('publishing-channels').reply((config)=> {
            let hash = Math.floor(Math.random() * 3009) + 1;
            const {type, id, name, access_token} = JSON.parse(config.data);
            if ( ![FacebookManager.Types.PAGE, FacebookManager.Types.ACCOUNT].includes(type)   ) {
                    return [401, {
                        message: 'Not supported channel',
                    }];
            } else {
                    return [201];
                }
        });

        mock.onGet(/publishing-channels\/\d+\/analytics/).reply(() => {
            let list = [];
                const amount = 30;

                for (let i = 0; i < amount; i++) {
                    list.push({
                        id: i,
                        channel_id: i,
                        date: `2018-01-${i + 1} 08:00:00`,
                        brutto_reach: Math.floor(Math.random() * 3000),
                        nett_reach: Math.floor(Math.random() * 3000),
                        followers: Math.floor(Math.random() * 3000),
                        comments: Math.floor(Math.random() * 3000),
                        shares: Math.floor(Math.random() * 3000),
                        favourite: Math.floor(Math.random() * 3000),
                        clicks: Math.floor(Math.random() * 3000)
                    });

                    list.push({
                        id: i,
                        channel_id: i,
                        date: null,
                        brutto_reach: Math.floor(Math.random() * 10000),
                        nett_reach: Math.floor(Math.random() * 10000),
                        followers: Math.floor(Math.random() * 10000),
                        comments: Math.floor(Math.random() * 10000),
                        shares: Math.floor(Math.random() * 10000),
                        favourite: Math.floor(Math.random() * 10000),
                        clicks: Math.floor(Math.random() * 10000),
                    })
                }

                return [200, list];
            }
        );

        mock.onGet(/publishing-channels\/\d+\/content\/analytics/).reply(() => {
                let list = [];
                const amount = Math.floor(Math.random() * 30) + 1;

                for (let i = 0; i < amount; i++) {
                    list.push({
                        id: i,
                        content_id: i,
                        date: `${Math.floor(Math.random() * 30) + 1} Oct 2012 12:00`,
                        brutto_reach: Math.floor(Math.random() * 3000),
                        nett_reach: Math.floor(Math.random() * 3000),
                        comments: Math.floor(Math.random() * 3000),
                        shares: Math.floor(Math.random() * 3000),
                        favourite: Math.floor(Math.random() * 3000),
                        clicks: Math.floor(Math.random() * 3000),
                        conversions: Math.floor(Math.random() * 3000)
                    });
                }

                return [200, list];
            }
        );

        mock.onGet(/publishing-channels\/\d+\/content/).reply(200,
            [
                {
                    "id": 0,
                    "status": 0,
                    "published_date": "2018-02-09T10:12:36.636Z",
                    "message": "Lorem ipsum",
                    "channel": {
                        "id": 0,
                        "type": "facebook-page",
                        "name": "Channel name",
                        "channel_id": "1",
                        "thumbnail": 'https://placeimg.com/60/60/nature'
                    },
                    "campaign": {
                        "id": 0,
                        "name": "Custom campaign name",
                        "start_date": "2018-02-09T10:12:36.636Z",
                        "end_date": "2018-02-09T10:12:36.636Z"
                    }
                },
                {
                    "id": 1,
                    "status": 4,
                    "published_date": "2018-02-09T10:12:36.636Z",
                    "message": "Lorem ipsum",
                    "channel": {
                        "id": 0,
                        "type": "facebook-page",
                        "name": "Channel name",
                        "channel_id": "1",
                        "thumbnail": 'https://placeimg.com/60/60/nature'
                    },
                    "campaign": {
                        "id": 0,
                        "name": "Custom campaign name",
                        "start_date": "2018-02-09T10:12:36.636Z",
                        "end_date": "2018-02-09T10:12:36.636Z"
                    }
                },
                {
                    "id": 2,
                    "status": 4,
                    "published_date": "2018-02-09T10:12:36.636Z",
                    "message": "Lorem ipsum",
                    "channel": {
                        "id": 0,
                        "type": "facebook-page",
                        "name": "Channel name",
                        "channel_id": "1",
                        "thumbnail": 'https://placeimg.com/60/60/nature'
                    },
                    "campaign": {
                        "id": 0,
                        "name": "Custom campaign name",
                        "start_date": "2018-02-09T10:12:36.636Z",
                        "end_date": "2018-02-09T10:12:36.636Z"
                    }
                },
                {
                    "id": 3,
                    "status": 3,
                    "published_date": "2018-02-09T10:12:36.636Z",
                    "message": "Lorem ipsum",
                    "channel": {
                        "id": 0,
                        "type": "facebook-page",
                        "name": "Channel name",
                        "channel_id": "1",
                        "thumbnail": 'https://placeimg.com/60/60/nature'
                    },
                    "campaign": {
                        "id": 0,
                        "name": "Custom campaign name",
                        "start_date": "2018-02-09T10:12:36.636Z",
                        "end_date": "2018-02-09T10:12:36.636Z"
                    }
                }
            ]
        );


    }
}




