import {randomFromArray} from "../Helpers";
import {getExampleMediaResults} from "./MediaFilesFixtures";

export function getExamplePublishingContent(){
    return {
        id: 123123,
        status: 4,
        channel: {
            id: 1,
            type: 'instagram',
            name: 'PEO_17',
            channel_id: null,
            thumbnail: null
        },
        message: "This is without channel This is without channel This is without channel This is without channel",
        media: [
            {
                created_at: "2018-03-27T10:57:22+00:00",
                folder_name:"RomanceTVPolska",
                height : 1080,
                id: 2401,
                length : null,
                name : "18 Grzechy i grzeszki 5.png",
                size : 1611638,
                status : 2,
                thumbnail :"https://duo-thumbnails.s3.eu-west-1.amazonaws.com/media_gallery/14_romancetvpolska/20180327_105722_18_grzechy_i_grzeszki_5.jpg",
                type: "image",
                updated_at : "2018-03-27T10:57:27+00:00",
                width :1080
            }
        ],
        published_date: `${Math.floor(Math.random() * 30) + 1} Oct 2012 12:00`,

    }
}


export default{

    all: (mock) => {
        mock.onPost('publishing-content').reply(200,

        );
    },

    editCampaignPost: (mock) => {
        mock.onPut(/publishing-content\/\d+/).reply(() => {
            return [200,getExamplePublishingContent()];
        });
    },

    editCampaignStatus: (mock) => {
        mock.onPut(/publishing-content\/\d+\/status/).reply(() => {
            return [200,getExamplePublishingContent()];
        });
    },

    deleteCampaignPost: (mock) => {
        mock.onDelete(/publishing-content\/\d+/).reply(()=> {
            return [200];
        });
    }
}

