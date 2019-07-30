import React from 'react'
import { StyleSheet, TouchableOpacity, Alert, Text, TextInput, View, Button, ScrollView, FlatList, ActivityIndicator} from 'react-native'
import { List, ListItem, checkBox  } from 'react-native-elements'
import firebase from 'react-native-firebase';
import {createBottomTabNavigator , createStackNavigator , withNavigationFocus} from 'react-navigation';
import UUIDGenerator from 'react-native-uuid-generator';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import styles1 from './style'

class LocationsScreen extends React.Component {
    
    static navigationOptions = {
      title: 'Buildings',
      headerStyle: { backgroundColor: '#03A9F4'  },
      headerTitleStyle: {     flex: 1,  color: 'white' , alignSelf : 'center' ,textAlign: 'center'},
    }

    // static navigationOptions = () => {
    //     return {
    //       tabBarOnPress({ navigation, defaultHandler }) {
    //         navigation.state.params.onTabFocus();
    //         defaultHandler();
    //       }
    //     };
    // };

    constructor(props) {
      super(props);
      console.log(props.navigation)
      this.state = {
        data: []
      };
    }
  
    componentDidMount() {
    const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", () => {
        // The screen is focused
        // Call any action
        this.makeRemoteRequest();
    });
      //this.makeRemoteRequest();
    }

    componentWillUnmount() {
        // Remove the event listener
        this.focusListener.remove();
    }   
   
  
    makeRemoteRequest = () => {
      this.setState({ data: []});
      firebase.database().ref('Buildings').once('value')
        .then(snapshot => {
          
           var items = [];
           var i = 0;
           snapshot.forEach((child) => {
    
            items.push({
              id: child.key ,
              Building: child.val().Building,
              Location: child.val().Location
            })
            i++; 
           } 
           
           )
           this.setState({ data : items})
          
        })
        console.log(this.state.data);
    };
  
      
       
    goBackMore = () => {
        this.props.navigation.goBack(null);
    }

    render() {
      const {navigate} = this.props.navigation;
      return (

        <View style={styles.container}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <ListItem
              style={styles.list}
              title={item.Building}
              onPress={() => navigate('RouteScreen', {key: item.id , Building: item.Building, Location: item.Location, goBackMore: () => this.makeRemoteRequest()   } )}
            />
            
          )}
          keyExtractor={(item, index) => index.toString() }
        />

      </View>
      );
    }


}


class RouteScreen extends React.Component {

    static navigationOptions = {
        title: 'Routes',
        headerStyle: { backgroundColor: '#03A9F4'  },
        headerTitleStyle: {     flex: 1,  color: 'white' , alignSelf : 'center' ,textAlign: 'center'},
        headerRight: (<View />),
        
      }
  
      constructor(props) {
        super(props);
        this.tempData = []
        this.state = {
          key: null,
          LocationData: [],
          data: []
        };
      }
    
      componentDidMount() {
        this.getItemDetails();
        //this.makeRemoteRequest(); 
      }

      componentWillUnmount() {
         this.props.navigation.state.params.goBackMore();
      }
    
      getItemDetails = () => {
        console.log(this.props.navigation.state.params.key);
        this.tempArray = this.props.navigation.state.params.Location;
        this.setState({ 
          key : this.props.navigation.state.params.key ,
          Building: this.props.navigation.state.params.Building,
          LocationData: [...this.tempArray]
        },  function() {   this.makeRemoteRequest() });
        console.log(this.state.key)
      }

      makeRemoteRequest = () => {
          
        this.setState({ data: [] });
        console.log(this.state.key)
        firebase.database().ref('Buildings/' + this.state.key + '/Routes').once('value')
          .then(snapshot => {
            console.log(snapshot);
             var items = [];
             snapshot.forEach((child) => {
              items.push({
                id: child.key ,
                Name: child.val().Name,
                Path: child.val().Path
              }) 
             })
             this.setState({ data : items})
            
          })
          console.log(this.state.data);
      };
    
        
      handleAdd = () => {
          this.props.navigation.navigate('AddRouteScreen' , { key: this.state.key,  Building: this.state.Building, LocationData: this.state.LocationData,   goBackMore: () => this.makeRemoteRequest()  });
      }
      
