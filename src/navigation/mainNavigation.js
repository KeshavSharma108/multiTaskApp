import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VideoListScreen from '../Screens/VideoPlayer';
import SocialApp from '../Screens/SocialApp';
import FullScreenVideoScreen from '../Screens/FullVideoScreen';
import SplashScreen from '../Screens/SplashScreen';


const Stack = createNativeStackNavigator();

const MainNavi = () => {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
       <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Main" component={VideoListScreen} />
      <Stack.Screen name="Task2" component={SocialApp} />
         <Stack.Screen name="FullScreenVideo" component={FullScreenVideoScreen} />
    </Stack.Navigator>
  );
};

export default MainNavi;
