import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ClubsCard from '@/components/clubsCard';

const TopClubsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clubs = searchParams.get('clubs');
  const [searchQuery, setSearchQuery] = useState('');

  const clubsData = useMemo(() => {
    if (!clubs) return [];
    try {
      return JSON.parse(clubs);
    } catch (error) {
      return [];
    }
  }, [clubs]);

  const filteredClubs = useMemo(() => {
    if (!searchQuery) return clubsData;
    const query = searchQuery.toLowerCase();
    return clubsData.filter((club: any) => {
      return (
        club.title.toLowerCase().includes(query) ||
        club.details.toLowerCase().includes(query)
      );
    });
  }, [clubsData, searchQuery]);

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.appBar}>
        <Pressable style={styles.backButton} onPress={() => router.push('/')}>
          <MaterialIcons name="arrow-back-ios" size={20} color="#183B4E" />
          <Text style={styles.backText}>Home</Text>
        </Pressable>
        <Text style={styles.appTitle}>Top-rated activities</Text>
        <View style={styles.appBarSpacer} />
      </View>

      
        <TextInput
          style={styles.searchInput}
          placeholder="Search clubs"
          placeholderTextColor="#728293"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
     

      {filteredClubs.length > 0 ? (
        filteredClubs.map((club: any, index: number) => (
          <ClubsCard
            key={club.id ?? index}
            title={club.title}
            details={club.details}
            rating={club.rating}
            imageUrl={club.imageUrl}
            onPress={() => router.push({
              pathname: '/club-details',
              params: { id: club.id },
            })} location={''}          />
        ))
      ) : (
        <Text style={styles.emptyText}>
          {clubsData.length === 0
            ? 'No clubs data received from Home page.'
            : 'No clubs match your search.'}
        </Text>
      )}
    </ScrollView>
  );
};

export default TopClubsPage;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#183B4E',
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '600',
  },
  appBarSpacer: {
    width: 32,
  },
  appTitle: {
margin:19,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#183B4E',
    textAlign: 'center',
    flex: 1,
  },
 
  searchInput: {
   backgroundColor: '#D9D9D9',
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#183B4E',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#183B4E',
    marginBottom: 6,
  },
  emptyText: {
    color: '#0d5da2',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
});