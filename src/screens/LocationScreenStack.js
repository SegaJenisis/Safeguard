import React from 'react'
import { StyleSheet, TouchableOpacity, Alert, Text, TextInput, View, Button, ScrollView, FlatList, ActivityIndicator} from 'react-native'
import { List, ListItem  } from 'react-native-elements'
import firebase from 'react-native-firebase';
import {createBottomTabNavigator , createStackNavigator } from 'react-navigation';
import UUIDGenerator from 'react-native-uuid-generator';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import styles1 from './style'

class LocationsScreen extends React.Component {
    
    static navigationOptions = {
      title: 'Buildings',
      headerStyle: { backgroundColor: '#03A9F4'  },
      headerTitleStyle: {     flex: 1,  color: 'white' , alignSelf : 'center' ,textAlign: 'center'},
    }

    constructor(props) {
      super(props);
  
      this.state = {
        loading: true,
        data: []
      };
    }
  
    componentDidMount() {
      this.makeRemoteRequest();
    }
  
    makeRemoteRequest = () => {
      this.setState({ loading: true , data: []});
      firebase.database().ref('Buildings').once('value')
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
          <Button title="Add Locations" color="#1E407C"/>
        </View>
      );
    };
  
    handleAdd = () => {
        this.props.navigation.navigate('AddLocationScreen' , { getData : () => this.makeRemoteRequest() });
    }
    

    render() {
      const {navigate} = this.props.navigation;
      return (
      /*   <View style={{ borderTopWidth: 0 , elevation: 1}}> 
          <FlatList
              data={this.state.data}
              renderItem={({ item }) => (
                
                <ListItem
                  subtitle={item.location}
                  onPress={() => navigate('UpdateLocationScreen', {key: item.id , Location: item.location , getData: () => this.makeRemoteRequest() })}
                />
                
              )}
              keyExtractor={item => item.id}
              ItemSeparatorComponent={this.renderSeparator}
              ListFooterComponent={this.renderFooter}
              AddButtonComponent={this.renderAddButton}
            />
        <View style={{  marginBottom: 30 , elevation: 8 }}> 
            <Button title="Add" style={{  marginBottom: 200, marginVertical: 15 }}  color="#1E407C" onPress={this.handleAdd}/>
        </View>
        <View style={{   marginBottom: 30 ,elevation: 8 }}>
            <Button title="Reload" style={{  marginBottom: 8, marginVertical: 15 }} color="#1E407C" onPress={this.makeRemoteRequest}/>
        </View>
        </View> */
        <View style={styles.container}>

        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <ListItem
              style={styles.list}
              title={item.Building}
              onPress={() => navigate('UpdateLocationScreen', {key: item.id , Building: item.Building, Location: item.Location , getData: () => this.makeRemoteRequest() })}
            />
            
          )}
          keyExtractor={(item, index) => index.toString() }
        />

        <TouchableOpacity onPress={this.handleAdd} style={styles.fab}>
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>

      </View>
      );
    }

  }

  
class AddLocationScreen extends React.Component {
    static navigationOptions = {
      title: 'Add Building',
      headerStyle: { backgroundColor: '#03A9F4'  },
      headerTitleStyle: { flex: 1,  color: 'white' , alignSelf : 'center' ,textAlign: 'center' , justifyContent: "center"  },
      headerRight: (<View />)
    }

    constructor(props) {
        super(props);
        this.handleAdd = this.handleAdd.bind(this);
        this.tempArray = []
        this.state = {
          key: null ,
          currentUser: null,
          Building: '',
          Routes: '', 
          Location2: '',
          data: []
        };
    }

    componentDidMount() {
        const { currentUser } = firebase.auth();
        this.setState({currentUser});
        this.setState({data: [...this.tempArray]});       
    }
    
    componentWillUnmount() {
      this.props.navigation.state.params.getData();
    }

    joinData = () => {
      UUIDGenerator.getRandomUUID((uuid) => { 
          this.tempArray.push({name : this.state.Location2 , key: uuid  });
          this.setState({ data: [...this.tempArray] , Location2: ''})
          console.log(this.tempArray);
          console.log(this.state.data);
      });
    }

    GetItem(item) {
      Alert.alert(item);  
    }
  
    
    
    handleAdd = () => {
        firebase.database().ref('Buildings').push({
            Building : this.state.Building,
            Location: this.state.data
          });

        this.props.navigation.goBack(null);
    }

    handleDelete = (id) => {
      const filteredData = this.state.data.filter(item => item.key !== id);
      this.tempArray = filteredData;
      this.setState({ data: [...this.tempArray] });
      console.log(this.tempArray);
      console.log(this.state.data);
    }

