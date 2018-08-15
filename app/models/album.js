var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var albumsSchema = mongoose.Schema({
    title: {type: String, required: true},
    artist: {type: Schema.Types.ObjectId},
    description: {type: String},
    releaseDate: {type: Date},
    songs: [{type: Schema.ObjectId}],
    albumImage: {type: String},
    _added: {type: Date, default: Date.now()},
    _approved: {type: Boolean, default: false}
});

module.exports = mongoose.model('albums', albumsSchema);
