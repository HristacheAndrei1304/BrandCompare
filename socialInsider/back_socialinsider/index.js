const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const cors = require('cors')

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/brands', (req, res) => {
    const options = {
        url: "https://app.socialinsider.io/api",
        method: 'POST',
        headers: {
            'Content-Type': req.headers['content-type'],
            'Authorization': req.headers.authorization
        },
        body: {
            jsonrpc: req.body.jsonrpc,
            id: req.body.id,
            method: req.body.method,
            params: {
                projectname: req.body.params.projectname
            }
        },
        json: true
    };

    request(options, (error, response, body) => {
        if (error) throw new Error(error);
        res.send(body);
    });
});

app.post('/api/profiles', (req, res) => {
    // console.log(req)

    const options = {
        method: 'POST',
        url: "https://app.socialinsider.io/api",
        headers: {
            'Content-Type': req.headers['content-type'],
            'Authorization': req.headers.authorization
            // Pass through the authorization header from the frontend
        },
        body: {
            jsonrpc: req.body.jsonrpc,
            id: req.body.id,
            method: req.body.method,
            params: {
                id: req.body.params.id,
                profile_type: req.body.params.profile_type,
                date: {
                    start: req.body.params.date.start,
                    end: req.body.params.date.end,
                    timezone: req.body.params.date.timezone
                }
            },

        }, // Send only the relevant body data for request2
        json: true
    };
    request(options, (error, response, body) => {
        if (error) throw new Error(error);
        res.send(body);
    });
});

app.listen(3000, () => console.log('Server running on port 3000.'));