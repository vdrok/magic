import API from '../API/BaseApi'

const MockAdapter = require('axios-mock-adapter');

const Fixtures = ()=> {
    let mock = null;

    const enableFixtures = (delay = 500) => {

        if(mock === null) {
            mock = new MockAdapter(API.api,
                {
                    delayResponse: delay
                });
        }

        mock.reset();

        const exampleFixtures = require('./ExampleFixtures').default;
        exampleFixtures.example(mock);
        const channelFixtures = require('./ChannelFixtures').default;
        channelFixtures.channels(mock);
        const mediaFolderFixtures = require('./MediaFolderFixtures').default;
        mediaFolderFixtures.mediaFolders(mock);
        const mediaFixtures = require('./MediaFilesFixtures').default;
        mediaFixtures.mediaFiles(mock);
        const LoginFixtures = require('./LoginFixtures').default;
        LoginFixtures.login(mock);
        const TemplateFixtures = require('./TemplateFixtures').default;
        TemplateFixtures.all(mock);
        TemplateFixtures.createFromTemplate(mock);
        const campaignFixtures = require('./CampaignsFixtures').default;
        campaignFixtures.campaigns(mock);
        const publishingFixtures = require('./PublishingFixtures').default;
        publishingFixtures.all(mock);
        publishingFixtures.editCampaignPost(mock);
        publishingFixtures.deleteCampaignPost(mock);
        publishingFixtures.editCampaignStatus(mock);
        const userFixtures = require('./UserFixtures').default;
        userFixtures.user(mock);

        const mediaChannelFixtures = require('./MediaChannelFixtures').default;
        mediaChannelFixtures.all(mock);

        const mediaMetadata = require('./MediaFilesMetadataFixtures').default;
        mediaMetadata.mediaFileMetadata(mock);

        const analytics = require('./AnalyticsFixtures').default;
        analytics.all(mock);

    }
    const disableFixtures = () => {
        if(mock){
            mock.restore();
            mock.reset();
            mock = null;
        }
    }
    return {
        enableFixtures,
        disableFixtures
    }
}

export default Fixtures();


