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
   
      };
    }
  
    componentDidMount() {
      
    }

   
    
    renderAddButton = () => {
      return (
        <View style={{ justifyContent: 'bottom' , elevation: 8}}> 
          <Button title="Add Shift" color="#1E407C"/>
        </View>
      );
    };
  
    handleAdd = () => {
        this.props.navigation.navigate('PickTimeScreen');
    }
    

    render() {
      const {navigate} = this.props.navigation;
      return (
        <View style={styles.centerContent}> 
          <View style={{ marginTop: 50, marginBottom: 30 , width: '60%' }}> 
              <Button title="Add Guards to Shift" style={{  marginBottom: 200, marginVertical: 15 }}  color="#1E407C" onPress={this.handleAdd}/>
          </View>
          <View style={{ marginTop: 50,  marginBottom: 30  , width: '60%'}}>
              <Button title="View Upcoming shifts" style={{  marginBottom: 8, marginVertical: 15 , width: '60%' }} color="#1E407C" onPress={this.makeRemoteRequest}/>
          </View>
        </View>
      );
    }
  }


class PickTimeScreen extends React.Component {
    
    constructor(props) {
      super(props);
  
      this.state = {
        shiftSlot : [
          {
          time: '8 AM to 4 PM',
          startAt: '08:00',
          endAt: '16:00'
          },
          {
            time: '4 PM to 12 AM',
            startAt: '16:00',
            endAt: '23:59'
          },
          {
            time: '12 AM to 8 AM',
            startAt: '00:00',
            endAt: '08:00'
          }
        ]
      };
    }
  
    componentDidMount() {
      
    }

        
    handleAdd = () => {
        
    }
    

