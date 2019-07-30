import React from 'react'
import { StyleSheet, Platform, Image, Text, View, Button} from 'react-native'
import firebase from 'react-native-firebase';

export default class Home extends React.Component {
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
      <View style={styles.container}><Text>
          Hi {currentUser && currentUser.email}!
        </Text>
        <Button title="Sign Out" color="#1E407C" onPress={this.handleSignOut} />
        </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})