import React from 'react'
import { StyleSheet, Platform, Image, Text, View, Button, ScrollView, FlatList, ActivityIndicator} from 'react-native'
import { List, ListItem  } from 'react-native-elements'
import firebase from 'react-native-firebase';
import {createBottomTabNavigator , createStackNavigator } from 'react-navigation';
import NFCManager from './NFCManagerStack'
import styles from './style'
import LocationScreenNavigator from './LocationScreenStack'
import ShiftsScreenNavigator from './ShiftsScreenStack'
import RouteScreenNavigator from './RouteScreenStack'
import NFCManagerNavigator from './NFCManagerStack'

import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';

class HomeManager extends React.Component {
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
            <Button  title="Sign Out Manager" color="#1E407C" onPress={this.handleSignOut} />
        </View>
    </View>
    )
  }
}


class LogScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['Location', 'Time', 'User'],
      widthArr: [140 ,140,140],
      tableData: []
    }
  }

  componentWillMount() {
    firebase.database().ref('TapLogs').once('value')
        .then(snapshot => {
        
           let data = snapshot.val();
           const dataArray = Object.keys(data).map((keyName, i) => 
             [data[keyName].Location , data[keyName].Time , data[keyName].User ]
           ); 

           this.setState({tableData: dataArray})
           console.log(data)
           console.log(dataArray)
          
        })
  }
 
  render() {
    const state = this.state;
    const tableData = this.state.tableData
 
    return (
      <View style={styles.containertwo}>
        <ScrollView horizontal={true}>
          <View>
            <Table borderStyle={{borderColor: '#C1C0B9'}}>
              <Row data={state.tableHead} widthArr={state.widthArr} style={styles.header} textStyle={styles.text}/>
            </Table>
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{borderColor: '#C1C0B9'}}>
                {
                  tableData.map((rowData, index) => (
                    <Row
                      key={index}
                      data={rowData}
                      widthArr={state.widthArr}
                      style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]}
                      textStyle={styles.text}
                    />
                  ))
                }
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    )
  }
}
  


class ManageShiftScreen extends React.Component {

  render() {
    return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text> BKASSAFFF </Text>
    </View>
    );
}



}


const TabNavigator = createBottomTabNavigator({
    Home: { screen: HomeManager },
    "Shifts     ": {screen: ShiftsScreenNavigator },
    "Manage Tags" : {screen: NFCManagerNavigator },
    "Shift Log" : { screen: LogScreen },
    "Locations" : { screen: LocationScreenNavigator }, 
    "Routes": { 
      screen: RouteScreenNavigator, 
      navigationOptions: {
        tabBarOnPress: ({ navigation, defaultHandler }) => {
         
          defaultHandler();
        },
      },
    }
  },
  {
    tabBarOptions : {
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
        showIcon: false,
        scrollEnabled: true,
        swipeEnabled: true,
        lazy: false,
        labelStyle: {
            fontSize: 15 ,
            marginBottom: 14,

        }

    },
});

  
export default TabNavigator;