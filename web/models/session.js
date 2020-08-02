const mongoose = require('mongoose');
const {SchemaTypes} = mongoose;
const {ObjectId} = SchemaTypes;

const {randomBytes} = require('crypto');

const SessionSchema = new mongoose.Schema(
    {
        userId: {
            type: ObjectId,
            ref: 'User',
        },
        expires: {
            type: Date,
            default: Date.now,
        },
        sessionToken: {
            type: String,
            unique: true,
            default: () => {
                return randomBytes(64).toString('hex');
            },
        },
        accessToken: {
            type: String,
            unique: true,
            default: () => {
                return randomBytes(64).toString('hex');
            },
        },
    },
    {
        timestamps: true,
    },
);

const SessionModel = mongoose.models.Session || mongoose.model('Session', SessionSchema);
module.exports = SessionModel;
