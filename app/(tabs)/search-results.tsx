import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FilterModal from '@/components/FilterModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllActivitiesFromFirebase, getAllClubsFromFirebase } from '@/firebase/firestoreService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchResults = () => {
  const router = useRouter();
  const [activitiesData, setActivitiesData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const HISTORY_KEY = '@search_history';

 
  React.useEffect(() => {
    const loadHistory = async () => {
      try {
        const stored = await AsyncStorage.getItem(HISTORY_KEY);
        if (stored) {
          setRecentSearches(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load search history');
      }
    };
    loadHistory();
  }, []);

  const saveSearchQuery = async (query: string) => {
    if (!query.trim()) return;
    try {
      const newHistory = [
        query,
        ...recentSearches.filter((item) => item.toLowerCase() !== query.toLowerCase()),
      ].slice(0, 10);
      setRecentSearches(newHistory);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (e) {
      console.error('Failed to save search history');
    }
  };

  const clearHistory = async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (e) {
      console.error('Failed to clear history');
    }
  };

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [guestActivities, childActivities, clubs] = await Promise.all([
          getAllActivitiesFromFirebase({}, 'guest'),
          getAllActivitiesFromFirebase({}, 'child'),
          getAllClubsFromFirebase(),
        ]);
        
        const combined = [
          ...guestActivities.map(a => ({ ...a, entityType: 'activity' })),
          ...childActivities.map(a => ({ ...a, entityType: 'activity' })),
          ...clubs.map(c => ({ ...c, entityType: 'club' })),
        ];
        
        // Remove duplicates by id
        const uniqueData = Array.from(new Map(combined.map(item => [item.id, item])).values());
        setActivitiesData(uniqueData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredData = useMemo(() => {
    let result = activitiesData;

 
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      const isClipsSearch = lowerQuery === 'كلبس' || lowerQuery === 'clubs' || lowerQuery === 'club';

      result = result.filter((item) =>
        item.title?.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery) ||
        item.city?.toLowerCase().includes(lowerQuery) ||
        item.location?.toLowerCase().includes(lowerQuery) ||
        item.category?.toLowerCase().includes(lowerQuery) ||
        (Array.isArray(item.interests) && item.interests.some((i: string) => i.toLowerCase().includes(lowerQuery))) ||
        (isClipsSearch && (item.entityType === 'club' || item.title?.toLowerCase().includes('club')))
      );
    }


    if (filters.city) {
      const lowerCity = filters.city.toLowerCase();
      result = result.filter((item) =>
        item.location?.toLowerCase().includes(lowerCity) ||
        item.city?.toLowerCase().includes(lowerCity)
      );
    }

   
    if (filters.interest) {
      const lowerInterest = filters.interest.toLowerCase();
      result = result.filter((item) => {
        if (Array.isArray(item.interests)) {
          return item.interests.some((i: string) => i.toLowerCase().includes(lowerInterest));
        }
        return item.interest?.toLowerCase().includes(lowerInterest) || item.category?.toLowerCase().includes(lowerInterest);
      });
    }


    if (filters.age) {
      result = result.filter((item) => 
        item.ageGroup === filters.age || 
        item.targetAge === filters.age ||
        item.age === filters.age
      );
    }

    if (filters.minPrice) {
      result = result.filter((item) => Number(item.price) >= Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      result = result.filter((item) => Number(item.price) <= Number(filters.maxPrice));
    }

  
    if (filters.rating) {
      result = result.filter(
        (item) => (Number(item.rating) || 0) >= filters.rating
      );
    }

    return result;
  }, [searchQuery, filters, activitiesData]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
      
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color="#183B4E" />
          </Pressable>

          <Text style={styles.title}>Searching Results</Text>

          <View style={{ width: 24 }} />
        </View>

     
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={22} color="#183B4E" />

          <TextInput
            placeholder="your search"
            placeholderTextColor="#999"
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <MaterialIcons
            name="tune"
            size={22}
            color="#183B4E"
            onPress={() => setFilterVisible(true)}
          />
        </View>

        {!searchQuery && recentSearches.length > 0 && (
          <View style={styles.historyContainer}>
            <View style={styles.historyHeader}>
              <Text style={styles.subtitle}>Recent Searches</Text>
              <Pressable onPress={clearHistory}>
                <Text style={styles.clearText}>Clear</Text>
              </Pressable>
            </View>
            <View style={styles.historyList}>
              {recentSearches.map((item, idx) => (
                <Pressable
                  key={idx}
                  style={styles.historyItem}
                  onPress={() => setSearchQuery(item)}
                >
                  <MaterialIcons name="history" size={18} color="#888" />
                  <Text style={styles.historyText}>{item}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <Text style={styles.subtitle}>
          {searchQuery ? 'your search results' : 'All available activities'}
        </Text>

      
        <View style={styles.resultsList}>
          {loading ? (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading...</Text>
          ) : filteredData.map((item, index) => (
            <Pressable 
              key={index} 
              style={styles.card}
              onPress={() => {
                saveSearchQuery(searchQuery || item.title);
                if (item.entityType === 'club') {
                  router.push({ pathname: '/club-details', params: { id: item.id } });
                } else {
                  router.push(`/ActivityDetails/${item.id}`);
                }
              }}
            >
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
              ) : (
                <View style={styles.image} />
              )}
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.ratingRow}>
                  <Text style={styles.ratingNumber}>{(Number(item.rating) || 5.0).toFixed(1)} </Text>
                  <Text style={styles.ratingStars}>★★★★★</Text>
                </View>
                <Text style={styles.desc}>{item.description || 'Description activity'}</Text>
              </View>
            </Pressable>
          ))}
        </View>

    
        <FilterModal
          visible={filterVisible}
          onClose={() => setFilterVisible(false)}
          onApply={(data: any) => setFilters(data)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchResults;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backBtn: {
    padding: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#183B4E',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAEFEF',
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 25,
  },
  input: { flex: 1, marginLeft: 10, fontSize: 16, color: '#183B4E' },
  subtitle: {
    color: '#183B4E',
    marginBottom: 15,
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultsList: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F8',
    padding: 12,
    borderRadius: 15,
    marginBottom: 12,
  },
  image: {
    width: 60,
    height: 60,
    backgroundColor: '#183B4E',
    borderRadius: 8,
  },
  cardContent: { 
    marginLeft: 15, 
    justifyContent: 'center' 
  },
  cardTitle: { 
    fontWeight: 'bold', 
    color: '#183B4E', 
    fontSize: 16,
    marginBottom: 2
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2
  },
  ratingNumber: {
    color: '#183B4E',
    fontSize: 12,
    fontWeight: '600'
  },
  ratingStars: {
    color: '#183B4E',
    fontSize: 12,
  },
  desc: { color: '#888', fontSize: 13 },
  historyContainer: {
    marginBottom: 20,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  clearText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
  },
  historyList: {
    flexDirection: 'column',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEE',
  },
  historyText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#4B5C6B',
  },
});