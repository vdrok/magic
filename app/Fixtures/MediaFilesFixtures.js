import moment from 'moment';

export const getExampleMediaResults = () => {
    let count = Math.floor(Math.random() * 10) + 3,
        result = [];

    //live
    result.push({
        id: 1224,
        name: "livestream",
        thumbnail: "https://placeimg.com/640/480/nature?1224",
        type: 'live',
        mime_type:  'application/x-mpegURL',
        length: null,
        width: null,
        height: null,
        size: null,
        status: 3,
        modified: "20-03-2017",
        folder_name: "Livestream",
        start_time: moment().subtract('2h').toISOString(),
        end_time: moment().add('1h').toISOString()
    });

    for (let i = 0; i < count; i++) {
        let hash = Math.floor(Math.random() * 3009) + 1;
        const isVideo = i % 2 === 0;
        const charset = "abcdefghijklmnopqrstuvwxyz"; //from where to create
        let name="";
        const nameLength = Math.floor(Math.random() * 36) + 1;
        for( let j=0; j < nameLength; j++ ){
            name += charset[Math.floor(Math.random() * charset.length)];
        }
        result.push({
            id: i,
            name: isVideo ? name +".mp4" : name +".jpg",
            thumbnail: "https://placeimg.com/640/480/nature?" + hash,
            type: isVideo ? 'video': 'image',
            mime_type: isVideo ? 'video/mp4': 'image/jpeg',
            length: Math.floor(Math.random() * 5000000) + 1,
            width: "1024",
            height: "768",
            size: "12332322",
            status: isVideo ? 3 : 2,
            modified: "20-03-2017",
            folder_name: "My Media",
            owner: "Jon",
            tags: ["RedBull", "Nature"]
        });
    }

    return [200,result];
};


export default{
    mediaFiles: (mock) => {
        mock.onGet(/media(\?.+)/).reply(getExampleMediaResults);

        mock.onPost('media').reply((config)=> {
            return  [200, {
                id: 3000,
                formInputs:{
                    "acl": "private",
                    "Content-Type": "image/png",
                    "key": "1_client_name_1/20171213_132435_test.mp3",
                    "X-Amz-Credential": "AKIAJSMYDW6A2QFT6DAQ/20171213/eu-west-1/s3/aws4_request",
                    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
                    "X-Amz-Date": "20171213T132436Z",
                    "Policy": "eyJleHBpcmF0aW9uIjoiMjAxNy0xMi0xM1QxMzoyOTozNloiLCJjb25kaXRpb25zIjpbeyJhY2wiOiJwcml2YXRlIn0seyJidWNrZXQiOiJkdW8tbWVkaWEifSxbInN0YXJ0cy13aXRoIiwiMjAxNzEyMTNfMTMyNDM1X3Rlc3QubXAzIiwiMV9jbGllbnRfbmFtZV8xXC8iXSx7IlgtQW16LURhdGUiOiIyMDE3MTIxM1QxMzI0MzZaIn0seyJYLUFtei1DcmVkZW50aWFsIjoiQUtJQUpTTVlEVzZBMlFGVDZEQVFcLzIwMTcxMjEzXC9ldS13ZXN0LTFcL3MzXC9hd3M0X3JlcXVlc3QifSx7IlgtQW16LUFsZ29yaXRobSI6IkFXUzQtSE1BQy1TSEEyNTYifV19",
                    "X-Amz-Signature": "0d54c8ae40246dd5bb2b5d03f85d9bd6dc5955ec20e6b3b20668f2d33c437a39"
                },
                formData:{
                    "action": "s3uploadpath",
                    "method": "POST",
                    "enctype": "multipart/form-data"
                }
            }];

        });


        mock.onPatch(/media\/\d+/).reply((config)=> {
            return  [200];

        });

        mock.onGet(/^media\/\d+$/).reply((config)=> {
            return  [200,{
                id: 0,
                name: "ok.jpg",
                thumbnail: "https://placeimg.com/640/480/nature?" ,
                type: 'image',
                mime_type: 'image/jpeg',
                length: Math.floor(Math.random() * 5000000) + 1,
                width: "1024",
                height: "768",
                status: 3,
                size: "12332322",
                modified: "20-03-2017",
                folder_name: "My Media",
                owner: "Jon",
                tags: ["RedBull", "Nature"]
            }];

        });

        mock.onDelete(/^media\/\d+$/).reply((config)=> {
            return  [204];
        });

        // artifical URL to simulate upload to s3
        mock.onPost('s3uploadpath').reply((config) => {
                    return [200];
        });

        mock.onPost(/media\/\d+\/copyToChannel\/\d+/).reply((config) => {
            return [200,
                {
                    id: 0,
                    name: "ok.jpg",
                    thumbnail: "https://placeimg.com/640/480/nature?" ,
                    type: 'image',
                    mime_type: 'image/jpeg',
                    length: Math.floor(Math.random() * 5000000) + 1,
                    width: "1024",
                    height: "768",
                    status: 3,
                    size: "12332322",
                    modified: "20-03-2017",
                    folder_name: "My Media",
                    owner: "Jon",
                    tags: ["RedBull", "Nature"],
                    ooyala: [
                        {
                            channel_name: "Ooyala",
                            channel_id: 1,
                            status: 2,
                            embed_code: 'asdasdad',
                            player_id: 'asdasd',
                            metadata: {
                                'externalId': 'test'
                            }
                        }
                    ]
                }
            ];
        });

        mock.onGet(/^media\/\d+\/url$/).reply((config) => {
            const id = parseInt( config.url.split('/')[1] );
            //this is video
            if( id % 2 === 0 ){
                return [200,"https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8"];
            }else{
                return [200,"https://placeimg.com/1024/1024/nature"];
            }
        });


        mock.onPost(/media\/\d+\/video\/create/).reply(() => {
            return [201];
        });

        mock.onPatch(/media\/\d+\/video\/create/).reply(() => {
            return [200];
        });

        mock.onPost(/media\/\d+\/video\/closer/).reply(() => {
            return [201];
        });

        mock.onGet(/media\/\d+\/video\/thumbnail/).reply(() => {
            return [200];
        });

        mock.onPost(/media\/\d+\/image\/create/).reply(() => {
            return [201];
        });

    }
}




