import React from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { VideoView, useVideoPlayer } from 'expo-video';

const { width, height } = Dimensions.get('window');

const FullVideoScreen = () => {
  const route = useRoute();
  const { video } = route.params || {};

  const player = useVideoPlayer(video, (p) => {
    p.play();
  });

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        nativeControls={true}
        allowsPictureInPicture
        resizeMode="contain"
        allowsFullscreen={false}
      />
    </View>
  );
};

export default FullVideoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: width,
    height: height,
    backgroundColor: '#000',
  },
});
