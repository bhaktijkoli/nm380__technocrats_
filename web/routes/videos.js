const config = require('../config');
const router = require('express').Router();
const Bucket = require('../database/upload');
const passport = require('../auth/passport');
const User = require('../models/user');

const getUrl = (req) => {
    return (config.app.env === 'production' ? 'https' : req.protocol) + '://' + req.headers.host + '/api/images/';
};

module.exports = (connection) => {
    const bucket = new Bucket(connection, 'videos');
    const {gfs, singleUpload, multiUpload} = bucket;
    if (gfs) {
        router.get('/:filename', async (req, res) => {
            try {
                let params = req.params;
                let files = await gfs.find({filename: params.filename}).toArray();
                if (files && files.length) {
                    let rs = gfs.openDownloadStreamByName(files[0].filename);
                    return rs.pipe(res);
                }
                return res.send({success: false, message: 'No files found', files: []});
            } catch (error) {
                console.log(error);
                return res.send({
                    message: 'Internal server error.',
                });
            }
        });
        router.post('/upload', passport.authenticate('verify', {session: false}), singleUpload, async (req, res) => {
            try {
                // const user = await User.findOneAndUpdate({_id: req.user._id}, );
                return res.send({
                    success: true,
                    // filename: req.file.filename,
                    // url: getUrl(req) + req.file.filename,
                    // videos: user.videos,
                });
            } catch (error) {
                console.log(error);
                return res.status(500).send({
                    message: 'Internal server error.',
                });
            }
        });
        // router.post('/upload-many', passport.authenticate('verify', {session: false}), multiUpload, async (req, res) => {
        //     try {
        //         return res.send({
        //             success: true,
        //             filename: req.file.filename,
        //             url: getUrl(req) + req.file.filename,
        //         });
        //     } catch (error) {
        //         console.log(error);
        //         return res.send({
        //             message: 'Internal server error.',
        //         });
        //     }
        // });
    }
    return router;
};
