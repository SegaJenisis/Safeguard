import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createSwitchNavigator , createAppContainer } from 'react-navigation'
import Loading from './src/screens/Loading'
import SignUp from './src/screens/SignUp'
import Login from './src/screens/Login'
import Home from './src/screens/Home'
import HomeManager from './src/screens/HomeManager'
import HomeGuard from './src/screens/HomeGuard'




const App = createSwitchNavigator(
  {
    Loading,
    SignUp,
    Login,
    Home,
    HomeManager, 
    HomeGuard
  },
  {
    initialRouteName: 'Loading'
  }
)


export default createAppContainer(App);