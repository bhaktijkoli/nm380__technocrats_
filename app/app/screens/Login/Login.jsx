import React, { Component } from 'react'
import { View, Image } from 'react-native';
import { Input } from './../../components';

const logo = require('./../../assets/logo.png');

class Login extends Component {

    state = {
        email: '',
        password: '',
    }

    componentDidMount() {

    }
    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                <Image source={logo} style={{ height: 128, width: 128, marginBottom: 50 }} />
            </View>
        )
    }
}

export default Login;