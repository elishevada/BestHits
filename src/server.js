
const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    routers = require('./routes/route.js');
require('./db/mongoose')

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routers);

app.use('/list', express.static(path.join(__dirname, 'client/html/client.html')));
app.use('/js', express.static(path.join(__dirname, 'client/js')));
app.use('/css', express.static(path.join(__dirname, 'client/css')));
app.use('/html', express.static(path.join(__dirname, 'client/html')));

const server = app.listen(3001, () => {
    console.log('listening on port %s...', server.address().port);
});