      handleDelete = (id) => {
        const filteredData = this.state.data.filter(item => item.id !== id);
        this.tempArray = filteredData;
        this.setState({ data: [...this.tempArray] });
        firebase.database().ref('Buildings/'+ this.state.key + '/Routes/').child(id).remove();
        console.log(this.tempArray);
        console.log(this.state.data);
      }

      goBackMore = () => {
        this.props.navigation.goBack(null);
      }
  
      render() {
        const {navigate} = this.props.navigation;
        return (
        <View style={styles.container}>
            <View style={styles.centerContent}>
                <View style={{ marginTop: 20 , marginBottom: 20}}>   
                    <Text style={{ fontSize: 20 , fontWeight: 'bold' }}>{this.state.Building}</Text> 
                </View>
            <View style={{ marginTop: 10 , width: '80%' , height: 350 ,  backgroundColor: 'lightgrey', borderRadius: 4, borderWidth: 1, borderColor: '#d6d7da'}}>    
                <FlatList
                    data={this.state.data}
                    extraData={this.state.data}
                    renderItem={({ item }) => (
                    <ListItem
                        style={styles.listSmall}
                        title={item.Name}
                        checkBox={{ iconType: 'material' , checkedIcon: 'clear', uncheckedIcon: 'delete', checkedColor: 'red' ,uncheckedColor: 'red' , onPress: () => this.handleDelete(item.id) } }
                        
                        onPress={() => navigate('UpdateRouteScreen', { buildingKey: this.state.key , key: item.id , RouteName: item.Name, Path: item.Path , goBackMore: () => this.goBackMore() })}
                    />
                    
                    )}
                    keyExtractor={(item, index) => item.id.toString()  }
                />
            </View>
            <TouchableOpacity onPress={this.handleAdd} style={styles.fab}>
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity> 
            </View>
        </View>
        );
      }
  

}
 

class AddRouteScreen extends React.Component {

    static navigationOptions = {
        title: 'Locations',
        headerStyle: { backgroundColor: '#03A9F4'  },
        headerTitleStyle: {     flex: 1,  color: 'white' , alignSelf : 'center' ,textAlign: 'center'},
        headerRight: (<View />)
      }

    constructor(props) {
        super(props);
        
        this.tempArray = []
        this.state = {
          key: null ,
          currentUser: null,
          Building: '',
          Locations: '', 
          data: [] ,
          checked: []

        };
    }

    componentDidMount() {
        this.getItemDetails();
    }
    
    getItemDetails = () => {
        console.log(this.props.navigation.state.params.key);
        this.tempArray = this.props.navigation.state.params.LocationData;
        let initialCheck = this.tempArray.map(x => false );
        console.log(initialCheck);
        this.setState({ 
          key : this.props.navigation.state.params.key ,
          Building: this.props.navigation.state.params.Building,
          data: [...this.tempArray]
        } );
        console.log(this.state.key)
    }

    onCheckBoxPress(id) {
        let tmp = this.state.checked;
        if (tmp.includes(id)){
            tmp.splice(tmp.indexOf(id), 1);
        } else {
            tmp.push(id);
        }
        this.setState({
            checked: tmp
        })
        console.log(this.state.checked);


    }
    handleChange = (index) => {
        let checkedTemp = [...this.state.checked];
        checkedTemp[index] = !checkedTemp[index];
        this.setState({ checked: checkedTemp});
        console.log(this.state.checked);

    }

    handleNext = () => {
        this.props.navigation.navigate('ReorderRouteScreen' , { key: this.state.key,  Building: this.state.Building, LocationData: this.state.data, RouteOrder: this.state.checked ,   goBackMore: () => this.goBackMore() });
    }

    goBackMore = () => {
        this.props.navigation.goBack(null);
    }

    render() {
        const {navigate} = this.props.navigation;
        let { data , checked } = this.state;
        return (
        <View style={styles.container}>
            <View style={styles.centerContent}>
                <View style={{ marginTop: 10}}>   
                    <Text style={{ fontSize: 20 , fontWeight: 'bold' }}>Choose Locations for Route</Text> 
                </View>
            <View style={{ marginTop: 10 , width: '100%' , height: 350 ,  backgroundColor: 'lightgrey', borderRadius: 4, borderWidth: 1, borderColor: '#d6d7da'}}>    
                <FlatList
                    data={this.state.data}
                    extraData={this.state}
                    renderItem={({ item, index}) => (
                    <ListItem
                        style={styles.listSmall}
                        title={item.name}
                        checkBox={{ 
                            checkedIcon: 'dot-circle-o' ,
                            uncheckedIcon: 'circle-o',
                            onPress: () => this.onCheckBoxPress(index) ,
                            checked: this.state.checked.includes(index) ? true : false 
                        }}
                        
                    />
                    
                    )}
                    keyExtractor={(item, index) => index.toString() }
                />
            </View>
            <TouchableOpacity onPress={this.handleNext} style={styles.fab}>
                <Text style={styles.fabIcon}>></Text>
            </TouchableOpacity> 
            </View>
        </View>
        );
      }

}

