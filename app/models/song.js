var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var songsSchema = mongoose.Schema({
    title: {type:  String},
    album: {type: Schema.Types.ObjectId},
    featuredArtists: [{type: Schema.Types.ObjectId}],
    genre: {type: String},
    songImage: {type: String},
    youtubeLink: {type: String, unique: true, required: true},
    _added: {type: Date, default: Date.now()},
    _approved: {type: Boolean, default: false}
});

module.exports = mongoose.model('songs', songsSchema);
