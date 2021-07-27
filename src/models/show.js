const mongoose = require('mongoose')

var idvalidator = require('mongoose-id-validator')
    //create show schema
var ShowSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    artists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }],
}, { timestamps: true });
ShowSchema.plugin(idvalidator);
const Show = mongoose.model('Show', ShowSchema);

module.exports = Show