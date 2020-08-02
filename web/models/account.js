const mongoose = require('mongoose');
const {SchemaTypes} = mongoose;
const {ObjectId} = SchemaTypes;

const AccountSchema = new mongoose.Schema(
    {
        userId: {
            type: ObjectId,
            ref: 'User',
            index: true,
        },
        providerType: {
            type: String,
        },
        providerId: {
            type: String,
            index: true,
        },
        providerAccountId: {
            type: String,
            index: true,
        },
        refreshToken: {
            type: String,
        },
        accessToken: {
            type: String,
        },
        accessTokenExpires: {
            type: Date,
        },
    },
    {
        timestamps: true,
    },
);

const AccountModel = mongoose.models.Account || mongoose.model('Account', AccountSchema);
module.exports = AccountModel;
