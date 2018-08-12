var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var artistSchema = mongoose.Schema({
    name: {type: String},
    stageName: {type: String},
    displayImage: {type: String},
    description: {type: String},
    born: {type: Date},
    albums: [{type: Schema.ObjectId}]
});

module.exports = mongoose.model('artist', artistSchema);
