import React from 'react';
import Layout from '../layout';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import dynamic from 'next/dynamic';

const position = [73.1548406, 19.2401577];

const DynamicComponentWithNoSSR = dynamic (
    () =>         
    <Map center={position} zoom={13}>
    <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
    />
    <Marker position={position}>
    <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
    </Marker>
    </Map>,
    { ssr: false }
)

const MapDis = () => {

return(
        <DynamicComponentWithNoSSR/>
    )
      
};

export default MapDis;

