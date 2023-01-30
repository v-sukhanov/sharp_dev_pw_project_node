const {Schema, model} = require('mongoose');
const crypto = require('crypto');


const User = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

User.virtual('userId')
    .get(function () {
        return this._id;
    })

User.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};
User.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

User.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = crypto.randomBytes(32).toString('base64');
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._plainPassword;
    });


module.exports = model('User', User);