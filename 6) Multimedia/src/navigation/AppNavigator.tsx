import React from 'react';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import AudioScreen from '../screens/AudioScreen';
import VideoScreen from '../screens/VideoScreen';

import {
  RootStackParamList,
} from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = (): React.JSX.Element => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Multimedia App',
          }}
        />

        <Stack.Screen
          name="Audio"
          component={AudioScreen}
          options={{
            title: 'Reproductor de audio',
          }}
        />

        <Stack.Screen
          name="Video"
          component={VideoScreen}
          options={{
            title: 'Reproductor de video',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;