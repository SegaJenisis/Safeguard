import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import {createBottomTabNavigator , createStackNavigator , withNavigationFocus} from 'react-navigation';
import {Dropdown } from 'react-native-material-dropdown';

import {
    StyleSheet,
    View,
    Text,
    Button,
    Platform,
    TouchableOpacity,
    Linking,
    TextInput,
    ScrollView,
} from 'react-native';
import NfcManager, {Ndef} from 'react-native-nfc-manager';

const RtdType = {
     URL: 0,
     TEXT: 1,
};

function buildUrlPayload(valueToWrite) {
    return Ndef.encodeMessage([
        Ndef.uriRecord(valueToWrite),
    ]);
}

function buildTextPayload(valueToWrite) {
    return Ndef.encodeMessage([
        Ndef.textRecord(valueToWrite),
    ]);
}





 class NFCManagerScreen extends React.Component {
     
    constructor(props) {
        super(props);
        const RtdType = {
            URL: 1,
            TEXT: 0,
        };
        this.state = {
            supported: true,
            enabled: false,
            isWriting: false,
            urlToWrite: 'Enter Location for Tag',
            rtdType: RtdType.TEXT,
            parsedText: null,
            tag: {},
            currentUser: null,

            selectedBuilding: '',
            selectedLocation: '',
            Buildings: [],
            Locations: [],
        }
          
      
    }

    

    componentDidMount() {
        const { currentUser } = firebase.auth()
        this.setState({currentUser})
        this.getBuildings();
        NfcManager.isSupported()
            .then(supported => {
                this.setState({ supported });
                if (supported) {
                    this._startNfc();
                }
            })
    }

    componentWillUnmount() {

        if (this._stateChangedSubscription) {
            this._stateChangedSubscription.remove();
        }
    }

    getBuildings = () => {
    
        firebase.database().ref('Buildings').once('value')
          .then(snapshot => {
              this.setState({
                error: snapshot.error || null,
                loading: false,
                refreshing: false
              });
             var items = [];
             snapshot.forEach((child) => {
             
                items.push({
                  value : child.key ,
                  label : child.val().Building,
                })
                         
            
            })
             this.setState({ Buildings : items})
            
          })
      }

      getLocations = (id) => {
        console.log(id)
        firebase.database().ref('Buildings/' + id + '/Location').once('value')
        .then(snapshot => {
            console.log(snapshot);
           var items = [];
           snapshot.forEach((child) => {
            
              items.push({
                value : child.val().key ,
                label : child.val().name,
              })
                       
          
          })
           this.setState({ Locations : items})
          
        })
       console.log(this.state.Locations)
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

                    
                        <View style={{padding: 10, marginTop: 20, backgroundColor: '#e0e0e0' , width: '80%'}}>
                            <Text>Write Location Tags</Text>
                           {/*  <View style={{flexDirection: 'row', marginTop: 10}}>
                                <Text style={{marginRight: 15}}>Type: </Text>
                                {
                                    Object.keys(RtdType).map(
                                        key => (
                                            <TouchableOpacity 
                                                key={key}
                                                style={{marginRight: 10}}
                                                onPress={() => this.setState({rtdType: RtdType[key]})}
                                            >
                                                <Text style={{color: rtdType === RtdType[key] ? 'blue' : '#aaa'}}>
                                                    {key}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    ) 
                                }
                            </View> */}
                            {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TextInput
                                    style={{width: 200}}
                                    value={urlToWrite}
                                    onChangeText={urlToWrite => this.setState({ urlToWrite })}
                                />
                            </View> */}
                            <View style={{ flexDirection:"row" , alignItems: 'center'  }}> 
                                <Text style={styles.labelText}> Building : </Text>         
                                <Dropdown
                                    containerStyle={{width: '60%' }}
                                    data={this.state.Buildings}
                                    value={this.state.selectedBuilding}
                                    onChangeText={ (value) => { this.getLocations(value) , this.setState({ selectedBuilding: value }) }}
                                />
                            </View>
                            <View style={{ flexDirection:"row" , alignItems: 'center'  }}> 
                                <Text style={styles.labelText}> Tag Location : </Text>         
                                <Dropdown
                                    containerStyle={{width: '60%' }}
                                    data={this.state.Locations}
                                    value={this.state.selectedLocation}
                                    onChangeText={ (value) => { this.setState({ urlToWrite: value }) }}
                                />
                            </View>

                            <TouchableOpacity 
                                style={{ marginTop: 20, borderWidth: 1, borderColor: 'blue', padding: 10 }} 
                                onPress={isWriting ? this._cancelNdefWrite : this._requestNdefWrite}>
                                <Text style={{color: 'blue'}}>{`${isWriting ? 'Cancel' : 'Write To Tag'}`}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={{ marginTop: 20, borderWidth: 1, borderColor: 'blue', padding: 10 }} 
                                onPress={isWriting ? this._cancelNdefWrite : this._requestFormat}>
                                <Text style={{color: 'blue'}}>{`${isWriting ? 'Cancel' : 'Erase Tag'}`}</Text>
                            </TouchableOpacity>

                   
                        </View>
                    
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


const NFCManagerStack = createStackNavigator({
    NFCManager : { screen: NFCManagerScreen },
  }, {
    initialRoute: 'NFCManager',
  });
    
export default NFCManagerStack;
