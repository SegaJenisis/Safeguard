import React from 'react'
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity  } from 'react-native'
import styles from './style'
import firebase from 'react-native-firebase';


export default class signUp extends React.Component {
  state = { email: '', password: '', errorMessage: null }
  handleSignUp = () => {
    // TODO: For Firebase athu
    console.log('handleSignUp')

    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((res) => {
        firebase.database().ref('users/' + res.user.uid).set({
          firstName: "Jenis",
          lastName: "Patel",
          email: this.state.email,
          userType: 'guard'
        }).catch(error => console.log(err))

      })
      .then(() => this.props.navigation.navigate('Home'))
      .catch(error => this.setState({ errorMessage: error.message }))

  }

render() {
    return (
      <View style={styles.container}>
      <Text style={{color:'#1E407C', fontSize: 40}}>Sign Up</Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button title="Sign Up" color="#1E407C" onPress={this.handleSignUp}/>
        <View>
        <Text> Already have an account? <Text onPress={() => this.props.navigation.navigate('Login')} style={{color:'#1E407C', fontSize: 18}}> Login </Text></Text>
        </View>
      </View>
    )
  }
}