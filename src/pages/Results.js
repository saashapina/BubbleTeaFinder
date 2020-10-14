import React, {Component} from 'react';
import {
  Text,
  View,
  Button,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking
} from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout
} from 'react-native-maps';
import {showLocation} from 'react-native-map-link';
import Modal from 'react-native-modal';
import MapViewDirections from 'react-native-maps-directions';

const GOOGLE_DIRECTIONS_API_KEY = 'AIzaSyAG1zFOgXBEvlnp61x1xVaeN9ZCaH2aOx4'; //Google Directions apikey

export default class Results extends Component {
  state = {
    results: this.props.route.params.result.businesses,
    isModalVisibile: false,
    selectedMarkerInfo: '',
    selectedMarkerPosition: {
      latitude: this.props.route.params.position.latitude,
      longitude: this.props.route.params.position.longitude,
    },
    durationToMarker: '',
    distanceToMarker: '',
  };

  getRegion(originPosition, distance) {
    const oneDegreeOfLongitudeInMeters = 111.32 * 1000;
    const circumference = (40075 / 360) * 1000;

    const latDelta =
      distance * (1 / (Math.cos(originPosition.latitude) * circumference));
    const lonDelta = distance / oneDegreeOfLongitudeInMeters;

    return {
      latitude: originPosition.latitude,
      longitude: originPosition.longitude,
      latitudeDelta: Math.max(0, latDelta),
      longitudeDelta: Math.max(0, lonDelta),
    };
  }

  openMaps() {
    showLocation({
      latitude: this.state.selectedMarkerInfo.coordinates.latitude,
      longitude: this.state.selectedMarkerInfo.coordinates.longitude,
      title: this.state.selectedMarkerInfo.name,
    });
  }

  render() {
    const originPosition = {
      latitude: this.props.route.params.position.latitude,
      longitude: this.props.route.params.position.longitude,
    };

    // console.log('state',this.state.selectedMarkerInfo)
    return (
      <View>
        <MapView
          style={styles.map}
          // provider={PROVIDER_GOOGLE}
          initialRegion={this.getRegion(originPosition, 6500)}>
          {this.state.results.map(result => {
            const markerPosition = {
              latitude: parseFloat(result.coordinates.latitude),
              longitude: parseFloat(result.coordinates.longitude),
            };
            const isOpen = result.is_closed ? 'closed' : 'open';
            const distanceToMiles =
            Math.round(result.distance * 0.0062137) / 10;
            const distance = (distanceToMiles + 0.3).toFixed(1);
            return (
              <Marker
                key={result.id}
                coordinate={markerPosition}
                onPress={() =>
                  this.setState({
                    selectedMarkerInfo: result,
                    selectedMarkerPosition: markerPosition,
                  })
                }>
                <Image
                  source={require('./bubbatea.png')}
                  style={{width: 40, height: 65}}
                />
                <Callout
                  style={styles.calloutContainer}
                  onPress={() =>
                    this.setState({
                      isModalVisible: true,
                    })
                  }>
                  <Text style={styles.shopName}>{result.name}</Text>
             
                  <View style={styles.calloutTextContainer}>
                    <Text>
                      {result.location.display_address[0]}{' '}
                      {result.location.display_address[1]}
                    </Text>
                    <Text>Phone: {result.display_phone}</Text>
                    <Text>Rating: {result.rating}</Text>
                    <Text>Pricing: {result.price}</Text>
                    {/* <Text>Distance: {distance} mi</Text> */}
                  </View>
                  <Text style={styles.seeMore}>See more</Text>
                </Callout>
              </Marker>
            );
          })}

          {/* Gets distance to marker */}
          <MapViewDirections
            origin={originPosition}
            destination={this.state.selectedMarkerPosition}
            apikey={GOOGLE_DIRECTIONS_API_KEY}
            strokeWidth={5}
            strokeColor="lightpink"
            onReady={result => {
              this.setState({
                durationToMarker: `${Math.round(result.duration)} min`,
                distanceToMarker: `${Math.round(result.distance * 6.2) /
                  10} mi`,
              });
            }}
          />
          <Marker coordinate={originPosition} />
        </MapView>
        <Button
          title="Back To Search"
          onPress={() => {
            this.props.navigation.navigate('Search');
          }}
        />
        {/* Info Modal */}
        <Modal
          testID={'modal'}
          isVisible={this.state.isModalVisible}
          onSwipeComplete={() => this.setState({isModalVisible: false})}
          onBackdropPress={() => this.setState({isModalVisible: false})}
          swipeDirection={['down']}
          propagateSwipe={true}
          style={styles.modal}>
          <View style={styles.scrollableModal}>
            <View style={styles.scrollableModalContent1}>
              <Text style={styles.scrollableModalText1}>
                {this.state.selectedMarkerInfo.name}
              </Text>
              <Image
                source={{uri: this.state.selectedMarkerInfo.image_url}}
                style={{
                  width: 305,
                  height: 300,
                  marginBottom: 10,
                  marginTop: 10,
                }}
              />
              <Text style={styles.scrollableModalText2}>
                Duration: {this.state.durationToMarker}
              </Text>
              <Text style={styles.scrollableModalText2}>
                Distance: {this.state.distanceToMarker}
              </Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() => this.openMaps()}>
                <Text style={{color: 'white'}}>Directions</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    height: '93%',
  },
  //Callout
  calloutContainer: {
    height: 170,
    width: 250,
  },
  calloutTextContainer: {
    marginTop: 15,
  },
  shopName: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: 20,
  },
  seeMore: {
    display: 'flex',
    borderRadius: 7,
    padding: 10,
    color: 'rgb(37, 160, 205)',
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    textDecorationLine: 'underline',
    textAlign: 'center'
  },
  button: {
    display: 'flex',
    borderRadius: 7,
    padding: 10,
    backgroundColor: 'rgb(37, 160, 205)',
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  //Modal
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  scrollableModal: {
    height: 550,
  },
  scrollableModalContent1: {
    height: 550,
    backgroundColor: '#87BBE0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollableModalText1: {
    fontSize: 20,
    color: 'pink',
    marginBottom: 10,
    fontWeight: '600',
  },
  scrollableModalContent2: {
    height: 200,
    backgroundColor: '#A9DCD3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollableModalText2: {
    fontSize: 20,
    color: 'white',
  },
});
