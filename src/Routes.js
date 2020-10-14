import React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Search from './pages/Search';
import Results from './pages/Results';

const Stack = createStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Search">
        <Stack.Screen
          options={{header: () => null}}
          name="Search"
          component={Search}
        />
        <Stack.Screen
          options={{header: () => null}}
          name="Results"
          component={Results}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
