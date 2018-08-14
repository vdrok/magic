import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import CampaignPostComponent from '../CampaignPostComponent.mob';
import { Provider } from 'react-redux';
import createStore from "../../../Redux/index.mob";
const {store, persisted} = createStore();
const navigation = { navigate: jest.fn() };

const post = {
    id: 0,
    status: "1",
    channel: {
        id: 1,
        type: 'twitter',
        name: 'PEO_17',
        channel_id: 'channel_fb_1',
        thumbnail: 'https://placeimg.com/60/60/nature'
    },
    message: "Speed up the process. Thereby, choosing the right business card design is important and require.",
    media: [
        {
            id: 0,
            name: "asd.mp4",
            thumbnail: "https://placeimg.com/640/480/nature?",
            type: 'video',
            mime_type: 'video/mp4',
            length: Math.floor(Math.random() * 5000) + 1,
            width: "1024",
            height: "768",
            size: "12332322",
            modified: "20-03-2017",
            folder_name: "My Media",
            owner: "Jon",
            tags: ["RedBull", "Nature"]
        }
    ],
    date: `1 Oct 2017 - 6 Dec 2017`,
    tipType: "EVENT",
    tip: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus ad alias asperiores atque autem blanditiis deserunt doloremque id illum impedit ipsam labore laboriosam magni maxime non odit, quibusdam similique velit.",
    estReach: Math.floor(Math.random() * 3000),
    estEngagement: Math.floor(Math.random() * 3000),
    estConversion: Math.floor(Math.random() * 3000)
};


it('renders correctly', () => {
    const tree = renderer.create(
        <Provider store={store} >
                <CampaignPostComponent post={post} showCampaign={false} isLastPost={false} deleteCallback={() => {}} editCallback={() => {}} navigation={navigation} />
        </Provider>
    )
})
