import React, { Component } from 'react';
import { View, Image } from 'react-native';
import LottieView from 'lottie-react-native';
import permission from './../../utils/permission';
import { StoreContext } from './../../store/store';
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://technocrats.localhoax.in/api',
});

class Splash extends Component {

    static contextType = StoreContext

    refreshUser = async () => {
        try {
            let { data } = await api.post(
                '/user/refresh',
                {},
                {
                    headers: {
                        Authorization:
                            'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjI3YmI3NjllNDgwMTFjMjRhNWIyMzgiLCJlbWFpbCI6ImxvY2FsaG9heEBnbWFpbC5jb20iLCJpYXQiOjE1OTY0Mzk0MzEsImV4cCI6MjIwMTIzOTQzMX0.OYS3Rz9QnGl0J_DMHPzwyinnp5DMXg67wuyKmX8lCuM',
                    },
                },
            );
            if (data && data.user) {
                this.context.setStore({ user: data.user });
                this.props.navigation.navigate('Main');
            }
        } catch (error) {
            console.error(error);
        }
    };
    async componentDidMount() {
        try {
            await permission.Location();
            await permission.readStorage();
            await permission.writeStorage();
            await permission.camera();
            await permission.audio();
            await this.refreshUser();
        } catch {
            alert('Permissions not granted');
        }
    }
    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ margin: 20, height: 174, width: 174 }}>
                    <LottieView source={require('./../../assets/logo.json')} autoPlay loop />
                </View>
            </View>
        );
    }
}

export default Splash;
