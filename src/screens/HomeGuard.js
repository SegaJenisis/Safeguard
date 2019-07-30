import React from 'react'
import { StyleSheet, Platform, Image, Text, TextInput, View, Button, ScrollView, FlatList, ActivityIndicator} from 'react-native'
import { List, ListItem  } from 'react-native-elements'

import firebase from 'react-native-firebase';
import {createBottomTabNavigator } from 'react-navigation';
import NFCGuardNavigator from './NFCGuardStack'
import GuardShiftScreenNavigator from './GuardShiftScreenStack'

class HomeGuard extends React.Component {
  state = { currentUser: null }

  componentDidMount() { 
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
  }

  handleSignOut = async () => {
    try {
        await firebase.auth().signOut();
        this.props.navigation.navigate('Login');
    } catch (e) {
        console.log(e);
    }
}


render() {
    const { currentUser } = this.state
return (
    <View style={styles.container}>
        <Text>
          Hi {currentUser && currentUser.email}!
        </Text>
        <View style={styles.buttonContainer}>
            <Button  title="Sign Out Guard" color="#1E407C" onPress={this.handleSignOut} />
        </View>
    </View>
    )
  }
}


class SettingsScreen extends React.Component {
    render() {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Add Profile Related Stuff Here!</Text>
        </View>
      );
    }
  }


class ViewShiftScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
    };
  }

  componentDidMount() {
    this.makeRemoteRequest();
  }

  refreshFunction() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    this.setState({ loading: true });
      firebase.database().ref('Shifts').once('value')
      .then(snapshot => {
          this.setState({
            error: snapshot.error || null,
            loading: false,
            refreshing: false
          });
         var items = [];
         var i = 0;
         snapshot.forEach((child) => {
          items.push({
            id: Object.keys(snapshot.val())[i],
            email: child.val().Email,
            date: child.val().Date,
            duration: child.val().Duration,
            time: child.val().Time,
            location: child.val().Location 

          })
          i++; 
         } 
         )
         this.setState({data : items})
         console.log(data)
         console.log(dataArray)
        
      })
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE",
          
        }}
      />
    );
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          flexDirection: 'row',
          justifyContent: 'space-around',
          padding: 10
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };
  
  renderAddButton = () => {
    return (
      <View style={{ justifyContent: 'bottom' , elevation: 8}}> 
        <Button title="Add Shift" color="#1E407C"/>
      </View>
    );
  };

  handleAdd = () => {
      this.props.navigation.navigate('AddShiftScreen');
  }
  

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={{ borderTopWidth: 0 , elevation: 0}}> 
        <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              
              <ListItem
                title={item.email }
                subtitle={`${item.date} ${item.duration}`}
                onPress={console.log("test")}
              />
              
            )}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={this.renderSeparator}
            ListFooterComponent={this.renderFooter}
            AddButtonComponent={this.renderAddButton}
          />
     
  
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 135
  }
})

const TabNavigator = createBottomTabNavigator({
    Home: { screen: HomeGuard },
    "My Shifts": {screen: GuardShiftScreenNavigator },
    "Check In" : {screen: NFCGuardNavigator },
    Profile : { screen: SettingsScreen }
  },
  {
    tabBarOptions : {
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
        showIcon: false,
        scrollEnabled: true,
        labelStyle: {
            fontSize: 15 ,
            marginBottom: 14,
        }

    }
});
  
export default TabNavigator;