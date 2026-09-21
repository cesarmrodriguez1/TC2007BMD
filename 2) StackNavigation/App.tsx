import React from 'react';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

// Screens:

import First from './src/First'
import Second from './src/Second'
import Third from './src/Third'

// Routes:
export type RootStackParamList={
	First: undefined,
	Second: undefined,
	Third: undefined
};



// Crear el navegador tipo Stack
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
   <NavigationContainer>
      <Stack.Navigator
	    initialRoute="First",
		screenOptions:{{
			headerStyle:{
				backgroundColor:'#FFFFFF',
			},
			headerShown: false,
			headerTintColor: '#333333',
			headerTitleStyle:{
				fontWeight: 'bold',
			},
		}}
		>
		
		//Pantalla principal:
		<Stack.Screen
		   name = "First"
		   component ={First}
		   options={{
			   title: 'View 1',
		   }}
		   />
		   //Segunda pantalla:
		 <Stack.Screen
		   name = "Second"
		   component ={Second}
		   options={{
			   title: 'View 2',
		   }}
		   />
		   
		  //Tercera pantalla:
		 <Stack.Screen
		   name = "Third"
		   component ={Third}
		   options={{
			   title: 'View 3',
		   }}
		   />
		 </Stack.Navigator>  
   
   </NavigationContainer>
  );
}