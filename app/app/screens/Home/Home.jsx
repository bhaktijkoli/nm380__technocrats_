import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { Toolbar } from '../../components';
import Fab from './Fab';
import RNFS from 'react-native-fs';
import MediaMeta from "rn-media-meta";
import directory from './../../utils/directory';
import VideoItem from './VideoItem';

class Home extends Component {
    state = {
        files: [],
    }

    componentDidMount() {
        const formats = ['.mp4', '.avi']
        RNFS.readDir(directory.path(''))
            .then((results) => {

                results.forEach(result => {
                    if (!result.isFile()) return;

                    let isSupported = false

                    formats.forEach(f => {
                        if (result.path.endsWith(f)) {
                            isSupported = true
                        }
                    })

                    RNFS.exists(result.path + ".json")
                        .then(exists => {
                            if (exists) {
                                MediaMeta.get(result.path).then(meta => {
                                    let files = this.state.files;
                                    result.meta = meta;
                                    files.push(result)
                                    this.setState({ files })
                                })
                            }
                        })

                })
            })
    }

    render() {
        return (
            <React.Fragment >
                <Toolbar />
                <FlatList
                    data={this.state.files}
                    renderItem={({ item }, key) => (
                        <VideoItem item={item} navigation={this.props.navigation} key={key} />
                    )}
                    keyExtractor={item => item.id}
                />
                <Fab />
            </React.Fragment >
        );
    }
}

export default Home;
