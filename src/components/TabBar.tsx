import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';

type Props = {
  tabs: string[];
  activeTab: string;
  onTabPress: (tab: string) => void;
};

export default function TabBar({ tabs, activeTab, onTabPress }: Props) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <Pressable
          key={tab}
          onPress={() => onTabPress(tab)}
          style={[
            styles.tabButton,
            activeTab === tab && styles.activeTabButton,
          ]}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === tab && styles.activeTabLabel,
            ]}
          >
            {tab}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderColor: '#007AFF',
  },
  tabLabel: {
    fontSize: 14,
    color: '#888',
  },
  activeTabLabel: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
