import React, {Component} from 'react';
import {TouchableOpacity, StyleSheet, Text, View, PermissionsAndroid} from 'react-native';
import RNGooglePlaces from 'react-native-google-places';

export default class App extends Component {

  state = {
    coords: {
      latitude: 0,
      longitude: 0,
    },
    place: {
      placeID: '',
      latitude: '',
      longitude: '',
      name: '',
      website: '',
    },
  };

  requestLocationPermission = () => {
        
    try {
        const response = PermissionsAndroid
            .request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

        if (response === PermissionsAndroid.RESULTS.GRANTED)
            return true;

        return false;
        
    } catch (err) {
      return false;
    }
  }

  getInitialUserPosition = () => {
    navigator.geolocation.getCurrentPosition( 
        (position) => {
            this.setUserPosition(position.coords);
        }, () => {}
    );
  }

  watchUserPosition = () => {
    const options = {
        enableHighAccuracy: true, 
        distanceFilter: 1,
        maximumAge: 5000,
    };

    this.watchID = navigator.geolocation.watchPosition((position) => {
        this.setUserPosition(position.coords);
    }, () => {}, options);
  }

  setUserPosition = (coords) => {
    this.setState({coords});
  }

  getCurrentPlace = () => {
    RNGooglePlaces.getCurrentPlace()
    .then((results) => this.setState({place: results[0]}))
    .catch((error) => console.log(error.message));
  }

  openSearchModal = () => {

    RNGooglePlaces.openAutocompleteModal({
      type: 'establishment',
      country: 'BR',
      latitude: this.state.coords.latitude,
      longitude: this.state.coords.longitude,
      radius: 10,
    })
    .then((place) => {
      this.setState({place});
    })
    .catch(error => console.log("error", error.message));
  }

  openPlacePickerModal =() => {
    
    RNGooglePlaces.openPlacePickerModal({
      latitude: this.state.coords.latitude,
      longitude: this.state.coords.longitude,
      radius: 10
    })
    .then((place) => {
		  this.setState({place});
    })
    .catch(error => console.log(error.message));
  }

  componentDidMount() {
    this.requestLocationPermission();
    this.getInitialUserPosition();
    this.watchUserPosition();
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.openSearchModal}
        >
          <Text style={styles.welcome}>Open Search Modal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.openPlacePickerModal}
        >
          <Text style={styles.welcome}>Open Place Picker</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.getCurrentPlace}
        >
          <Text style={styles.welcome}>Get Current Place</Text>
        </TouchableOpacity>
        
        <Text>ID: {this.state.place.placeID}</Text>
        <Text>Nome: {this.state.place.name}</Text>
        <Text>Latitude: {this.state.place.latitude}</Text>
        <Text>longitude: {this.state.place.longitude}</Text>
        <Text>Site: {this.state.place.website}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 24,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
