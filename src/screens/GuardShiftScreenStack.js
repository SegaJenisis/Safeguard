import React from 'react'
import { StyleSheet, Platform, Image, Text, TextInput, View, Button, ScrollView, FlatList, ActivityIndicator} from 'react-native'
import { List, ListItem  } from 'react-native-elements'
import firebase from 'react-native-firebase';
import {createBottomTabNavigator , createStackNavigator } from 'react-navigation';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import {Dropdown } from 'react-native-material-dropdown';
import CalendarPicker from 'react-native-calendar-picker';
import Moment from 'moment';
import { extendMoment } from 'moment-range';



class ShiftScreen extends React.Component {

    constructor(props) {

      super(props);
  
      this.state = {
        currentUser: null
      };
    }
  
    componentDidMount() {
      const { currentUser } = firebase.auth();
      this.setState({ currentUser });      
    }

   
    
    renderAddButton = () => {
      return (
        <View style={{ justifyContent: 'bottom' , elevation: 8}}> 
          <Button title="Add Shift" color="#1E407C"/>
        </View>
      );
    };
  
    handleAdd = () => {
        this.props.navigation.navigate('ViewShiftScreen' , { currentUser: this.state.currentUser});
    }
    

    render() {
      const {navigate} = this.props.navigation;
      return (
        <View style={styles.centerContent}> 
          <View style={{ marginTop: 50, marginBottom: 30 , width: '60%' }}> 
              <Button title="View My Shifts" style={{  marginBottom: 200, marginVertical: 15 }}  color="#1E407C" onPress={this.handleAdd}/>
          </View>
        </View>
      );
    }
  }


class ViewShiftScreen extends React.Component {
    
    constructor(props) {
      super(props);
      this.userId = firebase.auth().currentUser.uid
      this.state = {
        currentUser: null,
        data:[]
      };
    }
  
    componentDidMount() {
      this.getDetails();
      this.getMyShifts();
     
      console.log(this.userId)
    }
    getDetails(){
      this.setState({ currentUser: this.props.navigation.state.params.currentUser})

    }
    getMyShifts = () => {
      const moment = extendMoment(Moment);
      console.log(this.state.currentUser)
      firebase.database().ref('Shifts/' + this.userId + '/Shifts').once('value')
      .then(snapshot => {
         var items = [];
         var i = 0;
         console.log(snapshot)
         snapshot.forEach((child) => {
            //var tempBuildData = firebase.database().ref('Buildings/' + child.val().Building).once('value');

            //console.log(tempBuildData)
            
          items.push({
            id: child.key ,
            Building: child.val().Building,
            Date: child.val().Date,
            StartTime: moment(child.val().StartTime ).format("h:mm A") ,
            EndTime: moment(child.val().EndTime).format("h:mm A"), 
          })
          i++; 
         } 
         
         )
         this.setState({ data : items})
        
      })
      console.log(this.state.data);


    }    
    
