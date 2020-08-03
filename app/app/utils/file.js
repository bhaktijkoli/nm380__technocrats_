import RNFS from 'react-native-fs';
import { Alert } from "react-native";

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
            'Authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjI3ZTM3NTgyMzViYzNiMDQ4M2IwOTUiLCJlbWFpbCI6ImxvY2FsaG9heEBnbWFpbC5jb20iLCJpYXQiOjE1OTY0NDk2NTQsImV4cCI6MjIwMTI0OTY1NH0.wJlFMj5-OirKMg4r4Pbheo2tm3oWY1RexVSghqkKzwo'
        },
        fields: {
            'hello': 'world',
        },
        begin: uploadBegin,
        progress: uploadProgress
    }).promise.then((response) => {
        if (response.statusCode == 200) {
            Alert.alert(
                'Upload Successfull',
                '',
                [
                    { text: 'OK' }
                ],
                { cancelable: false }
            );
        } else {
            Alert.alert(
                'Upload Failed',
                '',
                [
                    { text: 'OK' }
                ],
                { cancelable: false }
            );
        }
    })
        .catch((err) => {
            if (err.description === "cancelled") {
            }
            Alert.alert(
                'Upload Failed',
                'Server was not found',
                [
                    { text: 'OK' }
                ],
                { cancelable: false }
            );
        });
}