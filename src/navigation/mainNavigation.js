import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VideoListScreen from '../Screens/VideoPlayer';
import SocialApp from '../Screens/SocialApp';
import FullScreenVideoScreen from '../Screens/FullVideoScreen';


const Stack = createNativeStackNavigator();

const MainNavi = () => {
  return (
    <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={VideoListScreen} />
      <Stack.Screen name="Task2" component={SocialApp} />
         <Stack.Screen name="FullScreenVideo" component={FullScreenVideoScreen} />
    </Stack.Navigator>
  );
};

export default MainNavi;
