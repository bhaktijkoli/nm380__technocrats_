import React, {useEffect, useState} from 'react';
import axios from 'axios';

const TEST_TOKEN =
    'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjI3ZTM3NTgyMzViYzNiMDQ4M2IwOTUiLCJlbWFpbCI6ImxvY2FsaG9heEBnbWFpbC5jb20iLCJpYXQiOjE1OTY0NDk2NTQsImV4cCI6MjIwMTI0OTY1NH0.wJlFMj5-OirKMg4r4Pbheo2tm3oWY1RexVSghqkKzwo';

function TestUpload(props) {
    const [video, setVideo] = useState({});
    const [metaData, setMetaData] = useState('');
    const upload = () => {
        const formData = new FormData();
        formData.append('video', video);
        formData.append('geotag', metaData);
        axios
            .post('http://localhost:3000/api/videos/upload', formData, {
                headers: {
                    Authorization: TEST_TOKEN,
                },
            })
            .then((res) => {
                console.log('lul', res);
            })
            .catch((err) => console.log(err));
    };
    const handleFileChange = (e) => {
        const f = e.target.files[0];
        setVideo(f);
    };
    const handleJsonChange = (e) => {
        let fr = new FileReader();
        fr.readAsText(e.target.files[0]);
        fr.onloadend = () => {
            setMetaData(fr.result);
        };
    };
    return (
        <div>
            <input accept="video/mp4" type="file" onChange={handleFileChange} />
            <input accept="application/json" type="file" onChange={handleJsonChange} />
            <button onClick={upload}>Submit</button>
        </div>
    );
}

export default TestUpload;
