import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import styles from './style'
import firebase from 'react-native-firebase';


export default class Login extends React.Component {
  state = { email: '', password: '', errorMessage: null , userData: null}
  handleLogin = () => {
    // TODO: Firebase stuff...
    console.log('handleLogin');

    firebase
    .auth()
    .signInWithEmailAndPassword(this.state.email, this.state.password)
    .then((res) => {
        firebase.database().ref('users/' + res.user.uid).once('value')
        .then(snapshot => {
        
            let data = snapshot.val();
           
            if ( data.userType == "guard"){ 
              this.props.navigation.navigate('HomeGuard');
            }
            else {
              this.props.navigation.navigate('HomeManager');
            }
          
        })
        
    }).catch(error => this.setState({ errorMessage: error.message }))  
    

  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={{color:'#1E407C', fontSize: 40}}>Login</Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button title="Login" color="#1E407C" onPress={this.handleLogin} />
        <View>
        {/* <Text> Don't have an account? <Text onPress={() => this.props.navigation.navigate('SignUp')} style={{color:'#1E407C', fontSize: 18}}> Contact your adminstrator </Text></Text> */}
        </View>
      </View>
    )
  }
}