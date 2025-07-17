import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withDelay,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

export default function SplashScreen() {
  const navigation = useNavigation();

  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });

    opacity.value = withDelay(
      300,
      withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      })
    );

    const timeout = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.textRow, animatedStyle]}>
        <Text style={styles.multiText}>Multi</Text>
        <Text style={styles.tubeText}>Tube</Text>
      </Animated.View>
      <Animated.Text style={[styles.subTitle, animatedStyle]}>
        Your AI-Powered Video Player
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  multiText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#f74f4f', // red
  },
  tubeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff', // white
  },
  subTitle: {
    marginTop: 12,
    fontSize: 16,
    color: '#aaa',
    fontWeight: '500',
  },
});
