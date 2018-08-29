var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var artistSchema = mongoose.Schema({
    stageName: {type: String, required: true},
    displayImage: {type: String},
    description: {type: String},
    albums: [{type: Schema.ObjectId}],

    // if Individual
    name: {type: String},
    born: {type: Date},

    // if Group
    isGroup: {type: Boolean},
    formationDate: {type: Date},
    groupMembers: [{
        name: {type: String},
        type: {type: String},
        reference: {type: Schema.ObjectId}
    }],

    // Internal
    _added: {type: Date, default: Date.now()},
    _approved: {type: Boolean, default: false}
});

module.exports = mongoose.model('artist', artistSchema);
