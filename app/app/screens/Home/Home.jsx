import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { StoreContext } from './../../store/store';
import { Toolbar } from '../../components';
import Fab from './Fab';
import RNFS from 'react-native-fs';
import directory from './../../utils/directory';
import VideoItem from './VideoItem';

class Home extends Component {

    static contextType = StoreContext

    state = {
        files: [],
    }

    componentDidMount() {

        console.log(this.context.store.user)

        this._unsubscribeFocus = this.props.navigation.addListener('focus', () => {
            this.setState({ files: [] });
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
                                    RNFS.readFile(result.path + ".json")
                                        .then(data => {
                                            let files = this.state.files;
                                            let locations = JSON.parse(data);
                                            result.duration = locations[locations.length - 1].elapsed;
                                            files.push(result)
                                            this.setState({ files })
                                        })
                                }
                            })

                    })
                })
        });
    }

    componentWillUnmount() {
        this._unsubscribeFocus();
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
