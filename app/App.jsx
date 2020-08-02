import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Splash from './app/screens/Splash/Splash';
import Login from './app/screens/Login/Login';
import Main from './app/screens/Main/Main';
import Record from './app/screens/Record/Record';
import Play from './app/screens/Play/Play';

import { StoreProvider } from './app/store/store';

const Stack = createStackNavigator();

const store = {
    user: null,
    files: [],
};

export default function App() {
    return (
        <StoreProvider value={store}>
            <NavigationContainer>
                <Stack.Navigator headerMode="none" initialRouteName="Splash">
                    <Stack.Screen name="Splash" component={Splash} />
                    <Stack.Screen name="Play" component={Play} />
                    <Stack.Screen name="Main" component={Main} />
                    <Stack.Screen name="Record" component={Record} />
                    <Stack.Screen name="Login" component={Login} />
                </Stack.Navigator>
            </NavigationContainer>
        </StoreProvider>
    );
}
