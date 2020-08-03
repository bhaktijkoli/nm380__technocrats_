const multer = require('multer');
const gridFsStorage = require('multer-gridfs-storage');
const mongoose = require('mongoose');

const dashIt = (x = '') => {
    if (typeof x !== 'string') {
        return '';
    }
    let arr = x
        .toLowerCase()
        .trim()
        .replace('&', 'and')
        .replace('#', 'num')
        .replace(/,|@|-|\]|\[|\)|\(+/g, '')
        .split(' ');
    return arr.join('-');
};

class Bucket {
    constructor(connection = null, bucketName = null) {
        this.gfs = null;
        this.bucketName = bucketName;
        this.storage = null;
        this.upload = null;
        this.singleUpload = null;
        this.multiUpload = null;
        if (typeof bucketName !== 'string') {
            throw Error('Bucket name should be a string.');
        }
        if (connection && connection.db) {
            if (typeof connection.db.databaseName !== 'string') {
                throw Error('Mongoose connection required.');
            } else {
                let gfs = new mongoose.mongo.GridFSBucket(connection.db, {
                    bucketName,
                });
                if (gfs) {
                    this.gfs = gfs;
                    const storage = gridFsStorage({
                        gfs: gfs,
                        db: connection,
                        file: (req, file) => {
                            console.log(req.object);
                            return new Promise((resolve, reject) => {
                                const filename = dashIt(file.originalname);
                                const fileInfo = {
                                    filename,
                                    bucketName,
                                };
                                console.log(file);
                                // Add meta-data & json file
                                return resolve(fileInfo);
                            });
                        },
                    });
                    const upload = multer({
                        storage,
                        // limits: {fileSize: 50 * 1024 * 1024},
                        fileFilter: (req, file, cb) => {
                            cb(null, true);
                        },
                    });
                    const singleUpload = upload.fields([
                        {name: 'video', maxCount: 1},
                        {name: 'geotag', maxCount: 1},
                    ]);
                    const multiUpload = upload.array('videos', 10);
                    this.storage = storage;
                    this.upload = upload;
                    this.singleUpload = singleUpload;
                    this.multiUpload = multiUpload;
                }
            }
        } else {
            throw new Error('Mongoose connection required.');
        }
    }
}

module.exports = Bucket;
