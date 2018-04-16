let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    domain: {type: String, required: true,},
    ip: {type: String, required: true, unique: true},
    _data: [{type: [Schema.ObjectId], ref: 'Data'}],
    created_at: Date
});

// on every save, add the date
userSchema.pre('save', function (next) {
    let currentDate = new Date();

    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

//create model
let User = mongoose.model('User', userSchema);

module.exports = User;
