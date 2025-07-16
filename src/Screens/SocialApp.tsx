import React, { useState, useCallback, JSX } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { Tabs } from 'react-native-collapsible-tab-view';

const { width } = Dimensions.get('window');

// Define type for image items
type GridItem = {
  id: string;
  uri: string;
};

export default function SocialApp(): JSX.Element {
  const [gridData, setGridData] = useState<GridItem[]>(
    Array.from({ length: 20 }, (_, i) => ({
      id: i.toString(),
      uri: `https://picsum.photos/id/${i + 10}/200/200`,
    }))
  );
  const [page, setPage] = useState<number>(1);

  const loadMoreItems = useCallback(() => {
    const newItems: GridItem[] = Array.from({ length: 10 }, (_, i) => {
      const index = page * 10 + i + 10;
      return {
        id: (gridData.length + i).toString(),
        uri: `https://picsum.photos/id/${index}/200/200`,
      };
    });

    setGridData((prev) => [...prev, ...newItems]);
    setPage((prev) => prev + 1);
  }, [page, gridData.length]);

  const Header = (): JSX.Element => (
    <View style={styles.headerContainer}>
      <Image
        source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
        style={styles.avatar}
      />
      <Text style={styles.username}>@keshav108</Text>
      <Text style={styles.bio}>React Native Dev | UI/UX Enthusiast | Tech Explorer</Text>
    </View>
  );

  const renderGridItem: ListRenderItem<GridItem> = ({ item }) => (
    <Image source={{ uri: item.uri }} style={styles.gridImage} />
  );

  return (
    <Tabs.Container renderHeader={Header} lazy >
      <Tabs.Tab name="Posts">
        <FlatList
          data={gridData}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={renderGridItem}
          contentContainerStyle={styles.tabContent}
          onEndReached={loadMoreItems}
          onEndReachedThreshold={0.5}
        />
      </Tabs.Tab>

      <Tabs.Tab name="Videos">
        <View style={styles.tabContent}>
          <Text style={styles.tabText}>Video content coming soon.</Text>
        </View>
      </Tabs.Tab>

      <Tabs.Tab name="Tagged">
        <View style={styles.tabContent}>
          <Text style={styles.tabText}>No tagged content yet.</Text>
        </View>
      </Tabs.Tab>

      <Tabs.Tab name="About">
        <View style={styles.tabContent}>
          <Text style={styles.tabText}>Contact: dev.keshav@example.com</Text>
          <Text style={styles.tabText}>Location: India</Text>
        </View>
      </Tabs.Tab>
    </Tabs.Container>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
    color: '#444',
  },
  tabContent: {
    backgroundColor: '#fff',
    paddingVertical: 10, // Was 255, changed to 10 (adjust as needed)
  },
  tabText: {
    fontSize: 16,
    padding: 16,
  },
  gridImage: {
    width: width / 3,
    height: width / 3,
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
});
