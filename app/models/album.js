var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var albumsSchema = mongoose.Schema({
    artist: {type: Schema.Types.ObjectId, required: true},
    description: {type: String},
    songs: [{type: Schema.ObjectId}],
    albumImage: {type: String},
});

module.exports = mongoose.model('albums', albumsSchema);
