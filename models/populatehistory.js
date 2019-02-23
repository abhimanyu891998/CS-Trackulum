var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var populatehistorySchema = new Schema({

    username: {type: String},
    text: {type: String},
    time: {type: String}

});

module.exports = mongoose.model('populatehistory',populatehistorySchema);