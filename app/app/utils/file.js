import RNFS from 'react-native-fs';

module.exports.uploadVideo = (videoName, videoPath, jsonName, jsonPath, callBegin, callProgress) => {
    var uploadUrl = 'https://technocrats.localhoax.in/api/videos/upload';
    var files = [
        {
            name: 'video',
            filename: videoName,
            filepath: videoPath,
            filetype: 'video/mp4'
        }, {
            name: 'json',
            filename: jsonName,
            filepath: jsonPath,
            filetype: 'video/mp4'
        }
    ];

    var uploadBegin = (response) => {
        var jobId = response.jobId;
        console.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
        callBegin(jobId)
    };

    var uploadProgress = (response) => {
        var percentage = Math.floor((response.totalBytesSent / response.totalBytesExpectedToSend) * 100);
        console.log('UPLOAD IS ' + percentage + '% DONE!');
        callProgress(percentage)
    };

    RNFS.uploadFiles({
        toUrl: uploadUrl,
        files: files,
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjI3YmI3NjllNDgwMTFjMjRhNWIyMzgiLCJlbWFpbCI6ImxvY2FsaG9heEBnbWFpbC5jb20iLCJpYXQiOjE1OTY0Mzk0MzEsImV4cCI6MjIwMTIzOTQzMX0.OYS3Rz9QnGl0J_DMHPzwyinnp5DMXg67wuyKmX8lCuM',

        },
        fields: {
            'hello': 'world',
        },
        begin: uploadBegin,
        progress: uploadProgress
    }).promise.then((response) => {
        if (response.statusCode == 200) {
            console.log('FILES UPLOADED!');
        } else {
            console.log('SERVER ERROR');
        }
    })
        .catch((err) => {
            if (err.description === "cancelled") {
            }
            console.log(err);
        });
}