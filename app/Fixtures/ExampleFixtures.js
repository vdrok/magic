export default{

    example: (mock) => {
        mock.onGet('/users').reply(200,
            [
                { id: 1, name: 'John Smith' }
            ]
        );
    }
}




