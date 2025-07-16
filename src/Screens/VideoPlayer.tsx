import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ViewToken,
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
  onPress: () => void;
  isPlaying: boolean;
  playerRef: any;
};

const VideoCard: React.FC<VideoCardProps> = ({ title, videoUrl, onPress, isPlaying, playerRef }) => {
  const isFocused = useIsFocused();
  const player = useVideoPlayer(videoUrl, (p) => {
    p.loop = true;
    p.muted = true;
  });

  playerRef.current = player;

  React.useEffect(() => {
    let active = true;

    const controlPlayback = async () => {
      try {
        if (!isFocused || !active) return;
        if (isPlaying) {
          await player.play();
        } else {
          await player.pause();
        }
      } catch (e) {
        console.warn('[VideoPlayer control] error:', e);
      }
    };

    controlPlayback();
    return () => {
      active = false;
    };
  }, [isPlaying, isFocused]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <VideoView player={player} style={styles.video} />
      <View style={styles.overlay}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function VideoListScreen() {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState<number | null>(0);
  const playersRef = useRef<{ [key: number]: any }>({});

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
              playerRef={{
                current: (ref: any) => (playersRef.current[index] = ref),
              }}
              onPress={() =>
                navigation.navigate('FullScreenVideo', {
                  videoUrl: item.video,
                  title: item.product_name,
                })
              }
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
        onPress={() => {
          const currentPlayer = playersRef.current?.[currentIndex ?? 0];
          if (currentPlayer?.pause) currentPlayer.pause();
          navigation.navigate('Task2');
        }}
        icon="arrow-forward-circle"
      />
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
});
