import React from 'react';
import { Pressable, View, Text, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from '@/.expo/types/router';

type ActivityCardProps = {
  title: string;
  location: string;
  rating: string | number;
  imageUrl?: string;
 onPress: () => void;
};

const ActivityCard = ({ title, location, rating, imageUrl, onPress }: ActivityCardProps) => {
  const backgroundImage = imageUrl
    ? { uri: imageUrl }
    : { uri: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80' };

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <ImageBackground source={backgroundImage} style={styles.image} imageStyle={styles.imageStyle}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.imageOverlay} />
        <View style={styles.ratingBadge}>
          <MaterialIcons name="star" size={14} color="#fff" />
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
        <View style={styles.infoRow}>
          <View>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.locationRow}>
              <MaterialIcons name="location-on" size={14} color="#fff" />
              <Text style={styles.locationText}>{location}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
   width:160,
   height:240,
    borderRadius: 20,
    overflow: 'hidden',
   marginRight: 16,
    backgroundColor: '#e0e0e0',
  },
  image: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 210,
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  ratingBadge: {
    margin: 14,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ratingText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '700',
    fontSize: 13,
  },
  infoRow: {
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#c9d9e1',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '400',
  },
});

export default ActivityCard;
