const mongoose = require('mongoose')
    //create schema to artist
var ArtistSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    birth_year: {
        type: Number,
        required: true,
        trim: true
    },
    link_profile_picture: {
        type: String,
        required: true,
        trim: true
    },
    songs: [
        { type: String }
    ],
}, { timestamps: true });

const Artist = mongoose.model('Artist', ArtistSchema);

module.exports = Artist