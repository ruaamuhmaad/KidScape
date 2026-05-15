import React from 'react';
import { Pressable, View, Text, StyleSheet, ImageBackground, ScrollView, type StyleProp, type ViewStyle } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type ActivityCardProps = {
  id?: string | number;
  title: string;
  location: string;
  rating: string | number;
  imageUrl?: string;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
};

const ActivityCard = ({ title, location, rating, imageUrl, style, onPress }: ActivityCardProps) => {
  const backgroundImage = imageUrl
    ? { uri: imageUrl }
    : { uri: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80' };

  return (
    <Pressable style={[styles.card, style]} onPress={onPress}>
      <ImageBackground source={backgroundImage} style={styles.image} imageStyle={styles.imageStyle}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.imageOverlay} />
        <View style={styles.ratingBadge}>
          <MaterialIcons name="star" size={14} color="#fff" />
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoPanel}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.locationRow}>
              <MaterialIcons name="location-on" size={14} color="#183B4E" />
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
   width:170,
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
  infoPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    padding: 10,
  },
  title: {
    color: '#183B4E',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#183B4E',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ActivityCard;
