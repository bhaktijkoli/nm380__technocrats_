import React, { useState, useRef } from 'react';
import ModalSelector from 'react-native-modal-selector'
import { TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline, OverlayComponent, UrlTile, MAP_TYPES, PROVIDER_GOOGLE } from 'react-native-maps';
import { Image } from 'react-native-animatable';


export default (props) => {
    let locations = props.locations
    if (locations.length === 0) return null;

    const [provider, setProvider] = useState('google');

    const cameraRef = useRef(null);
    const mapLayerRef = useRef(null);

    const mapLayerButton = (
        <TouchableOpacity activeOpacity={0.8} style={{ position: 'absolute', top: 10, right: 10, padding: 3, backgroundColor: '#fff' }} onPress={e => mapLayerRef.current.open()}>
            <Image source={require('./../../assets/globe.png')} style={{ width: 28, height: 28 }} />
        </TouchableOpacity>
    )


    const currentLocation = props.currentLocation;

    return (
        <React.Fragment>
            <MapView
                provider={provider === 'google' ? PROVIDER_GOOGLE : null}
                mapType={provider === 'google' ? MAP_TYPES.STANDARD : MAP_TYPES.NONE}
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
                                zIndex={10}
                            />
                        )
                    })
                }

                {
                    provider !== 'google' ?
                        <UrlTile
                            urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            maximumZ={19}
                            zIndex={-1}
                            flipY={false}
                        />
                        : null
                }
                {/* <OverlayComponent
                style={{ position: "absolute", top: 10, right: 10 }}
                image={{ uri: "https://img.icons8.com/color/48/000000/globe--v1.png" }}
            /> */}

            </MapView>
            <ModalSelector
                ref={mapLayerRef}
                customSelector={mapLayerButton}
                data={[
                    { key: 1, section: true, label: "Select Map Layer" },
                    { key: 2, label: 'Google', value: 'google' },
                    { key: 3, label: 'Open Street Maps', value: 'osm' },
                ]}
                onChange={(option) => { setProvider(option.value) }} />
        </React.Fragment>

    )
}