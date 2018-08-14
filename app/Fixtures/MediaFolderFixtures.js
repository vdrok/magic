export default{

    mediaFolders: (mock) => {
        mock.onGet(/folders[?.+]/).reply(200,
            [
                {
                    id: 1,
                    name: "My Assets",
                    icon: null,
                    parentId: null,
                    created_at: "2017-11-30T15:35:49.298Z",
                    updated_at: "2017-11-30T15:35:49.298Z"
                },
                {
                    id: 2,
                    name: "Drive",
                    icon: "drive",
                    parentId: null,
                    created_at: "2017-11-30T15:35:49.298Z",
                    updated_at: "2017-11-30T15:35:49.298Z",
                },

                {
                    id: 3,
                    name: "Folder 1",
                    icon: null,
                    parentId: 2,
                    created_at: "2017-11-30T15:35:49.298Z",
                    updated_at: "2017-11-30T15:35:49.298Z",
                },
                {
                    id: 5,
                    name: "Folder 4",
                    icon: null,
                    parentId: 3,
                    created_at: "2017-11-30T15:35:49.298Z",
                    updated_at: "2017-11-30T15:35:49.298Z",
                },
                {
                    id: 6,
                    name: "Folder 5",
                    icon: null,
                    parentId: 3,
                    created_at: "2017-11-30T15:35:49.298Z",
                    updated_at: "2017-11-30T15:35:49.298Z",
                },
                {
                    id: 7,
                    name: "Folder 6",
                    icon: null,
                    parentId: 3,
                    created_at: "2017-11-30T15:35:49.298Z",
                    updated_at: "2017-11-30T15:35:49.298Z",
                },
                {
                    id: 8,
                    name: "Folder 7",
                    icon: null,
                    parentId: 3,
                    created_at: "2017-11-30T15:35:49.298Z",
                    updated_at: "2017-11-30T15:35:49.298Z",
                },
                {
                    id: 4,
                    name: "Folder 2",
                    icon: null,
                    parentId: 2,
                    created_at: "2017-11-30T15:35:49.298Z",
                    updated_at: "2017-11-30T15:35:49.298Z",
                },
                {
                    id: 10,
                    name: "Dropbox",
                    icon: "dropbox",
                    parentId: null,
                    created_at: "2017-11-30T15:35:49.298Z",
                    updated_at: "2017-11-30T15:35:49.298Z",
                },
                {
                    id: 11,
                    name: "Levuro OTT",
                    icon: "levuro_ott",
                    parentId: null,
                    created_at: "2017-11-30T15:35:49.298Z",
                    updated_at: "2017-11-30T15:35:49.298Z",
                },
                {
                    id: 12,
                    name: "Ooyala",
                    icon: "ooyala",
                    parentId: null,
                    created_at: "2017-11-30T15:35:49.298Z",
                    updated_at: "2017-11-30T15:35:49.298Z",
                },
                {
                    id: 13,
                    name: "Youtube",
                    icon: "youtube",
                    parentId: null,
                    created_at: "2017-11-30T15:35:49.298Z",
                    updated_at: "2017-11-30T15:35:49.298Z",
                },
                {
                    id: 14,
                    name: "Zattoo",
                    icon: "zattoo",
                    parentId: null,
                    created_at: "2017-11-30T15:35:49.298Z",
                    updated_at: "2017-11-30T15:35:49.298Z",
                }
            ]
        );
    }
}




