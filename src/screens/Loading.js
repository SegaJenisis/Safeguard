import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import firebase from 'react-native-firebase';

export default class Loading extends React.Component {

  componentDidMount() {
    firebase.auth().onAuthStateChanged(res => {
      if (res == null ) {
          this.props.navigation.navigate('Login');        
      }
      else {
          firebase.database().ref('users/' + res.uid).once('value')
          .then(snapshot => {
          
              let data = snapshot.val();
              console.log(data.userType);

              if ( data.userType == "guard"){ 
                this.props.navigation.navigate('HomeGuard');
              }
              else {
                this.props.navigation.navigate('HomeManager');
              }
            
          })
      }

      console.log(res);
    })

  }

  render() {
    return (
      <View style={styles.container}><Text style={{color:'#e93766', fontSize: 40}}>Loading</Text><ActivityIndicator color='#e93766' size="large" /></View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})