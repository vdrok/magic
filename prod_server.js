const express = require('express')
const app = express()
const path = require('path');


app.use(express.static(path.resolve(__dirname, 'web/public')));

app.get('*', function(req, res) {

    if(typeof req.get('X-Forwarded-Proto') !== 'undefined' && req.get('X-Forwarded-Proto') !== 'https')  {
        return res.redirect('https://' + req.get('Host') + req.url);
    }
    else{
        res.sendFile(path.resolve(__dirname, 'web/public/index.html'));
    }
});

app.listen(3001, () => console.log('Engage listening on port 3001!'))