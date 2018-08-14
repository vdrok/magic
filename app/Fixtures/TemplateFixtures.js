export default{

    all: (mock) => {
        mock.onGet('/campaign-template').reply(200,
            [
                { id: 1, name: 'Boost audience', description: 'Optimize Content for your audience and boost it', image: null, category: 'Awareness', template_item_count: 1},
                { id: 2, name: 'Increase reach by players influence', description: 'Include athletes, players or stars social influence to spread the communication to new audiences', image: null, category: 'Awareness', template_item_count: 1 },
                { id: 3, name: 'Run contests, collect leads and followers', description: 'Engage fans with a price, generate leads for direct marketing', image: null, category: 'Engagement', template_item_count: 1 },
                { id: 4, name: 'Increase livestream viewership', description: 'If you provide the stream from the event make sure you reach as many viewers as possible', image: null, category: 'Engagement', template_item_count: 0 },
                { id: 5, name: 'Convert viewers to subscribers', description: 'If you provide an exclusive content available only for subscribers create campaign to increase conversion', image: null, category: 'Conversion', template_item_count: 0 },
                { id: 6, name: 'Reduce subscription churn', description: 'Listen to your consumers and launch retention campaign before they leave', image: null, category: 'Conversion' },

            ]
        );
    },

    createFromTemplate: (mock) => {
        mock.onPost('/campaign').reply((config) => {
            const { name } = JSON.parse(config.data);

            if( name !== 'fail'){
                return [200, {
                    id: 3,
                    name: name,
                    price: `${Math.floor(Math.random() * 700) + 250} CHF`,
                    date: `${Math.floor(Math.random() * 30) + 1} Oct 2017 - ${Math.floor(Math.random() * 30) + 1} Dec 2017`,
                    type: 'Competition'
                }];
            }else{
                return [ 400, {
                    code: 400,
                    message: "Bad request"
                }];
            }


        });
    }
}




