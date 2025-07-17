import 'react-native-gesture-handler'; // <-- top liner
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import MainNavi from './src/navigation/mainNavigation';
import 'react-native-reanimated'; // Must be at the top
import { LogBox } from 'react-native';

// Suppress the Reanimated warning
LogBox.ignoreLogs([
  '[Reanimated] Reading from `value` during component render.',
]);
export default function App() {
  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>

<MainNavi />
   
    </NavigationContainer>
    </GestureHandlerRootView>
  );
}



