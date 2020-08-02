const {createHash} = require('crypto');

const User = require('../models/user');
const Account = require('../models/account');
const Session = require('../models/session');
const VerificationRequest = require('../models/verification-request');

const {getConnection, connect} = require('./index')();
const {ObjectId} = require('mongoose').SchemaTypes;

const Adapter = (config, options = {}) => {
    function _debug(...args) {
        if (options.debug) {
            console.log('[next-auth][debug]', ...args);
        }
    }
    const defaultSessionMaxAge = 30 * 24 * 60 * 60 * 1000;
    const sessionMaxAge =
        options && options.session && options.session.maxAge ? options.session.maxAge * 1000 : defaultSessionMaxAge;
    const sessionUpdateAge = options && options.session && options.session.updateAge ? options.session.updateAge * 1000 : 0;
    let connection = null;
    async function getAdapter(options) {
        // Display debug output if debug option enabled

        async function _connect() {
            connection = getConnection();
            if (!connection) {
                console.log('Connecting again...');
                try {
                    connection = await connect();
                } catch (error) {
                    console.error(error);
                }
            }
        }

        await _connect();

        async function createUser(profile) {
            _debug('createUser', profile);
            try {
                return await new User({
                    name: profile.name,
                    email: profile.email,
                    image: profile.image,
                    emailVerified: profile.emailVerified,
                }).save();
            } catch (error) {
                return Promise.reject(error);
            }
        }

        async function getUser(id) {
            _debug('getUser', id);
            try {
                return await User.findOne({_id: id});
            } catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        }

        async function getUserByEmail(email) {
            _debug('getUserByEmail', email);
            try {
                return await User.findOne({email});
            } catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        }

        async function getUserByProviderAccountId(providerId, providerAccountId) {
            _debug('getUserByProviderAccountId', providerId, providerAccountId);
            try {
                const account = await Account.findOne({providerId, providerAccountId});
                if (!account) return null;
                return await User.findOne({_id: account.userId});
            } catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        }

        async function updateUser(user) {
            _debug('updateUser', user);
            try {
                const {name, email, emailVerified, image} = user;
                return await User.findOneAndUpdate({_id: user._id}, {name, email, emailVerified, image});
            } catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        }

        async function deleteUser(userId) {
            _debug('deleteUser', userId);
            // TODO: Delete user method
            return null;
        }

        async function linkAccount(
            userId,
            providerId,
            providerType,
            providerAccountId,
            refreshToken,
            accessToken,
            accessTokenExpires,
        ) {
            _debug(
                'linkAccount',
                userId,
                providerId,
                providerType,
                providerAccountId,
                refreshToken,
                accessToken,
                accessTokenExpires,
            );
            try {
                return await new Account({
                    userId,
                    providerId,
                    providerType,
                    providerAccountId,
                    refreshToken,
                    accessToken,
                    accessTokenExpires,
                }).save();
            } catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        }

        async function unlinkAccount(userId, providerId, providerAccountId) {
            _debug('unlinkAccount', userId, providerId, providerAccountId);
            // TODO
            return null;
        }

        async function createSession(user) {
            _debug('createSession', user);
            try {
                let expires = null;
                if (sessionMaxAge) {
                    const dateExpires = new Date();
                    dateExpires.setTime(dateExpires.getTime() + sessionMaxAge);
                    expires = dateExpires;
                }
                return await new Session({
                    userId: user._id,
                    expires,
                }).save();
            } catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        }

        async function getSession(sessionToken) {
            _debug('getSession', sessionToken);
            try {
                const session = await Session.findOne({sessionToken});
                if (session && session.expires && new Date() > new Date(session.expires)) {
                    return null;
                }
                return session;
            } catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        }

        async function updateSession(session, force) {
            _debug('updateSession', session);
            try {
                if (sessionMaxAge && (sessionUpdateAge || sessionUpdateAge === 0) && session.expires) {
                    const dateSessionIsDueToBeUpdated = new Date(session.expires);
                    dateSessionIsDueToBeUpdated.setTime(dateSessionIsDueToBeUpdated.getTime() - sessionMaxAge);
                    dateSessionIsDueToBeUpdated.setTime(dateSessionIsDueToBeUpdated.getTime() + sessionUpdateAge);

                    if (new Date() > dateSessionIsDueToBeUpdated) {
                        const newExpiryDate = new Date();
                        newExpiryDate.setTime(newExpiryDate.getTime() + sessionMaxAge);
                        session.expires = newExpiryDate;
                    } else if (!force) {
                        return null;
                    }
                } else {
                    if (!force) return null;
                }
                const {expires, sessionToken, accessToken} = session._doc;
                return await Session.findOneAndUpdate({userId: session.userId}, {expires, sessionToken, accessToken});
            } catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        }

        async function deleteSession(sessionToken) {
            _debug('deleteSession', sessionToken);
            try {
                await Session.findOneAndRemove({sessionToken});
            } catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        }

        async function createVerificationRequest(identifier, url, token, secret, provider) {
            _debug('createVerificationRequest', identifier);
            try {
                const {baseUrl} = options;
                const {sendVerificationRequest, maxAge} = provider;

                const hashedToken = createHash('sha256').update(`${token}${secret}`).digest('hex');
                let expires = null;
                if (maxAge) {
                    const dateExpires = new Date();
                    dateExpires.setTime(dateExpires.getTime() + maxAge * 1000);
                    expires = dateExpires;
                }
                const verificationRequest = await new VerificationRequest({identifier, hashedToken, expires}).save();

                await sendVerificationRequest({identifier, url, token, baseUrl, provider});
                return verificationRequest;
            } catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        }

        async function getVerificationRequest(identifier, token, secret, provider) {
            _debug('getVerificationRequest', identifier, token);
            try {
                const hashedToken = createHash('sha256').update(`${token}${secret}`).digest('hex');
                const verificationRequest = await VerificationRequest.findOne({
                    identifier,
                    token: hashedToken,
                });
                if (verificationRequest && verificationRequest.expires && new Date() > new Date(verificationRequest.expires)) {
                    await verificationRequest.deleteOne({token: hashedToken});
                }
                return verificationRequest;
            } catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        }

        async function deleteVerificationRequest(identifier, token, secret, provider) {
            _debug('deleteVerification', identifier, token);
            try {
                const hashedToken = createHash('sha256').update(`${token}${secret}`).digest('hex');
                await VerificationRequest.findOneAndDelete({token: hashedToken});
            } catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        }

        return Promise.resolve({
            createUser,
            getUser,
            getUserByEmail,
            getUserByProviderAccountId,
            updateUser,
            deleteUser,
            linkAccount,
            unlinkAccount,
            createSession,
            getSession,
            updateSession,
            deleteSession,
            createVerificationRequest,
            getVerificationRequest,
            deleteVerificationRequest,
        });
    }

    return {
        getAdapter,
    };
};

module.exports = Adapter();
