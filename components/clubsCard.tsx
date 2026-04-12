import React from 'react';
import { Pressable, View, Text, StyleSheet, ImageBackground } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type ClubCardProps = {
  title: string;
  details: string;
  rating: string | number;
  imageUrl?: string;
  onPress?: () => void;
};

const ClubsCard = ({ title, details, rating, imageUrl, onPress }: ClubCardProps) => {
  const backgroundImage = imageUrl
    ? { uri: imageUrl }
    : { uri: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80' };

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <ImageBackground source={backgroundImage} style={styles.imageContainer} imageStyle={styles.imageStyle}>
        <View style={styles.imageOverlay} />
        <View style={styles.ratingBadge}>
          <MaterialIcons name="star" size={14} color="#fff" />
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
      </ImageBackground>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.details}>{details}</Text>
        <View style={styles.locationRow}>
          <MaterialIcons name="location-on" size={14} color="#183B4E" />
          <Text style={styles.locationText}>{details}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    width:408,
   height: 100,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
  
  },
  imageContainer: {
    width: 100,
    height:100,
    justifyContent: 'space-between',
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  imageOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
  },
  ratingBadge: {
    margin: 10,
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
  textContainer: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
  },
  title: {
    color: '#183B4E',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  details: {
    color: '#4B5C6B',
    fontSize: 14,
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#728293',
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '400',
  },
});

export default ClubsCard;
