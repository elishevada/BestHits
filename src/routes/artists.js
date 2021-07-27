const Artist = require('../models/artist')
const Show = require('../models/show')
module.exports = {

    //read and check artist
    getArtistsFromInput: function(req, res) {
        Artist.find().then(artist => {
            var artists;
            try {
                //Sort the data by the artist name
                artists = Object.values(artist);

                artists.sort(function(a, b) {
                    return ('' + a.name).localeCompare(b.name);
                });
                // Sending the sorted data to the client
                res.send(artists);
            } catch (err) {
                res.status(500).send()
            }
        });
    },


    // create artist
    addArtist: function(req, res) {
        // ** Input integrity tests **

        // Check if the fields are valid
        var keys_list = ["id", "name", "birth_year", "link_profile_picture", "songs"]
        let index = 0;
        for (var i in Object.keys(req.body)) {
            var key = Object.keys(req.body)[i];
            if (!(key == keys_list[index])) {
                res.status(400).send("Bad-Request, Fileds invalid");
                return;
            }
            index++;
        }

        // Check if the ID number is 9 digits and contains only digit
        var regex = /^\d+$/;
        if (req.body.id.length != 9 || !regex.test(req.body.id)) {
            res.status(400).send("Bad-Request, ID is invalid");
            return;
        }

        // Check if name contains only letters in hebrew or english
        regex = /^[a-z\u05D0-\u05EA' ]+$/i;
        if (!regex.test(req.body.name)) {
            res.status(400).send("Bad-Request, Name is invalid");
            return;
        }

        // Check if the birth year contains 4 digits and isn't larger than the current year
        if (req.body.birth_year.length != 4 || req.body.birth_year > new Date().getFullYear()) {
            res.status(400).send("Bad-Request, Birth Year is invalid");
            return;
        }

        // Check if link_profile_picture is a valid url
        if (!isValidUrl(req.body["link_profile_picture"])) {
            res.status(400).send("Bad-Request, Link profile picture is invalid");
            return;
        }

        Artist.findOne({ id: req.body.id }, function(err, artist) {
            if (artist) {
                res.status(200).send("ID already exists, No changes were made");
                return;
            } else {
                // If it's OK - add the new artist to the DB
                const artist = new Artist(req.body);
                artist.save().then(artist =>
                    res.status(201).send(artist)
                ).catch(e => res.status(400).send(e))
            }
        })


    },

    //add song for an existing artist(update)
    add_artist_song: function(req, res) {

        const artId = parseInt(req.params['id']);
        const new_song = Object.keys(req.body)[0];

        // ** Input integrity tests **

        // Check if the artist ID isn't NaN
        if (isNaN(artId)) {
            res.status(400).send("Bad-Request, ID is invalid");
            return;
        }

        //Check if the body is empty
        if (req.body == null) {
            res.status(400).send("Bad-Request")
            return
        }

        // If it's OK - update the DB
        Artist.findOne({ id: artId }).exec().then(artist => {
            if (artist == null)
                res.status(404).send("the artist is not exist")
            else {

                //check if song alredy exist
                for (var song in artist.songs) {
                    if (artist.songs[song] == new_song) {
                        res.status(200).send("song alredy exist");
                        return;
                    }
                }
                artist.songs.push(new_song)
                artist.save((err) => {
                    if (err) {
                        console.log("in err")
                        res.status(400).send(err)
                        console.log(err)
                    } else
                        res.status(201).send("succesfull")

                })
            }
        }).catch(e => res.status(400).send(e))
    },

    //delete artist
    delete_artists: function(req, res) {
        const artID = parseInt(req.params['id']);

        // Check if ID is valid
        if (isNaN(artID)) {
            res.status(400).send("Bad-Request, In delete artist - ID is invalid)");
            return;
        }

        // If it's OK
        Artist.findOneAndDelete({ id: artID }, function(err) {
            if (err) {
                res.status(400).send(err);
                return;
            }
            res.status(201).send("succesfull")
        });
    },

    //delete song
    delete_artist_song: function(req, res) {

        const artID = parseInt(req.params['id']);
        var id_exists;
        // Check if ID is valid
        if (isNaN(artID)) {
            res.status(400).send("Bad-Request, In delete song - ID is invalid)");
            return;
        }
        Artist.findOne({ id: artID }).exec().then(artist => {
            if (artist == null)
                res.status(404).send("the artist is not exist")
            else {
                id_exists = false;
                for (var song in artist.songs) {
                    if (song == parseInt(Object.keys(req.body)[0])) {
                        artist.songs.splice(song, 1)
                        id_exists = true
                        artist.save((err) => {
                            if (err)
                                res.status(400).send(err)
                            else
                                res.status(201).send('succesfull')
                        })
                        break
                    }
                }
                if (!id_exists)
                    res.status(400).send("Bad-Request, In delete song, Song is not found")
            }
        }).catch(e => res.status(400).send(e))
    },

    addEvent: function(req, res) {
        const show = new Show(req.body)
            //checking:
            // Check if the fields are valid
        var parsedDate;
        var keys_list = ["name", "date", "location", "artists"]
        let index = 0;
        for (var i in Object.keys(req.body)) {
            var key = Object.keys(req.body)[i];
            if (key == 'date') {
                parsedDate = Date.parse((req.body)[key]);
                if (!(isNaN((req.body)[key]) && !isNaN(parsedDate))) {
                    res.status(400).send("Bad-Request, invalid date format");
                    return
                }
            }
            if (!(key == keys_list[index])) {
                res.status(400).send("Bad-Request, Fileds invalid");
                return;
            }
            index++;
        }

        if (index < 4) {
            res.status(400).send("Bad-Request, Fileds invalid");
            return
        }
        show.save().then(show =>
            res.status(201).send(show)
        ).catch(e => res.status(400).send(e))
    },

    getEvent: function(req, res) {
        Show.find().populate('artists').then(shows => res.send(shows)).catch(e => res.status(500).send())
    }

};


function isValidUrl(string) {
    try {
        new URL(string);
    } catch (_) {
        return false;
    }

    return true;
}