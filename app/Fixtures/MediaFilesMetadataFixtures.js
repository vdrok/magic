export default {
    mediaFileMetadata: (mock) => {
        mock.onGet(/media\/\d+\/metadata\/live-sport/).reply((config) => {
            return [200,
                [{
                    id: 1,
                    time: 30,
                    type: 'score_change',
                    match_clock: "20:12",
                    commentaries: [{
                        text: 'GOAL GOAL GOAL 1:0',
                    }]
                },
                    {
                        id: 2,
                        time: 40,
                        type: 'yellow_card',
                        match_clock: "30:12",
                        commentaries: [{
                            text: 'Yellow card',
                        }]
                    },
                    {
                        id: 3,
                        time: 50,
                        type: 'red_card',
                        match_clock: "35:12",
                        commentaries: [{
                            text: 'Red card',
                        }]
                    },
                    {
                        id: 4,
                        time: 60,
                        type: 'other',
                        match_clock: "40:12",
                        commentaries: [{
                            text: 'Something happened',
                        }]
                    }

                ]
            ];
        });


    }
}




