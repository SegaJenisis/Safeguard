import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import {createBottomTabNavigator , createStackNavigator , withNavigationFocus} from 'react-navigation';
import {
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


// const androidConfig = {
//   clientId: '504357914207-gb1sia9hc88bkvrboi488sl4si34lejs.apps.googleusercontent.com',
//   appId: '1:504357914207:android:3cd99d94de6440e9',
//   apiKey: 'AIzaSyALA2pvd-dtcsmUDuaSI3D6IYGAhb3Bmqw',
//   databaseURL: 'https://reactnfc.firebaseio.com',
//   storageBucket: 'reactnfc.appspot.com',
//   messagingSenderId: '504357914207',
//   projectId: '504357914207',

//   // enable persistence by adding the below flag
//   persistence: true,
// };

// const firebaseApp = firebase.initializeApp(
//   // use platform specific firebase config
//   Platform.OS === 'ios' ? iosConfig : androidConfig,
//   // name of this app
//   'nfcapp',
// );





const RtdType = {
    URL: 1,
    TEXT: 0,
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





class NFCGuardScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            supported: true,
            enabled: false,
            isWriting: false,
            urlToWrite: 'Enter Location for Tag',
            rtdType: RtdType.URL,
            parsedText: null,
            tag: {},
            currentUser: null
        }
          
      
    }

    componentDidMount() {
        const { currentUser } = firebase.auth()
        this.setState({currentUser})
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

    componentDidUpdate(prevProps){
/* 
        if (this.props.parsedText != prevProps.parsedText) {


            firebase.database().ref().push({
                TagLocation : 'blah',
                lname : 'yrsgds'
            }).then((data)=>{
                //success callback
                console.log('data ' , data)
            }).catch((error)=>{
                //error callback
                console.log('error ' , error)
            })
        } */


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
{/* 
                    
                        <View style={{padding: 10, marginTop: 20, backgroundColor: '#e0e0e0'}}>
                            <Text>Write Location Tags</Text>
                            <View style={{flexDirection: 'row', marginTop: 10}}>
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
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TextInput
                                    style={{width: 200}}
                                    value={urlToWrite}
                                    onChangeText={urlToWrite => this.setState({ urlToWrite })}
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

                   
                        </View> */}
                    
                        <TouchableOpacity style={{ marginTop: 50 }} >
                            <Button title="Clear" color="#1E407C" onPress={this._clearMessages} />
                        </TouchableOpacity>
                    <Text style={{ marginTop: 20 }}>{`Current tag JSON: ${JSON.stringify(tag)}`}</Text>
                    { parsedText && <Text style={{ marginTop: 10, marginBottom: 20, fontSize: 18 }}>{`Parsed Text: ${parsedText}`}</Text>}
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

        if (rtdType === RtdType.URL) {
            bytes = buildUrlPayload(urlToWrite);
        } else if (rtdType === RtdType.TEXT) {
            bytes = buildTextPayload(urlToWrite);
        }

        this.setState({isWriting: true});
        NfcManager.requestNdefWrite(bytes)
            .then(() => {
              console.log('write completed')
            //   if (urlToWrite != null){ 
            //     firebaseApp.onReady().then((app) => {
            //       firebase.app('nfcapp').database().ref('LocationTags').push({
            //         Location : urlToWrite,
            //         TimeCreated : new Date().toLocaleString(),
            //         Adminstrator : 'Barb'
            //       });
                  
            //     });
            //   }
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

    _requestAndroidBeam = () => {
        let {isWriting, urlToWrite, rtdType} = this.state;
        if (isWriting) {
            return;
        }

        let bytes;

        if (rtdType === RtdType.URL) {
            bytes = buildUrlPayload(urlToWrite);
        } else if (rtdType === RtdType.TEXT) {
            bytes = buildTextPayload(urlToWrite);
        }

        this.setState({isWriting: true});
        NfcManager.setNdefPushMessage(bytes)
            .then(() => console.log('beam request completed'))
            .catch(err => console.warn(err))
    }

    _cancelAndroidBeam = () => {
        this.setState({isWriting: false});
        NfcManager.setNdefPushMessage(null)
            .then(() => console.log('beam cancelled'))
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
        if (text != null){ 
            console.log(this.state.currentUser)
            firebase.database().ref('TapLogs').push({
              Location : text,
              Time: new Date().toLocaleString(),
              User: this.state.currentUser.uid
            });
            
         
        }
     

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
        this.setState({tag: null});
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

const NFCGuardStack = createStackNavigator({
    NFCGuard : { screen: NFCGuardScreen },
  }, {
    initialRoute: 'NFCGuard',
  });
    
export default NFCGuardStack;

