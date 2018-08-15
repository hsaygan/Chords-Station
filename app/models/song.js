var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var songsSchema = mongoose.Schema({
    title: {type:  Schema.Types.ObjectId},
    artist: [{type: Schema.Types.ObjectId}],
    album: {type: Schema.Types.ObjectId},
    genre: {type: String},
    songImage: {type: String},
    youtubeLink: {type: String, unique: true, required: true},
    _added: {type: Date, default: Date.now()},
    _approved: {type: Boolean, default: false}
});

module.exports = mongoose.model('songs', songsSchema);
