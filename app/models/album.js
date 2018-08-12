var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var albumsSchema = mongoose.Schema({
    artist: {type: Schema.Types.ObjectId, required: true},
    albumImage: {type: String},
});

module.exports = mongoose.model('albums', albumsSchema);;
