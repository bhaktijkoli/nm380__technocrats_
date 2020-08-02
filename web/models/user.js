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
        emailVerified: {
            type: Date,
        },
        image: {
            type: String,
        },
    },
    {timestamps: true},
);

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
