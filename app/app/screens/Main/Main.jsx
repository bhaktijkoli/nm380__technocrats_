import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'

import Home from './../Home/Home'
import Settings from './../Settings/Settings'

const Drawer = createDrawerNavigator();

export default function Main() {
    return (
        <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Settings" component={Settings} />
        </Drawer.Navigator>
    );
}