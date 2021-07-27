
const express = require('express'),
    path = require("path"),
    art_routes = require('./artists');

var router = express.Router();

router.get('/', (req, res) => { res.sendFile(path.join(__dirname, '..', 'client/html/client.html')); });
router.get('/artists', art_routes.getArtistsFromInput);
router.post('/artists', art_routes.addArtist);
router.put('/songs/:id', art_routes.add_artist_song);
router.delete('/artists/:id', art_routes.delete_artists);
router.delete('/songs/:id', art_routes.delete_artist_song);
router.post('/event', art_routes.addEvent);
router.get('/event', art_routes.getEvent);

module.exports = router;