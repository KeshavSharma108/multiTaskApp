import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  ViewToken,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { mockVideoData } from '../data/VideoData';
import FloatingButton from '../components/floatingButton';

const { width, height } = Dimensions.get('window');
const VIDEO_HEIGHT = 220;

// Memoized VideoCard
const VideoCard = memo(({ title, videoUrl, isPlaying }: { title: string; videoUrl: string; isPlaying: boolean }) => {
  const isFocused = useIsFocused();
  const player = useVideoPlayer(videoUrl, (p) => {
    p.loop = true;
    p.muted = false;
  });

  const playerRef = useRef(player);
  const [isBuffering, setIsBuffering] = useState(true);

  useEffect(() => {
    const controlPlayback = async () => {
      if (!isFocused) return;

      setIsBuffering(true);
      try {
        isPlaying ? await playerRef.current.play() : await playerRef.current.pause();
        setTimeout(() => setIsBuffering(false), 800);
      } catch (e) {
        console.warn('Playback error:', e);
      }
    };

    controlPlayback();
  }, [isPlaying, isFocused]);

  return (
    <View style={styles.card}>
      <VideoView player={player} style={styles.video} controls />
      {isBuffering && (
        <View style={styles.bufferLoader}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <View style={styles.overlay}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
});

export default function VideoListScreen() {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const newIndex = viewableItems[0].index ?? 0;
        if (newIndex !== currentIndex) {
          setCurrentIndex(newIndex);
        }
      }
    },
    [currentIndex]
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100,
  };

  const handleNavigate = (screen: string, params?: any) => {
    setLoading(true);
    navigation.navigate(screen as never, params as never);
    setLoading(false);
  };

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <View key={index}>
        <VideoCard
          title={item.product_name}
          videoUrl={item.video}
          isPlaying={index === currentIndex}
        />
        {index === mockVideoData.length - 1 && (
          <View style={styles.theEndContainer}>
            <Text style={styles.theEndText}>🎬 The End</Text>
          </View>
        )}
      </View>
    ),
    [currentIndex]
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎬 MultiTube</Text>
        <Text style={styles.headerSubtitle}>Your AI-Powered Video Player</Text>
      </View>

      <FlatList
        data={mockVideoData}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        initialNumToRender={4}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        contentContainerStyle={{ paddingBottom: height / 2 }}
        ListHeaderComponent={<View style={{ height: 10 }} />}
      />

      <FloatingButton
        onPress={() => handleNavigate('Task2')}
        icon="arrow-forward-circle"
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    paddingBottom: 20,
    backgroundColor: '#1e1e1e',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f74f4f',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginHorizontal: 10,
  },
  video: {
    width: width - 20,
    height: VIDEO_HEIGHT,
    borderRadius: 12,
  },
  bufferLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  overlay: {
    position: 'absolute',
    bottom: 10,
    left: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  theEndContainer: {
    alignItems: 'center',
    padding: 20,
  },
  theEndText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'gray',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
