import { randomFromArray } from '../Helpers';

import moment from 'moment';
import type {AnalyticsChannel} from "../Data/APIs";

export function mockChannelAnalytics() {
    let list = [];
    const amount = Math.floor(Math.random() * 5) + 1;

    for (let i = 0; i < amount; i++) {

        let channel = generateChannel();
        const analytics = generateChannelAnalytics(7);
        channel['analytics'] = analytics;
        list.push(channel);
    }
    return list;
}

export default {
    all: mock => {
        mock.onGet(/analytics\/channel.+/).reply(() => {
            const list = mockChannelAnalytics();

            return [200, list];
        });


    }
};

const mediaTypeValues = [
    'facebook-page',
    'facebook-account',
    'twitter',
    'instagram-business'
];

const generateChannel = () => {
    return {
        id: Math.floor(Math.random() * 5),
        type: randomFromArray(mediaTypeValues),
        name: 'PEO_17',
        channel_id: 'channel_fb_1',
        thumbnail: 'https://placeimg.com/60/60/nature'
    };
};

function generateChannelAnalytics(days:number):AnalyticsChannel {

    let analytics = {};

    let summary = {
        "brutto_reach": 0,
        "nett_reach": 0,
        "shares": 0,
        "clicks": 0,
        "favourite": 0,
        "comments": 0
    }


    for (let i = 0; i < days; i++) {

        const date = moment().subtract(i,'day').format('Y-M-D');

        const values = {
            "brutto_reach": Math.floor(Math.random() * 100000),
            "nett_reach": Math.floor(Math.random() * 70000),
            "shares": Math.floor(Math.random() * 100),
            "clicks": Math.floor(Math.random() * 300),
            "favourite": Math.floor(Math.random() * 80),
            "comments": Math.floor(Math.random() * 10),
        }

        summary['brutto_reach'] += values['brutto_reach'];
        summary['nett_reach'] += values['nett_reach'];
        summary['shares'] += values['shares'];
        summary['clicks'] += values['clicks'];
        summary['favourite'] += values['favourite'];
        summary['comments'] += values['comments'];

        analytics[date] = values;
    }
    analytics['summary'] = summary;
    return analytics;
};
