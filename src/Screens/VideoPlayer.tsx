import React, { useEffect, useState, useRef, RefObject, JSX } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ViewToken,
} from 'react-native';
import { useVideoPlayer, VideoView, VideoPlayer } from 'expo-video';
import { useEvent } from 'expo';
import { useNavigation } from '@react-navigation/native';
import FloatingButton from '../components/floatingButton';



const { width, height } = Dimensions.get('window');

type VideoItem = {
  product_name: string;
  video: string;
};

const mockVideoData: VideoItem[] = [
  {
    product_name: 'Big Buck Bunny',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    product_name: 'Sintel',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  },
  {
    product_name: 'Tears of Steel',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  },
];

// ✅ Child Video Component Props
type VideoCardProps = {
  title: string;
  videoUrl: string;
  isActive: boolean;
  onPlayerReady: (player: VideoPlayer) => void;
};

const VideoCard: React.FC<VideoCardProps> = ({ title, videoUrl, isActive, onPlayerReady }) => {
  const player = useVideoPlayer(videoUrl, (p) => {
    p.loop = true;
  });

  useEffect(() => {
    onPlayerReady(player);
  }, []);

  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive]);

  useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });

  return (
    <View style={styles.card}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

export default function VideoListScreen(): JSX.Element {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const playersRef = useRef<VideoPlayer[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      setVideos(mockVideoData);
      setLoading(false);
    }, 1000);
  }, []);

  const onPlayerReady = (index: number) => (playerInstance: VideoPlayer) => {
    playersRef.current[index] = playerInstance;
  };

  useEffect(() => {
    return () => {
      playersRef.current.forEach((p) => {
        if (p?.pause) p.pause();
      });
    };
  }, []);

  const onViewRef = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setActiveIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 70 });

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={videos}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <VideoCard
            title={item.product_name}
            videoUrl={item.video}
            isActive={activeIndex === index}
            onPlayerReady={onPlayerReady(index)}
          />
        )}
        pagingEnabled
        horizontal={false}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
      />

      <FloatingButton
        onPress={() => {
          const currentPlayer = playersRef.current[activeIndex];
          if (currentPlayer?.pause) currentPlayer.pause();
          navigation.navigate('Task2');
        }}
        icon="arrow-forward-circle"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width,
    height,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width,
    height,
  },
  overlay: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});
