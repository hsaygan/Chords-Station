var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var songsSchema = mongoose.Schema({
    title: {type:  String},
    artist: [{type: Schema.Types.ObjectId}],    //5b715da13eef7b7518590bd4
    featuredArtists: {tupe: Schema.Types.ObjectId},
    album: {type: Schema.Types.ObjectId, required: true},       //5b7360433fc193560cb828ae
    genre: {type: String},
    songImage: {type: String},
    youtubeLink: {type: String, unique: true, required: true},
    _added: {type: Date, default: Date.now()},
    _approved: {type: Boolean, default: false}
});

module.exports = mongoose.model('songs', songsSchema);
