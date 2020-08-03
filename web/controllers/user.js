const User = require('../models/user');

module.exports = {
    onLogin: async (req, res) => {
        try {
            const user = await User.findOne({_id: req.user._id});
            if (user) {
                return res.send({
                    message: 'User logged in',
                    token: user.genToken(),
                    user: user.toWeb(),
                });
            }
            return res.send({
                message: "User with this email, doesn't exisit.",
            });
        } catch (error) {
            console.log(error);
            return res.send({
                message: 'Internal server error',
            });
        }
    },
    refreshSession: async (req, res) => {
        try {
            const user = await User.findOne({_id: req.user._id});
            if (user)
                return res.send({
                    message: 'Token refreshed',
                    token: user.genToken(),
                    user: user.toWeb(),
                });
            return res.send({
                message: "User with this email, doesn't exisit.",
            });
        } catch (error) {
            console.log(error);
            return res.send({
                message: 'Internal server error',
            });
        }
    },
    getVideo: (req, res) => {
        const {id} = req.params;
        res.sendStatus(404);
    },
    getVideos: (req, res) => {
        res.sendStatus(404);
    },
    uploadVideo: (req, res) => {
        res.sendStatus(404);
    },
};
