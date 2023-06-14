const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
    title: {type: String, require: true},
    description: {type: String, require: true},
    date: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Note', NoteSchema);