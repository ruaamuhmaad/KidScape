import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FilterModal from '@/components/FilterModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllActivitiesFromFirebase } from '@/firebase/firestoreService';

const SearchResults = () => {
  const router = useRouter();
  const [activitiesData, setActivitiesData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAllActivitiesFromFirebase();
        setActivitiesData(data);
      } catch (error) {
        console.error('Failed to load activities:', error);
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
      result = result.filter((item) =>
        item.title?.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery)
      );
    }


    if (filters.city) {
      const lowerCity = filters.city.toLowerCase();
      result = result.filter((item) =>
        item.location?.toLowerCase().includes(lowerCity) ||
        item.city?.toLowerCase().includes(lowerCity)
      );
    }

    // Filter by Interest
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

        {/* Search */}
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

        <Text style={styles.subtitle}>your search results</Text>

      
        <View style={styles.resultsList}>
          {loading ? (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading...</Text>
          ) : filteredData.map((item, index) => (
            <View key={index} style={styles.card}>
              {item.imageUrl ? (
                <View style={styles.image} /> 
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
            </View>
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
});
