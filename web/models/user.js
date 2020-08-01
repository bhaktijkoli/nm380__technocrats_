const {Schema, SchemaTypes, model} = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../models');
const UserSchema = new Schema(
    {
        name: {type: String, required: true, maxlength: 64},
        status: {type: String, enum: ['online', 'busy', 'away', 'offline'], default: 'online'},
        bio: {type: String, maxlength: 100},
    },
    {timestamps: true},
);

UserSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, config.saltRounds);
};

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.genToken = function () {
    return jwt.sign({id: this._id, email: this.email}, config.jwtSecret);
};

UserSchema.methods.toWeb = function () {
    const obj = ({_id, email} = this);
    return obj;
};

module.exports = model('User', UserSchema);
