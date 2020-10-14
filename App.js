import 'react-native-gesture-handler';
import React from 'react';
import {SafeAreaView, View, StyleSheet, Text} from 'react-native';
import {Header} from 'react-native/Libraries/NewAppScreen';

import Routes from './src/Routes';

const App = () => {
  return (
    <React.Fragment>
      <SafeAreaView style={styles.header}>
        <Text style={styles.text}>Where's My Bubble Tea?</Text>
      </SafeAreaView>
      <Routes />
    </React.Fragment>
  );
};

export default App;

const styles = StyleSheet.create({
  header: {
    height: 200,
    backgroundColor: 'pink',
  },
  text: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '600',
    marginTop: 60,
    marginBottom: 60,
  },
});
