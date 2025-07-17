// screens/VideoListScreen.tsx
import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, Pressable } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { VideoView, useVideoPlayer } from 'expo-video';
import { mockVideoData } from '../data/VideoData';
import { useNavigation } from '@react-navigation/native';
import FloatingButton from '../components/floatingButton';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const AnimatedScrollView = Animated.createAnimatedComponent(Animated.ScrollView);

export default function VideoListScreen() {
  const scrollY = useSharedValue(0);
  const visibilityMap = useRef(new Map()).current;
  const activeIndexRef = useRef<number | null>(null);
  const navigation = useNavigation();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      let mostVisibleIndex: number | null = null;
      let mostVisiblePercent = 0;

      for (const [index, { y, height }] of visibilityMap.entries()) {
        const visibleStart = Math.max(y, scrollY.value);
        const visibleEnd = Math.min(y + height, scrollY.value + SCREEN_HEIGHT);
        const visibleHeight = Math.max(0, visibleEnd - visibleStart);
        const percentVisible = visibleHeight / height;

        if (percentVisible > mostVisiblePercent) {
          mostVisiblePercent = percentVisible;
          mostVisibleIndex = index;
        }
      }

      for (const [index, { player }] of visibilityMap.entries()) {
        if (index === mostVisibleIndex && mostVisiblePercent >= 0.6) {
          if (activeIndexRef.current !== index) {
            if (activeIndexRef.current !== null) {
              visibilityMap.get(activeIndexRef.current)?.player.pause();
            }
            player.play();
            activeIndexRef.current = index;
          }
        } else {
          player.pause();
        }
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          <Text style={styles.multi}>Multi</Text>
          <Text style={styles.tube}>Tube</Text>
        </Text>
      </View>

      <AnimatedScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
        <View style={styles.spacerTop} />
        {mockVideoData.map((item, index) => {
          const player = useVideoPlayer(item.video, (p) => (p.loop = true));

          return (
            <View
              key={`${item.product_name}-${index}`}
              onLayout={(e) => {
                const { y, height } = e.nativeEvent.layout;
                visibilityMap.set(index, { y, height, player });
              }}
              style={styles.videoContainer}
            >
              <Text style={styles.label}>{item.product_name}</Text>

              <Pressable
                style={styles.videoWrapper}
                onPress={() => {
                  player.pause();
                  navigation.navigate('Task2');
                }}
              >
                <VideoView
                  style={styles.video}
                  player={player}
                  nativeControls={false}
                  allowsPictureInPicture
                />
              </Pressable>
            </View>
          );
        })}
        <View style={styles.spacerBottom} />
      </AnimatedScrollView>

      <FloatingButton
        icon="arrow-forward-circle"
        onPress={() => {
          if (activeIndexRef.current !== null) {
            const current = visibilityMap.get(activeIndexRef.current);
            current?.player.pause();
          }
          navigation.navigate('Task2');
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  multi: {
    color: 'red',
  },
  tube: {
    color: 'white',
  },
  spacerTop: { height: 150 },
  spacerBottom: { height: 300 },
  videoContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 50,
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 10,
  },
  video: {
    width: '100%',
    height: 500,
    backgroundColor: '#000',
  },
  videoWrapper: {
    width: '100%',
    height: 500,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#fff',
  },
});
