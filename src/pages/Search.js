/* eslint-disable no-undef */
/* eslint-disable no-alert */
import React, {Component} from 'react';
import {
  Text,
  View,
  // Button,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';



export default class Search extends Component {
  state = {
    currentPosition: 'unknown',
    data: null,
    zipcode: null,
  };

  componentDidMount() {
    Geolocation.getCurrentPosition(
      position => this.setState({currentPosition: position}),
      error => alert(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
  }

  fetchYelpData = (lat, lng) => {
    const latitude =
      typeof lat === 'undefined' || typeof lat === 'object'
        ? this.state.currentPosition.coords.latitude
        : lat;
    const longitude =
      typeof lng === 'undefined' || typeof lng === 'object'
        ? this.state.currentPosition.coords.longitude
        : lng;

    const API_KEY =
      'qyzfIoncbr26OJkTIZzRJqEtkf5bv-nBJ8JWvY34N3tscPDCU4ewoCU-BWKhizUkofc9T0Hkf4tCqR8B-n1RnqeE0vgXwB8lbmBGC-HBFXoxtihiYT0f5TKiNweEXnYx';
    const baseURL = 'https://api.yelp.com/v3/businesses/search';
    let url = `${baseURL}?term=bubble+tea&latitude=${latitude}&longitude=${longitude}`;
    let header = new Headers();
    header.append('Authorization', 'Bearer ' + API_KEY);
    let req = new Request(url, {
      headers: header,
      method: 'GET',
    });

    fetch(req)
      .then(response => response.json())
      .then(data =>
        this.props.navigation.navigate('Results', {
          result: data,
          position: {latitude, longitude},
        }),
      )
      .catch(error => console.log('issa err', error));
  };

  fetchYelpDataByZipCode = () => {
    const API_KEY =
      'k40SreRI8D9Vq8t25lJ69pBb0pJh80Yg3MC17LrM2bSGoUcH97POMPhsSrvla1DZ';
    let url = `https://www.zipcodeapi.com/rest/${API_KEY}/info.json/${
      this.state.zipcode
    }/degrees`;
    let header = new Headers();
    header.append('Authorization', 'Bearer ' + API_KEY);
    let req = new Request(url, {
      headers: header,
      method: 'GET',
    });

    fetch(req)
      .then(response => response.json())
      .then(data => {
        this.fetchYelpData(data.lat, data.lng);
      })
      .catch(error => console.log('issa err', error));
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.buttonNearMe}
          onPress={this.fetchYelpData}>
          <Text style={styles.buttonText}>Find </Text>
          <Text style={styles.buttonText}>Bubble Tea </Text>
          <Text style={styles.buttonText}>Near Me</Text>
        </TouchableOpacity>

        <Text style={styles.zipText}> Or </Text>

        <Text style={styles.zipText}>Enter A Zip Code:</Text>
        <TextInput
          style={styles.input}
          value={this.state.zipcode}
          onChangeText={input => this.setState({zipcode: input})}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={this.fetchYelpDataByZipCode}>
          <Text style={styles.buttonText}>Find Bubble Tea</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
  },
  zipText: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 45,
  },
  input: {
    height: 40,
    width: 250,
    paddingLeft: 10,
    backgroundColor: 'orange',
    marginTop: 5,
    marginLeft: 60,
  },
  buttonNearMe: {
    display: 'flex',
    textAlign: 'center',
    padding: 20,
    backgroundColor: 'rgb(37, 160, 205)',
    height: 180,
    width: 180,
    borderRadius: 200 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 90,
    marginTop: 45,
  },
  button: {
    display: 'flex',
    borderRadius: 7,
    padding: 20,
    backgroundColor: 'rgb(37, 160, 205)',
    width: 190,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 90,
    marginTop: 30,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
});