    render() {
      const {navigate} = this.props.navigation;
      return (
              
        <View style={styles.container}>

        <FlatList
          data={this.state.shiftSlot}
          renderItem={({ item }) => (
            <ListItem
              style={styles.list}
              title={item.time}
              onPress={() => navigate('CreateShiftScreen', {time: item.time , startAt: item.startAt, endAt: item.endAt })}
            />
            
          )}
          keyExtractor={(item, index) => index.toString() }
        />
        </View>
      );
    }

    
  }
  
  

  class CreateShiftScreen extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
          key: null ,

          selectedGuard: '',
          selectedBuilding: '',
          selectedRoute: '',
          selectedStartDate: null,
          selectedEndDate: null,
          time: '',
          startAt: '',
          endAt: '',

          Guards: [],
          Buildings: [],
          Routes: [],
         
        };
        this.onDateChange = this.onDateChange.bind(this);
    }

    componentDidMount() {
     this.getBuildingInfo()
     this.getDetails();
     this.getGuards();
     this.getBuildings();
    }

    getBuildingInfo = () => {



    }

    getGuards = () => {
      this.setState({ loading: true , data: []});
      firebase.database().ref('users').once('value')
        .then(snapshot => {
            this.setState({
              error: snapshot.error || null,
              loading: false,
              refreshing: false
            });
           var items = [];
           snapshot.forEach((child) => {
            if (child.val().userType == 'guard') {
              items.push({
                value : child.key ,
                label : child.val().firstName + ' ' + child.val().lastName,
              })
            }
           
          })
           this.setState({ Guards : items})
        })
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
           var fullItems = [];
           snapshot.forEach((child) => {
           
              items.push({
                value : child.key ,
                label : child.val().Building,
              })
              fullItems.push({
                key: child.key,
                Building: child.val().Building,
                Routes: child.val().Routes

              })    
              
          })
           this.setState({ Buildings : items})
           this.setState({fullBuilding : fullItems  })
        })
    }

    getRoutes = (id) => {
      console.log(id)
      firebase.database().ref('Buildings/' + id + '/Routes').once('value')
      .then(snapshot => {
      
         var items = [];
         snapshot.forEach((child) => {
         
            items.push({
              value : child.key ,
              label : child.val().Name,
            })
                     
        
        })
         this.setState({ Routes : items})
        
      })
     
    }

    onDateChange(date, type) {
      //function to handle the date change 
      if (type === 'END_DATE') {
        this.setState({
          selectedEndDate: date,
        });
      } else {
        this.setState({
          selectedStartDate: date,
          selectedEndDate: null,
        });
      }
    }
  

    getDetails = () => {
       // console.log(this.props.navigation.state.params.key);
      this.setState({time : this.props.navigation.state.params.time , startAt: this.props.navigation.state.params.startAt, endAt: this.props.navigation.state.params.endAt})
    }
    
    handleAdd = () => {
      const moment = extendMoment(Moment);
      var startTime = this.state.startAt.split(':');
      var start = this.state.selectedStartDate.clone();

      
      var endTime = this.state.endAt.split(':');
      var end = this.state.selectedStartDate.clone();
      //var m = moment(dateString, 'ddd MMM D YYYY HH:mm:ss ZZ');
      // Use moment(Date) if your input is a JS Date
      //var m = moment(date);
         start.set({h: startTime[0], m: startTime[1]});
       // console.log(start.format());
      //  console.log(start.toDate().toString());

         end.set({h: endTime[0], m: endTime[1]});
        //console.log(end.format());
        //console.log(end.toDate().toString());

        console.log(this.state.selectedStartDate.toDate().toString())
        console.log(this.state.selectedEndDate.toDate().toString())
        console.log(this.state);
        if (this.state.selectedStartDate.toDate().toString() == this.state.selectedEndDate.toDate().toString() ){
            firebase.database().ref('Shifts/' + this.state.selectedGuard +'/Shifts').push({ 
                  Guard: this.state.selectedGuard,
                  Building: this.state.selectedBuilding,
                  Route: this.state.selectedRoute,
                  Date: this.state.selectedStartDate.format('MM/DD/YYYY'),
                  StartTime: start.format(),
                  EndTme: end.format()
                

          });
          this.props.navigation.goBack(null);
        }
        else {
          tempStart = this.state.selectedStartDate.clone();
          tempEnd = this.state.selectedEndDate.clone();

          let range = moment().range(tempStart, tempEnd), /*can handle leap year*/ 
            array = Array.from(range.by("days")); /*days, hours, years, etc.*/ 
            

            
            var tempData = this.state.fullBuilding;
            var tempPath = [];
            tempData.map(x => {
                  if ( x.key == this.state.selectedBuilding ){
                      tempPath.push( x.Routes[this.state.selectedRoute]  )
                      //console.log(x.Routes[this.state.selectedRoute].Path)
                  }

              })
            
             tempPath.forEach(entry => { 
              entry.Path.forEach(item => { 
                  item['Tapped'] = false;
              }) 

             })
        
             console.log(tempPath) 



            array.map(m => {
              var tempStartTime = m.clone();
              tempStartTime.set({h: parseInt(startTime[0]), m: parseInt(startTime[1]) })

              var tempEndTime = m.clone();
              tempEndTime.set({h: parseInt(endTime[0]) , m: parseInt(endTime[1]) })

              let tempRange = moment().range(tempStartTime, tempEndTime)
              array = Array.from(range.by("hours"));

              

              const day_start = tempStartTime.startOf('day').hours(parseInt(startTime[0]));
              const day_end = tempEndTime.startOf('day').hours(parseInt(endTime[0]));
              const day = moment.range(day_start, day_end);
              const time_slots = Array.from(day.by('hours', {step: 1}))
              
              console.log(time_slots);
              
              
              
              
              //console.log(this.state.fullBuilding[0].Routes[this.state.selectedRoute].Path);
              var tapLog = []
               time_slots.map(p => {  
                 tapLog.push({ 
                      Date : p.format(),
                      Route: tempPath[0]
                })
                 console.log(p.format());
              });
              
              firebase.database().ref('Shifts/' + this.state.selectedGuard +'/Shifts').push({ 
                Guard: this.state.selectedGuard,
                Building: this.state.selectedBuilding,
                Route: this.state.selectedRoute,
                Date: m.format('YYYY-MM-DD'),
                StartTime: tempStartTime.format(),
                EndTme: tempEndTime.format(),
                TapLog: tapLog,

              });
                console.log(m.format("YYYY-MM-DD")); /*or any format you like*/
            });

            this.props.navigation.goBack(null);
        }
    
        //this.props.navigation.goBack(null);
    }


    render() {
      const  {navigate} = this.props.navigation;
      const { selectedStartDate, selectedEndDate } = this.state;
      const minDate = new Date(); // Min date
      const maxDate = new Date(2019, 5, 9); // Max date
      const startDate = selectedStartDate ? selectedStartDate.toString() : ''; //Start date
      const endDate = selectedEndDate ? selectedEndDate.toString() : ''; //End date


      state = this.state; 
      return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text> {state.key} </Text>
          <View style={{ flexDirection:"row" , alignItems: 'center'  }}> 
            <Text style={styles.labelText}> Guards : </Text>         
            <Dropdown
                containerStyle={{width: '60%' }}
                data={this.state.Guards}
                value={this.state.selectedGuard}
                onChangeText={ (value) => { this.setState({ selectedGuard: value }) }}
            />
          </View>
          <View style={{ flexDirection:"row" , alignItems: 'center'  }}> 
            <Text style={styles.labelText}> Building : </Text>         
            <Dropdown
                containerStyle={{width: '60%' }}
                data={this.state.Buildings}
                value={this.state.selectedBuilding}
                onChangeText={ (value) => { this.getRoutes(value) , this.setState({ selectedBuilding: value }) }}
            />
          </View>
          <View style={{ flexDirection:"row" , alignItems: 'center'  }}> 
            <Text style={styles.labelText}> Routes : </Text>         
            <Dropdown
                containerStyle={{width: '60%' }}
                data={this.state.Routes}
                value={this.state.selectedRoute}
                onChangeText={ (value) => { this.setState({ selectedRoute: value }) }}
            />
          </View>
          <View style={{ flexDirection:"row" , alignItems: 'center'  }}> 
            <CalendarPicker
            startFromMonday={true}
            allowRangeSelection={true}
            minDate={minDate}
            maxDate={maxDate}
            weekdays={['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']}
            months={[
              'January',
              'Febraury',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ]}
            previousTitle="Previous"
            nextTitle="Next"
            todayBackgroundColor="#e6ffe6"
            selectedDayColor="#66ff33"
            selectedDayTextColor="#000000"
            scaleFactor={475}
            textStyle={{
              fontFamily: 'Cochin',
              color: '#000000',
            }}
            onDateChange={this.onDateChange}
          />
           
            
          </View>
          <View>
            <Text style={{padding:3}}>SELECTED START DATE :</Text>
            <Text style={{padding:3}}>{startDate}</Text>
            <Text style={{padding:3}}>SELECTED END DATE : </Text>
            <Text style={{padding:3}}>{endDate}</Text>
          </View>  

        <View style={{marginBottom: 30 }}> 
            <Button title="Add" style={{  marginBottom: 200, marginVertical: 15 }}  color="#1E407C" onPress={() => this.handleAdd()}/>
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


  const ShiftsScreenStack = createStackNavigator({
    ShiftScreen : { screen: ShiftScreen },
    PickTimeScreen: { screen: PickTimeScreen },
    CreateShiftScreen: {screen: CreateShiftScreen }
  }, {
    initialRoute: 'ShiftScreen',
  });
    
  export default ShiftsScreenStack;