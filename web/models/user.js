const config = require('../config');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
        },
        emailVerified: {
            type: Date,
        },
        image: {
            type: String,
        },
        videos: [{type: mongoose.SchemaTypes.Mixed}],
    },
    {timestamps: true},
);

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(config.saltRounds));
};

UserSchema.methods.genToken = function () {
    const expiresIn = config.jwtExpiry;
    const token = 'bearer ' + jwt.sign({_id: this._id, email: this.email}, config.jwtSecret, {expiresIn});
    return {token, expiresIn};
};

UserSchema.methods.toWeb = function () {
    let json = Object.assign({}, this._doc);
    delete json.password;
    delete json.email_token;
    return json;
};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
