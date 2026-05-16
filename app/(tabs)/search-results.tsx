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

const activitiesData = [
  { title: 'Football', location: 'Nablus', rating: '5.0' },
  { title: 'Swimming', location: 'Nablus', rating: '5.0' },
  { title: 'Art Class', location: 'Nablus', rating: '5.0' },
  { title: 'Music', location: 'Nablus', rating: '5.0' },
  { title: 'Cooking', location: 'Nablus', rating: '5.0' },
];

const SearchResults = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState<any>({});

  const filteredData = useMemo(() => {
    let result = activitiesData;

    if (searchQuery) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.rating) {
      result = result.filter(
        (item) => Number(item.rating) >= filters.rating
      );
    }

    return result;
  }, [searchQuery, filters]);

  return (
    <ScrollView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={20} color="#183B4E" />
        </Pressable>

        <Text style={styles.title}>Searching Results</Text>

        <View style={{ width: 20 }} />
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <MaterialIcons name="search" size={18} color="#728293" />

        <TextInput
          placeholder="your search"
          style={styles.input}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <MaterialIcons
          name="tune"
          size={20}
          color="#728293"
          onPress={() => setFilterVisible(true)}
        />
      </View>

      <Text style={styles.subtitle}>your search results</Text>

      {/* Results */}
      <View>
        {filteredData.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.image} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text>5.0 ★★★★★</Text>
              <Text style={styles.desc}>Description activity</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Filter */}
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={(data: any) => setFilters(data)}
      />
    </ScrollView>
  );
};

export default SearchResults;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#183B4E',
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6E6E6',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 45,
    marginBottom: 15,
  },

  input: { flex: 1, marginLeft: 8 },

  subtitle: {
    color: '#183B4E',
    marginBottom: 10,
    fontWeight: '600',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#E8EBF3',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },

  image: {
    width: 50,
    height: 50,
    backgroundColor: '#183B4E',
    borderRadius: 8,
  },

  cardTitle: { fontWeight: 'bold' },

  desc: { color: '#777', fontSize: 12 },
});
