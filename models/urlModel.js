'use strict'

const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const urlSchema = new mongoose.Schema({
    originalUrl: { // Don't specify incrementing field for better result with mongoose-sequence
        type: String,
        required: true
    }
});

urlSchema.plugin(AutoIncrement, {inc_field: 'shortUrl'}); // mongoose-sequence will create the specified field for you and start incrementing.

module.exports = mongoose.model('UrlModel', urlSchema);