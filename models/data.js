var mongoose = require('mongoose');
var shortId = require('shortid');

mongoose.connect('mongodb://localhost/mapviewnote');

var Schema = mongoose.Schema;

var DataSchema = new Schema({

    lng: { type: String },
    lat: { type: String },
    description: { type: String },
    imageURL: { type: String },

    _id: { type: String, default: shortId.generate },

    created_at: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Data', DataSchema);
