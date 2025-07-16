import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ViewToken,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { mockVideoData } from '../data/VideoData';
import FloatingButton from '../components/floatingButton';

const { width, height } = Dimensions.get('window');
const VIDEO_HEIGHT = 220;

type VideoCardProps = {
  title: string;
  videoUrl: string;
  isPlaying: boolean;
};

const VideoCard: React.FC<VideoCardProps> = ({ title, videoUrl, isPlaying }) => {
  const isFocused = useIsFocused();
  const player = useVideoPlayer(videoUrl, (p) => {
    p.loop = true;
    p.muted = true;
  });

  const playerRef = useRef(player);

  React.useEffect(() => {
    const controlPlayback = async () => {
      try {
        if (!isFocused) return;
        if (isPlaying) {
          await playerRef.current.play();
        } else {
          await playerRef.current.pause();
        }
      } catch (e) {
        console.warn('Video control error:', e);
      }
    };

    controlPlayback();
  }, [isPlaying, isFocused]);

  const handleFullscreen = () => {
    try {
      playerRef.current.presentFullscreenPlayer();
    } catch (e) {
      console.warn('Fullscreen error:', e);
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity activeOpacity={0.9} onPress={handleFullscreen}>
        <VideoView player={player} style={styles.video} />
      </TouchableOpacity>
      <View style={styles.overlay}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

export default function VideoListScreen() {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length === 0) return;
      const centerIndex = viewableItems[Math.floor(viewableItems.length / 2)]?.index;
      if (centerIndex != null && centerIndex !== currentIndex) {
        setCurrentIndex(centerIndex);
      }
    },
    [currentIndex]
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const handleNavigate = (screen: string, params?: any) => {
    setLoading(true);
    setTimeout(() => {
      navigation.navigate(screen as never, params as never);
      setLoading(false);
    }, 300);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={mockVideoData}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View key={index}>
            <VideoCard
              title={item.product_name}
              videoUrl={item.video}
              isPlaying={index === currentIndex}
            />
            {index === mockVideoData.length - 1 && index === currentIndex && (
              <View style={styles.theEndContainer}>
                <Text style={styles.theEndText}>🎬 The End</Text>
              </View>
            )}
          </View>
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: height / 2,
        }}
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
