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
                        Authorization: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjI3ZTM3NTgyMzViYzNiMDQ4M2IwOTUiLCJlbWFpbCI6ImxvY2FsaG9heEBnbWFpbC5jb20iLCJpYXQiOjE1OTY0NDk2NTQsImV4cCI6MjIwMTI0OTY1NH0.wJlFMj5-OirKMg4r4Pbheo2tm3oWY1RexVSghqkKzwo'
                    },
                },
            );
            if (data && data.user) {
                this.context.setStore({ user: data.user });
                this.props.navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
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
            // await this.refreshUser();
            setTimeout(() => {
                this.props.navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
            }, 3000)
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
