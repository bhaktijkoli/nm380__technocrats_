import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import formatting from './../../utils/formatting';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import OptionsMenu from "react-native-options-menu";
import file from './../../utils/file';
import kml from './../../utils/kml';
import colors from './../../styles/colors';


export default VideoItem = (props) => {
    let item = props.item;

    // Play Screen
    let onPress = () => {
        props.navigation.navigate('Play', { videoPath: item.path, jsonPath: item.path + ".json" })
    }

    // Upload Video
    let [progress, setProgress] = useState({
        uploading: false,
        done: 0,
    });
    let onUpload = () => {
        file.uploadVideo(item.name, item.path, item.name, item.path + ".json",
            () => {
                setProgress({ uploading: true, done: 0 })
            },
            (done) => {
                setProgress({ uploading: true, done })
            })
    }

    // XML Export
    let onExportXML = () => {
        kml.saveKml(item.name, item.path + '.json');
    }
    let onAlert = () => {
        alert("Coming soon");
    }
    const myIcon = (<Icon name="dots-vertical" size={30} color="#000" />)
    return (
        <TouchableOpacity style={{ width: '100%', borderBottomColor: 'gray', borderBottomWidth: 0.5 }} activeOpacity={0.8} onPress={onPress}>
            <View style={{ width: '100%', flexDirection: 'row', padding: 12 }}>
                <View style={{ width: 120, height: 80 }}>
                    <Image source={{ uri: `https://i.stack.imgur.com/PtbGQ.png` }} style={{ width: 120, height: 80, borderRadius: 4 }} />
                    <Text style={{ position: 'absolute', bottom: 8, right: 8, color: '#FFF', backgroundColor: '#000000b0' }}>{formatting.formatDuration(item.duration)}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'column', marginHorizontal: 10, marginVertical: 2 }}>
                    <Text style={{ fontSize: 18 }}>{item.name}</Text>
                </View>
                <OptionsMenu
                    customButton={myIcon}
                    destructiveIndex={1}
                    options={["Upload", "Share", "Export to KML", "Delete"]}
                    actions={[onUpload, onAlert, onExportXML, onAlert]} />
            </View>
            <ProgressBar progress={progress} />
        </TouchableOpacity>
    )
}


const ProgressBar = ({ progress }) => {
    if (progress.uploading === false) return null;
    return (
        <View style={{ width: '100%', paddingHorizontal: 12, marginTop: -5, marginBottom: 5 }}>
            <View style={{ width: `${progress.done}%`, backgroundColor: colors.success, height: 3 }}>

            </View>
        </View>
    )
}