class ReorderRouteScreen extends React.Component{

    constructor(props) {
        super(props);
        
        this.tempArray = []
        this.state = {
          key: null ,
          Building: '',
          Locations: [],
          RouteName: '', 
          RouteOrder: [],
          data: [...Array(20)].map((d, index) => ({
            key: `item-${index}`,
            label: index,
            backgroundColor: `rgb(${Math.floor(Math.random() * 255)}, ${index * 5}, ${132})`,
          }))
        };
    }

    componentDidMount() {
        this.getItemDetails();
    }

    componentWillUnmount() {
        this.props.navigation.state.params.goBackMore();
    }

    getItemDetails = () => {
        console.log(this.props.navigation.state.params.key);
        this.tempArray = this.props.navigation.state.params.LocationData;
        let tempData = []; 
        this.props.navigation.state.params.RouteOrder.map( item => {
            console.log(item);
            tempData.push(this.tempArray[item]);
        });
        console.log(this.tempArray);
        console.log(tempData)
        this.setState({ 
          key : this.props.navigation.state.params.key ,
          Building: this.props.navigation.state.params.Building,
          Locations: tempData,
          RouteOrder: this.props.navigation.state.params.RouteOrder
        } );
        console.log(this.state.Locations)
    }

    renderItem = ({ item, index, move, moveEnd, isActive }) => {
        return (
          <TouchableOpacity
            style={styles.listSmall}
            onLongPress={move}
            onPressOut={moveEnd}
          >
            <Text style={{ 
              fontWeight: 'bold', 
              color: 'black',
              fontSize: 24,
              paddingLeft: 10,
            }}>{item.name}</Text>
          </TouchableOpacity>
        )
      }

     
      
    handleCreateRoute = () => {
        firebase.database().ref('Buildings/' + this.state.key + '/Routes').push({
            Name : this.state.RouteName,
            Path: this.state.Locations
          });
          this.props.navigation.goBack(null);

    }
    render() {
        const {navigate} = this.props.navigation;
        return (
        <View style={styles.container}>
            <View style={styles.centerContent}>
                {/* <View style={{ marginTop: 10}}>   
                    <Text style={{ fontSize: 20 , fontWeight: 'bold' }}>{this.state.Building}</Text> 
                </View> */}
                <TextInput
                    placeholder="Route Name"
                    autoCapitalize="words"
                    style={styles.textInput}
                    onChangeText={RouteName => this.setState({ RouteName })}
                    value={this.state.RouteName}
              
                />
            <View style={{ marginTop: 10 , width: '80%' , height: 450 ,  backgroundColor: 'lightgrey', borderRadius: 4, borderWidth: 1, borderColor: '#d6d7da'}}>    
                <DraggableFlatList
                    data={this.state.Locations}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => `draggable-item-${index}`}
                    scrollPercent={30}
                    onMoveEnd={({ data }) => this.setState({ Locations: data })}
                />
            </View>
            <View style={{marginBottom: 30, width: 150 }}> 
                <Button title="Create Route" style={{  marginBottom: 200, marginVertical: 15 }}  color="#1E407C" onPress={this.handleCreateRoute}/>
            </View>
            <TouchableOpacity onPress={this.handleAdd} style={styles.fab}>
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity> 
            </View>
        </View>
        );
      }

}



class UpdateRouteScreen extends React.Component{

    constructor(props) {
        super(props);
        
        this.tempArray = []
        this.state = {
          key: null ,
          buildingKey: null,
          Building: '',
          Locations: [],
          RouteName: '', 
          RouteOrder: []
        };
    }

    componentDidMount() {
        this.getItemDetails();
    }

    componentWillUnmount() {
        this.props.navigation.state.params.goBackMore();
    }

