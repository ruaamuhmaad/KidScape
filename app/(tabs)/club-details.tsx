import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getClubFromFirebase } from '@/firebase';

interface ClubDetail {
  id: string;
  title: string;
  details: string;
  rating: string;
  imageUrl: string;
  description: string;
  location: string;
}

export default function ClubDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const clubId = Array.isArray(id) ? id[0] : id;
  const [club, setClub] = useState<ClubDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClub = async () => {
      if (!clubId) {
        setClub(null);
        setLoading(false);
        return;
      }

      const fetchedClub = await getClubFromFirebase(clubId);
      setClub(fetchedClub as ClubDetail | null);
      setLoading(false);
    };

    loadClub();
  }, [clubId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Club Details</Text>
          <View style={{ width: 30 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading club details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!club) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Club Details</Text>
          <View style={{ width: 30 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Club not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Club Details</Text>
          <View style={{ width: 30 }} />
        </View>

        <Image source={{ uri: club.imageUrl }} style={styles.image} resizeMode="cover" />

        <View style={styles.content}>
          <Text style={styles.title}>{club.title}</Text>
          <View style={styles.row}>
            <Ionicons name="location-sharp" size={16} color="#2C6E8A" />
            <Text style={styles.subtitle}>{club.location}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="star" size={16} color="#F5B400" />
            <Text style={styles.rating}>{club.rating}</Text>
          </View>

          <Text style={styles.sectionLabel}>About this club</Text>
          <Text style={styles.description}>{club.description}</Text>

          <Text style={styles.sectionLabel}>Details</Text>
          <Text style={styles.description}>{club.details}</Text>
        
            
        </View>
    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize:22,
    color: '#183B4E',
    fontWeight:"bold",
    borderBottomWidth: 0.5,
   
  },
  iconBtn: { padding: 4, width: 30 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#183B4E' },
  image: { width: '100%', height: 220 },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#183B4E', marginBottom: 12 },
  subtitle: { marginLeft: 8, color: '#183B4E', fontSize: 20,fontStyle: 'italic',fontWeight:'bold' },
  rating: { marginLeft: 8, color: '#4B5C6B', fontSize: 20,fontStyle: 'italic',fontWeight:'bold'},
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  sectionLabel: { marginLeft: 8, color: '#183B4E', fontSize: 20,fontStyle: 'italic',fontWeight:'bold',paddingTop: 12  },
  description: { fontSize: 18, color: '#06335b', lineHeight: 20, marginBottom: 6,fontStyle: 'italic' ,padding:12},
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyText: { fontSize: 16, color: '#4B5C6B' },
});
