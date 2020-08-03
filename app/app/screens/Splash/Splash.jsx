import React, { Component } from 'react'
import { View, Image } from 'react-native';
import LottieView from 'lottie-react-native';
import permission from './../../utils/permission';

class Splash extends Component {
    async componentDidMount() {
        try {
            await permission.Location();
            await permission.readStorage();
            await permission.writeStorage();
            await permission.camera();
            await permission.audio();
        } catch {
            alert("Permissions not granted");
        }
        setTimeout(() => {
            this.props.navigation.navigate('Main');
        }, 3000)
    }
    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ margin: 20, height: 174, width: 174 }}>
                    <LottieView source={require('./../../assets/logo.json')} autoPlay loop />
                </View>
            </View>
        )
    }
}

export default Splash;