    handleAdd = () => {
        
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
              title={item.Date }
              subtitle={item.StartTime + ' To ' + item.EndTime}
              //onPress={() => navigate('CheckInScreen', {id: item.id , startAt: item.startAt, endAt: item.endAt })}
            />
            
          )}
          keyExtractor={(item, index) => index.toString() }
        />
        </View>
      );
    }

    
  }
  





  class CheckInScreen extends React.Component { 

    componentDidMount() {
      
    }

    getDetails(){
      

    }


    getMyShifts = () => {
      const moment = extendMoment(Moment);
      console.log(this.state.currentUser)
      firebase.database().ref('Shifts/' + this.userId + '/Shifts/').once('value')
      .then(snapshot => {
         var items = [];
         var i = 0;
         console.log(snapshot)
         snapshot.forEach((child) => {
            //var tempBuildData = firebase.database().ref('Buildings/' + child.val().Building).once('value');

            //console.log(tempBuildData)
            
          items.push({
            id: child.key ,
            Building: child.val().Building,
            Date: child.val().Date,
            StartTime: moment(child.val().StartTime ).format("h:mm A") ,
            EndTime: moment(child.val().EndTime).format("h:mm A"), 
          })
          i++; 
         } 
         
         )
         this.setState({ data : items})
        
      })
      console.log(this.state.data);


  }    
    



  render() {
        let { supported, enabled, tag, isWriting, urlToWrite, parsedText, rtdType } = this.state;
        return (
            <ScrollView style={{flex: 1}}>
                { Platform.OS === 'ios' && <View style={{ height: 60 }} /> }

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                   {/*  <Text>{`Is NFC supported ? ${supported}`}</Text>
                    <Text>{`Is NFC enabled (Android only)? ${enabled}`}</Text> */}

                    <TouchableOpacity style={{ marginTop: 20 }}>
                        {/* <Text style={{ color: 'blue' }}>Start Tag Detection</Text> */}
                        <Button title="Start Tag Detection" color="#008000" onPress={this._startDetection}  />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginTop: 20 }} >
                        {/* <Text style={{ color: 'red' }}>Stop Tag Detection</Text> */}
                        <Button title="Stop Tag Detection" color="#8B0000" onPress={this._stopDetection} />
                    </TouchableOpacity>

                    {/* <TouchableOpacity style={{ marginTop: 20 }} onPress={this._goToNfcSetting}>
                        <Text >(android) Go to NFC setting</Text>
                    </TouchableOpacity> */}

                    
                        <TouchableOpacity style={{ marginTop: 50 }} >
                            <Button title="Clear" color="#1E407C" onPress={this._clearMessages} />
                        </TouchableOpacity>
                  {/*   <Text style={{ marginTop: 20 }}>{`Current tag JSON: ${JSON.stringify(tag)}`}</Text>
                    { parsedText &&  } */}
                    <Text style={{ marginTop: 10, marginBottom: 20, fontSize: 18 }}>{`Parsed Text: ${parsedText}`}</Text>
                </View>
            </ScrollView>
        )
    }




    
    _requestFormat = () => {
      let {isWriting} = this.state;
      if (isWriting) {
          return;
      }

      this.setState({isWriting: true});
      NfcManager.requestNdefWrite(null, {format: true})
          .then(() => console.log('format completed'))
          .catch(err => console.warn(err))
          .then(() => this.setState({isWriting: false}));
  }

  _requestNdefWrite = () => {
      let {isWriting, urlToWrite, rtdType} = this.state;
      if (isWriting) {
          return;
      }

      let bytes;

     // if (rtdType === RtdType.URL) {
         // bytes = buildUrlPayload(urlToWrite);
      //} else if (rtdType === RtdType.TEXT) {
          bytes = buildTextPayload(urlToWrite);
     // }

      this.setState({isWriting: true});
      NfcManager.requestNdefWrite(bytes)
          .then(() => {
            console.log('write completed')
            if (urlToWrite != null){ 
              
                firebase.database().ref('LocationTags/' + urlToWrite ).set({
                  Location : urlToWrite,
                  TimeCreated : new Date().toLocaleString(),
                  Adminstrator : this.state.currentUser.uid,
                  Building: this.state.selectedBuilding,
                });
            }
          })
          .catch(err => console.warn(err))
          .then(() => this.setState({isWriting: false}));
  }

  _cancelNdefWrite = () => {
      this.setState({isWriting: false});
      NfcManager.cancelNdefWrite()
          .then(() => console.log('write cancelled'))
          .catch(err => console.warn(err))
  }

 

  _startNfc() {
      NfcManager.start({
          onSessionClosedIOS: () => {
              console.log('ios session closed');
          }
      })
          .then(result => {
              console.log('start OK', result);
          })
          .catch(error => {
              console.warn('start fail', error);
              this.setState({supported: false});
          })

      if (Platform.OS === 'android') {
          NfcManager.getLaunchTagEvent()
              .then(tag => {
                  console.log('launch tag', tag);
                  if (tag) {
                      this.setState({ tag });
                  }
              })
              .catch(err => {
                  console.log(err);
              })
          NfcManager.isEnabled()
              .then(enabled => {
                  this.setState({ enabled });
              })
              .catch(err => {
                  console.log(err);
              })
          NfcManager.onStateChanged(
              event => {
                  if (event.state === 'on') {
                      this.setState({enabled: true});
                  } else if (event.state === 'off') {
                      this.setState({enabled: false});
                  } else if (event.state === 'turning_on') {
                      // do whatever you want
                  } else if (event.state === 'turning_off') {
                      // do whatever you want
                  }
              }
          )
              .then(sub => {
                  this._stateChangedSubscription = sub; 
                  // remember to call this._stateChangedSubscription.remove()
                  // when you don't want to listen to this anymore
              })
              .catch(err => {
                  console.warn(err);
              })
      }
  }

  _onTagDiscovered = tag => {
      console.log('Tag Discovered', tag);
      this.setState({ tag });
      let url = this._parseUri(tag);
      if (url) {
          Linking.openURL(url)
              .catch(err => {
                  console.warn(err);
              })
      }

      let text = this._parseText(tag);
      this.setState({parsedText: text});
      
      // if (text != null){ 
      //   firebaseApp.onReady().then((app) => {
      //     firebase.database().ref('TapLogs').push({
      //       Location : text,
      //       Time: new Date().toLocaleString(),
      //       User: 'Barb'
      //     });
          
      //   });
      // }
   

  }


  _startDetection = () => {
      NfcManager.registerTagEvent(this._onTagDiscovered)
          .then(result => {
              console.log('registerTagEvent OK', result)
          })
          .catch(error => {
              console.warn('registerTagEvent fail', error)
          })
  }

  _stopDetection = () => {
      NfcManager.unregisterTagEvent()
          .then(result => {
              console.log('unregisterTagEvent OK', result)
          })
          .catch(error => {
              console.warn('unregisterTagEvent fail', error)
          })
  }

  _clearMessages = () => {
      this.setState({tag: null , parsedText: '' });
  }

  _goToNfcSetting = () => {
      if (Platform.OS === 'android') {
          NfcManager.goToNfcSetting()
              .then(result => {
                  console.log('goToNfcSetting OK', result)
              })
              .catch(error => {
                  console.warn('goToNfcSetting fail', error)
              })
      }
  }

  _parseUri = (tag) => {
      try {
          if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_URI)) {
              return Ndef.uri.decodePayload(tag.ndefMessage[0].payload);
          }
      } catch (e) {
          console.log(e);
      }
      return null;
  }

  _parseText = (tag) => {
      try {
          if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT)) {
              return Ndef.text.decodePayload(tag.ndefMessage[0].payload);
          }
      } catch (e) {
          console.log(e);
      }
      
      return null;
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
    labelText: {
      fontSize: 20 , 
      marginTop: 25
     
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
    LabelTextInput: {
      height: 40,
      fontSize:15,
      width: '50%',
      borderColor: '#9b9b9b',
      borderBottomWidth: 1,
      marginTop: 0,
      marginVertical: 0
    },
    centerContent: {
      flex: 1,
      alignItems: 'center'
    }
  });


  const GuardShiftsScreenStack = createStackNavigator({
    ShiftScreen : { screen: ShiftScreen },
    ViewShiftScreen: { screen: ViewShiftScreen },
    CheckInScreen: {screen: CheckInScreen }
  }, {
    initialRoute: 'ShiftScreen',
  });
    
  export default GuardShiftsScreenStack;