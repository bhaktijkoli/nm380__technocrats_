import React from 'react';
import { View, Text, Image } from 'react-native';
import formatting from './../../utils/formatting';

export default VideoItem = (props) => {
    let item = props.item;
    return (
        <View style={{ width: '100%', borderBottomColor: 'gray', borderBottomWidth: 0.5 }}>
            <View style={{ width: '100%', flexDirection: 'row', padding: 12 }}>
                <View style={{ width: 120, height: 80 }}>
                    <Image source={{ uri: `data:image/png;base64,${item.meta.thumb}` }} style={{ width: 120, height: 80, borderRadius: 4 }} />
                    <Text style={{ position: 'absolute', bottom: 8, right: 8, color: '#FFF', backgroundColor: '#000000b0' }}>{formatting.formatDuration(item.meta.duration)}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'column', marginHorizontal: 10, marginVertical: 2 }}>
                    <Text style={{ fontSize: 18 }}>{item.name}</Text>
                </View>
            </View>
        </View>
    )
}
