import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function ProfileHeader() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
        style={styles.avatar}
      />
      <Text style={styles.username}>@keshav108</Text>
      <Text style={styles.bio}>React Native Dev | UI/UX Enthusiast | Tech Explorer</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
});
