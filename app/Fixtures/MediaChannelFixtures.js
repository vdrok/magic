export default {

    all: (mock) => {
        mock.onGet(/media-channels[?.+]/).reply(() =>
            [200, [
                {
                    id: 6,
                    name: "Example Ooyala",
                    type: "ooyala"
                }
            ]]
        );
    }
}