    render() {
      const  {navigate} = this.props.navigation;
      state = this.state; 
      return (
      <View style={styles.container}>
          <View style={styles.centerContent}>
              <TextInput
              placeholder="Building"
              autoCapitalize="words"
              style={styles.textInput}
              onChangeText={Building => this.setState({ Building })}
              value={this.state.Building}
              
            />
            {/* <TextInput
              placeholder="Routes"
              autoCapitalize="none"
              style={styles.textInput}
              onChangeText={Routes => this.setState({ Routes })}
              value={this.state.Routes}
            /> */}
            <Text style={{ fontSize: 20 }}>Tag Locations </Text>
            <View style={{ marginTop: 10 , width: '60%' , height: 350 ,  backgroundColor: 'lightgrey', borderRadius: 4, borderWidth: 1, borderColor: '#d6d7da'}}>
                <FlatList
                  data={this.state.data}
                  extraData={this.state.data}
                  renderItem={({ item }) => (
                    <ListItem
                      style={styles.listSmall}
                      title={item.name}
                      titleStyle={{  color: 'black', fontWeight: 'bold' , width: '100%' }}
                      onPress={() => this.handleDelete(item.key)}
                    />
                    
                  )}
                  keyExtractor={(item) => item.key.toString() }
                />
            </View>
            <TextInput
              placeholder="Tag Location"
              autoCapitalize="words"
              style={styles.textInput}
              onChangeText={data => this.setState({ Location2: data })}
              value={this.state.Location2}

            />
            <View style={{marginBottom: 30, width: 150 }}> 
                <Button title="Add Location List" style={{  marginBottom: 200, marginVertical: 15 }}  color="#1E407C" onPress={this.joinData}/>
            </View>
            <View style={{marginBottom: 30, width: 50 }}> 
                <Button title="Add" style={{  marginBottom: 200, marginVertical: 15 }}  color="#1E407C" onPress={this.handleAdd}/>
            </View> 
          </View>
      </View>
      );
  }
  }




class UpdateLocationScreen extends React.Component {
    constructor(props) {
        super(props);
        this.tempArray = []
        this.state = {
          key: null ,
          Location2: '',
          Building: '',
          data: [] 
        };
    }

    componentDidMount() {
        this.getDetails();        
    }

    componentWillUnmount() {
      this.props.navigation.state.params.getData()
    }
  
    getDetails = () => {
        console.log(this.props.navigation.state.params.key);
        this.tempArray = this.props.navigation.state.params.Location;
        this.setState({ 
          key : this.props.navigation.state.params.key ,
          Building: this.props.navigation.state.params.Building,
          data: [...this.tempArray]
        })
    }
    
    joinData = () => {
      UUIDGenerator.getRandomUUID((uuid) => { 
          this.tempArray.push({name : this.state.Location2 , key: uuid  });
          this.setState({ data: [...this.tempArray] , Location2: ''})
          console.log(this.tempArray);
          console.log(this.state.data);
      });
    }

    handleUpdate = () => {
        firebase.database().ref('Buildings/' + this.state.key).update(
            {
                Building: this.state.Building,
                Location: this.state.data
            }
        );
        this.props.navigation.goBack(null);
        //this.props.navigation.navigate('LocationScreen' );
    }

    handleDelete = () => {
        firebase.database().ref('Buildings').child(this.state.key).remove();
        //this.props.navigation.navigate('LocationScreen' );
        this.props.navigation.goBack(null);
    }

    handleDeleteItem = (id) => {
      const filteredData = this.state.data.filter(item => item.key !== id);
      this.tempArray = filteredData;
      this.setState({ data: [...this.tempArray] });
      console.log(this.tempArray);
      console.log(this.state.data);
    }

    render() {
      const  {navigate} = this.props.navigation;
      state = this.state; 
      return (
      <View style={styles.container}>
          <View style={styles.centerContent}>
              <TextInput
              placeholder="Building"
              autoCapitalize="words"
              style={styles.textInput}
              onChangeText={Building => this.setState({ Building })}
              value={this.state.Building}
              
            />
            <Text style={{ fontSize: 20 }}>Tag Locations </Text>
            <View style={{ marginTop: 10 , width: '60%' , height: 350 ,  backgroundColor: 'lightgrey', borderRadius: 4, borderWidth: 1, borderColor: '#d6d7da'}}>
                <FlatList
                  data={this.state.data}
                  extraData={this.state.data}
                  renderItem={({ item }) => (
                    <ListItem
                      style={styles.listSmall}
                      title={item.name}
                      titleStyle={{  color: 'black', fontWeight: 'bold' , width: '100%' }}
                      onPress={() => this.handleDeleteItem(item.key)}
                    />
                    
                  )}
                  keyExtractor={(item) => item.key.toString() }
                />
            </View>
            <TextInput
              placeholder="Tag Location"
              autoCapitalize="words"
              style={styles.textInput}
              onChangeText={data => this.setState({ Location2: data })}
              value={this.state.Location2}

            />
            <View style={{marginBottom: 30, width: 150 }}> 
                <Button title="Add Location List" style={{  marginBottom: 200, marginVertical: 15 }}  color="#1E407C" onPress={this.joinData}/>
            </View>
            <View style={{marginBottom: 30, width: '80%' }}> 
                <Button title="Update" style={{  marginBottom: 200, marginVertical: 15 }}  color="#1E407C" onPress={this.handleUpdate}/>
                <Button title="Delete" style={{  marginBottom: 200, marginVertical: 15 }}  color="#1E407C" onPress={this.handleDelete}/>
            </View> 
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


  const LocationScreenStack = createStackNavigator({
    LocationScreen : { screen: LocationsScreen },
    UpdateLocationScreen: { screen: UpdateLocationScreen },
    AddLocationScreen: { screen: AddLocationScreen },
  }, {
    initialRoute: 'LocationScreen',
  });
    
  export default LocationScreenStack;