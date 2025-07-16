import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import MainNavi from './src/navigation/mainNavigation';


export default function App() {
  return (
    <NavigationContainer>
    <View style={styles.container}>
<MainNavi />
      <StatusBar style="auto" />
    </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
});
