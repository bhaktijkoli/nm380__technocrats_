import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

export default (props) => {
    let locations = props.locations
    if (locations.length === 0) return null;

    const cameraRef = useRef(null);

    if (cameraRef.current !== null) {

    }

    const currentLocation = props.currentLocation;

    return (
        <MapView
            provider={PROVIDER_GOOGLE}
            style={{ ...StyleSheet.absoluteFillObject }}
            loadingEnabled={true}
            initialCamera={{
                center: {
                    latitude: props.locations[0].lat,
                    longitude: props.locations[0].lng,
                },
                altitude: props.locations[0].alt,
                heading: props.locations[0].heading,
                zoom: 18,
                pitch: 10,
            }}
            zoomEnabled={true}
        >

            {/* {Current Position Marker} */}
            {
                currentLocation === null ? null :
                    <Marker
                        title="Current Position"
                        pinColor="red"
                        coordinate={{
                            latitude: currentLocation.lat,
                            longitude: currentLocation.lng
                        }}
                    />
            }

            {/* {Start Marker} */}
            {/* <Marker
                title="Start"
                pinColor="blue"
                coordinate={{
                    latitude: locations[0].lat,
                    longitude: locations[0].lng
                }}
            /> */}

            {/* {Stop Marker} */}
            {/* <Marker
                title="Stop"
                pinColor="green"
                coordinate={{
                    latitude: locations[locations.length - 1].lat,
                    longitude: locations[locations.length - 1].lng
                }}
            /> */}

            {/* Lines */}
            {
                locations.map((location, key) => {
                    if (key === locations.length - 1) return null;
                    if (location.type === 'pause') return null;
                    if (key > 1) {
                        if (locations[key - 1].type === 'pause') return null
                    }
                    return (
                        <Polyline
                            coordinates={[
                                { latitude: location.lat, longitude: location.lng },
                                { latitude: locations[key + 1].lat, longitude: locations[key + 1].lng },
                            ]}
                            strokeColor="#000"
                            strokeWidth={6}
                            tappable={true}
                            onPress={e => {
                                props.onCurrentLocationChange(location.elapsed / 1000);
                            }}
                        />
                    )
                })
            }

        </MapView>
    )
}