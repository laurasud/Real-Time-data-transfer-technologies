let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let dataSchema = new Schema({
    url: {type: String, required: true,},
    IP: {type: String, required: true,},
    time: {type: Date, required: true},
    mousepositionX: {type: Number, required: true},
    mousepositionY: {type: Number, required: true},
    count: {type: Number, required: true},
    created_at: Date
});

// on every save, add the date
dataSchema.pre('save', function (next) {
    let currentDate = new Date();

    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

//create model
let Data = mongoose.model('Data', dataSchema);

module.exports = Data;