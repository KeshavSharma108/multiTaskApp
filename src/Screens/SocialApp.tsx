import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import ProfileHeader from '../components/ProfileHeader';
import TabBar from '../components/TabBar';

const { width } = Dimensions.get('window');

type GridItem = {
  id: string;
  uri: string;
};

const TABS = ['Posts', 'Videos', 'Tagged', 'About'] as const;
type Tab = typeof TABS[number];

// 👇 Per-image component with loader
const GridImage = ({ uri }: { uri: string }) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <View style={styles.imageWrapper}>
      {imageLoading && (
        <View style={styles.imageLoader}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      )}
      <Image
        source={{ uri }}
        style={styles.gridImage}
        onLoadEnd={() => setImageLoading(false)}
      />
    </View>
  );
};

export default function SocialApp() {
  const [activeTab, setActiveTab] = useState<Tab>('Posts');
  const [gridData, setGridData] = useState<GridItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const pageSize = 20;

  const fetchData = useCallback(async (pageNum: number) => {
    setLoading(true);
    const newItems: GridItem[] = Array.from({ length: pageSize }, (_, i) => {
      const index = (pageNum - 1) * pageSize + i + 10;
      return {
        id: index.toString(),
        uri: `https://picsum.photos/id/${index}/200/200`,
      };
    });

    setGridData((prev) => [...prev, ...newItems]);
    setLoading(false);

    if (pageNum * pageSize >= 100) {
      setHasMore(false);
    }
  }, []);

  useEffect(() => {
    fetchData(page);
  }, [fetchData, page]);

  const loadMoreItems = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const renderGridItem = ({ item }: { item: GridItem }) => (
    <GridImage uri={item.uri} />
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Posts':
        return (
          <FlatList
            data={gridData}
            keyExtractor={(item) => item.id}
            numColumns={3}
            renderItem={renderGridItem}
            contentContainerStyle={styles.gridContainer}
            onEndReached={loadMoreItems}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loading ? <ActivityIndicator size="small" color="#007AFF" /> : null
            }
            scrollEnabled={false}
          />
        );
      case 'Videos':
        return <Text style={styles.tabText}>Video content coming soon.</Text>;
      case 'Tagged':
        return <Text style={styles.tabText}>No tagged content yet.</Text>;
      case 'About':
        return (
          <>
            <Text style={styles.tabText}>Contact: dev.keshav@example.com</Text>
            <Text style={styles.tabText}>Location: India</Text>
          </>
        );
    }
  };

  return (
    <ScrollView stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>
      <ProfileHeader />
      <TabBar tabs={TABS as string[]} activeTab={activeTab} onTabPress={setActiveTab} />
      <View style={styles.tabContent}>{renderTabContent()}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    padding: 10,
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 16,
    padding: 16,
  },
  gridImage: {
    width: width / 3,
    height: width / 3,
  },
  gridContainer: {
    paddingBottom: 10,
  },
  imageWrapper: {
    width: width / 3,
    height: width / 3,
    borderWidth: 0.5,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imageLoader: {
    position: 'absolute',
    zIndex: 1,
  },
});
