var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var artistsSchema = mongoose.Schema({
    name: {type: String},
    displayImage: {type: String
});

module.exports = mongoose.model('artists', artistsSchema);;
