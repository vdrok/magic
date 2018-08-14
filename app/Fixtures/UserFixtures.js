
export default{

    user: (mock) => {
        mock.onGet('user').reply(() => {
                return [200, {
                    username: 'Demo',
                    email: 'demo@demo.com',
                    name: 'Name',
                    id: 0,
                    clients: [
                        {
                            id: 1,
                            name: 'Client 1',
                            permissions: ["ROLE_ADMIN"]
                        },
                        {
                            id: 2,
                            name: 'Client 2',
                            permissions: ["ROLE_EDITOR"]
                        }
                    ]
                }]
            }
        );

        mock.onGet(/users/).reply(() => {
            let list = []
            const amount = 10

            for(let i =0; i < amount; i++) {
                list.push({
                    id: i,
                    username: 'username' + i,
                    email: 'mail' + i +'@mail.com',
                    name: 'name' + i,
                    clients: [
                        {
                            id: 1,
                            name: "Client 1",
                            permissions: ["ROLE_ADMIN"]
                        },
                        {
                            id: 2,
                            name: "Client 2",
                            permissions: ["ROLE_EDITOR", "ROLE_APPROVAL", "ROLE_ANALYTICS"]
                        }
                    ],
                    default_client: {
                        id: 1,
                        name: "Client 1",
                    }
                })
            }

            return [200, list]
        })

        mock.onPost('user/invite').reply((config) => {
            const {email, name, permissions } = JSON.parse(config.data)
            const id = Math.floor(Math.random() * 3000);

            return [200, {
                id: id,
                username: email,
                email: email,
                name: name,
                clients: [
                    {
                        id: 1,
                        name: "Client 1",
                        permissions: permissions
                    },
                    {
                        id: 2,
                        name: "Client 2",
                        permissions: permissions
                    }
                ],
            }]
        })

        mock.onPatch(/user\/\d+\/permissions/).reply(() => {
            return [204]
        })

        mock.onDelete(/user\/\d+\/client\/\d+/).reply(() => {
            return [204]
        })

        mock.onPost('client').reply((config) => {
            return [201]
        })
    }
}