    getItemDetails = () => {
  /*       console.log(this.props.navigation.state.params.key);
        this.tempArray = this.props.navigation.state.params.LocationData;
        let tempData = []; 
        this.props.navigation.state.params.RouteOrder.map( item => {
            console.log(item);
            tempData.push(this.tempArray[item]);
        });
        console.log(this.tempArray);
        console.log(tempData) */
        this.setState({ 
          key : this.props.navigation.state.params.key ,
          buildingKey : this.props.navigation.state.params.buildingKey ,
          RouteName: this.props.navigation.state.params.RouteName,
          Locations: this.props.navigation.state.params.Path
        } );
        console.log(this.state.Locations)
    }

    renderItem = ({ item, index, move, moveEnd, isActive }) => {
        return (
          <TouchableOpacity
            style={styles.listSmall}
            onLongPress={move}
            onPressOut={moveEnd}
          >
            <Text style={{ 
              fontWeight: 'bold', 
              color: 'black',
              fontSize: 24,
              paddingLeft: 10,
            }}>{item.name}</Text>
          </TouchableOpacity>
        )
      }

     
      
    handleUpdateRoute = () => {
        firebase.database().ref('Buildings/' + this.state.buildingKey + '/Routes/' + this.state.key ).update({
            Name : this.state.RouteName,
            Path: this.state.Locations
          });
          this.props.navigation.goBack(null);

    }
    render() {
        const {navigate} = this.props.navigation;
        return (
        <View style={styles.container}>
            <View style={styles.centerContent}>
                {/* <View style={{ marginTop: 10}}>   
                    <Text style={{ fontSize: 20 , fontWeight: 'bold' }}>{this.state.Building}</Text> 
                </View> */}
                <TextInput
                    placeholder="Route Name"
                    autoCapitalize="words"
                    style={styles.textInput}
                    onChangeText={RouteName => this.setState({ RouteName })}
                    value={this.state.RouteName}
              
                />
            <View style={{ marginTop: 10 , width: '80%' , height: 450 ,  backgroundColor: 'lightgrey', borderRadius: 4, borderWidth: 1, borderColor: '#d6d7da'}}>    
                <DraggableFlatList
                    data={this.state.Locations}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => `draggable-item-${index}`}
                    scrollPercent={30}
                    onMoveEnd={({ data }) => this.setState({ Locations: data })}
                />
            </View>
            <View style={{marginBottom: 30, width: 150 }}> 
                <Button title="Update Route" style={{  marginBottom: 200, marginVertical: 15 }}  color="#1E407C" onPress={this.handleUpdateRoute}/>
            </View>
            <TouchableOpacity onPress={this.handleAdd} style={styles.fab}>
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity> 
            </View>
        </View>
        );
      }

}



 

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    heading: {
      height: 60,
      backgroundColor: '#03A9F4',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headingTest: {
      fontSize: 20,
      color: 'white',
      fontWeight: 'bold',
    },
    list: {
      margin: 5,
      backgroundColor: 'white',
      height:80,
      justifyContent: 'space-around',
      paddingLeft: 10,
      elevation: 1
    },
    listSmall: {
      margin: 5,
      backgroundColor: 'white',
      height: 60,
      justifyContent: 'space-around',
      
      elevation: 1,
    },
    fab: {
      position: 'absolute',
      width: 56,
      height: 56,
      alignItems: 'center',
      justifyContent: 'center',
      right: 20,
      bottom: 20,
      backgroundColor: '#03A9F4',
      borderRadius: 30,
      elevation: 8
    },
    fabIcon: {
      fontSize: 40,
      color: 'white'
    },
    textInput: {
      height: 50,
      fontSize:15,
      width: '50%',
      borderColor: '#9b9b9b',
      borderBottomWidth: 1,
      marginTop: 8,
      marginVertical: 15
    }, 
    centerContent: {
      flex: 1,
      alignItems: 'center'
    }
  });


  const RoutesScreenStack = createStackNavigator({
    LocationScreen : { screen: LocationsScreen },
    RouteScreen: { screen: RouteScreen },
    UpdateRouteScreen: { screen: UpdateRouteScreen },
    AddRouteScreen: { screen: AddRouteScreen },
    ReorderRouteScreen: {screen: ReorderRouteScreen }
  }, {
    initialRoute: 'LocationScreen',
  });
    
  export default withNavigationFocus(RoutesScreenStack);