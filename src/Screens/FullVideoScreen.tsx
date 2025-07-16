import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useVideoPlayer, VideoView } from 'expo-video';

const { width, height } = Dimensions.get('window');

export default function FullScreenVideoScreen() {
  const route = useRoute();
  const { videoUrl, title } = route.params as { videoUrl: string; title: string };
const player = useVideoPlayer(videoUrl, (p) => {
  p.loop = true;
  try {
    p.play(); // just call it without .catch()
  } catch (err) {
    console.warn('play failed:', err);
  }
});

 useEffect(() => {
  return () => {
    if (player?.pause) {
      try {
        player.pause();
      } catch (err) {
        console.warn('pause failed:', err);
      }
    }
  };
}, []);


  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        allowsFullscreen
        allowsPictureInPicture
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    width,
    height,
  },
  overlay: {
    position: 'absolute',
    bottom: 80,
    left: 20,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
});
