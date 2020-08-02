const mongoose = require('mongoose');

const VerificationRequestSchema = new mongoose.Schema(
    {
        identifier: {
            type: String,
        },
        token: {
            type: String,
            unique: true,
        },
        expires: {
            type: Date,
        },
    },
    {
        timestamps: true,
    },
);

const VerificationRequestModel =
    mongoose.models.VerificationRequest || mongoose.model('VerificationRequest', VerificationRequestSchema);

module.exports = VerificationRequestModel;
