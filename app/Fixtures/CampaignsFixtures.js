import { getExampleMediaResults } from './MediaFilesFixtures';
import { randomFromArray } from '../Helpers';

const titleValues = ['Europeanopen', 'PEO17', 'PEO18', 'Livestream'];
const stateValues = [1, 2, 3, 4];
const mediaTypeValues = [
    'facebook-page',
    'facebook-account',
    'twitter',
    'instagram',
    'instagram-business'
];
const postTypeValues = ['EVENT', 'INFLUENCER'];

import moment from 'moment';

export default {
    campaigns: mock => {
        mock.onGet(/campaign(\?.+)/).reply(() => {
            let list = [];
            const amount = Math.floor(Math.random() * 5) + 1;

            for (let i = 0; i < amount; i++) {
                list.push({
                    id: i,
                    name: 'PEO2017 Custom name',
                    publishing_content_count: 3,
                    publishing_content_drafts_count: 2,
                    start_date: moment().toISOString(),
                    end_date: moment().toISOString(),
                    type: 'Competition',
                    analytics: {
                        brutto_reach: 13232,
                        nett_reach: 3212,
                        shares: 2,
                        comments: 4,
                        clicks: 24,
                        favourite: 12,
                        conversions: 2
                    }
                });
            }

            return [200, list];
        });

        mock.onGet(/campaign\/\d+\/content/).reply(() => {
            let list = [];
            const amount = Math.floor(Math.random() * 30) + 1;

            list.push({
                id: 123123,
                status: randomFromArray(stateValues),
                channel: {
                    id: null,
                    type: randomFromArray(mediaTypeValues),
                    name: 'PEO_17',
                    channel_id: null,
                    thumbnail: null
                },
                message: 'This is without channel',
                media: getExampleMediaResults()[1],
                published_date: `${Math.floor(Math.random() * 30) + 1} Oct 2012 12:00`
            });

            for (let i = 0; i < amount; i++) {
                list.push({
                    id: i,
                    status: randomFromArray(stateValues),
                    channel: generateChannel(),
                    message:
                        'Speed up the process. Thereby, choosing the right business card design is important and require.',
                    media: getExampleMediaResults()[1],
                    published_date: `${Math.floor(Math.random() * 30) + 1} Oct 2012 12:00`,
                    tipType: randomFromArray(postTypeValues),
                    tip:
                        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus ad alias asperiores atque autem blanditiis deserunt doloremque id illum impedit ipsam labore laboriosam magni maxime non odit, quibusdam similique velit.',
                    estReach: Math.floor(Math.random() * 3000),
                    estEngagement: Math.floor(Math.random() * 3000),
                    estConversion: Math.floor(Math.random() * 3000)
                });
            }

            return [200, list];
        });

        mock.onGet(/campaign\/\d+\/analytics/).reply(() => {
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
        });

        mock.onPatch(/campaign\/\d+/).reply(() => {
            return [204];
        });
    }
};

const generateChannel = () => {
    return {
        id: Math.floor(Math.random() * 5),
        type: randomFromArray(mediaTypeValues),
        name: 'PEO_17',
        channel_id: 'channel_fb_1',
        thumbnail: 'https://placeimg.com/60/60/nature'
    };
};
