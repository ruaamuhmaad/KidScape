import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ActivityCard from '@/components/ActivityCard';
import FilterModal from '@/components/FilterModal';

const descriptionMap: Record<string, string> = {
  Sport: 'Encourages physical fitness through fun activities, promoting teamwork, coordination, and overall well-being.',
  Art: 'Encourages creativity and self-expression through colorful projects, painting, and craft-based learning.',
  Swimming: 'Builds confidence in the water while strengthening the body with safe and guided swimming lessons.',
  Football: 'Improves teamwork, endurance, and ball skills with exciting football drills and friendly matches.',
  Cooking: 'Teaches kitchen skills, healthy eating, and creativity using simple recipes for kids.',
  educational: 'Supports academic learning and critical thinking through hands-on workshops and games.',
  Music: 'Develops rhythm, listening, and performance skills with fun music and movement sessions.',
};

const allActivities = [
  {
    title: 'Football Practice',
    location: 'Nablus - Sports Hall',
    rating: '4.2',
    imageUrl: 'https://i.pinimg.com/1200x/4b/79/d6/4b79d64a2c7f680eab3b32754613110f.jpg',
    category: 'Sport',
  },
  {
    title: 'Swimming Lessons',
    location: 'Nablus - Hayat Pool',
    rating: '4.5',
    imageUrl: 'https://i.pinimg.com/1200x/88/95/a3/8895a30f99aaf999a7f509cdf17db58d.jpg',
    category: 'Swimming',
  },
  {
    title: 'Art Workshop',
    location: 'Nablus - Creative Studio',
    rating: '4.7',
    imageUrl: 'https://i.pinimg.com/1200x/b1/ce/a8/b1cea80291897e2898ec130ce60d7738.jpg',
    category: 'Art',
  },
  {
    title: 'Music Class',
    location: 'Nablus - Music Room',
    rating: '4.3',
    imageUrl: 'https://i.pinimg.com/736x/68/02/cb/6802cba5e74ff21af281bdac10c1ef82.jpg',
    category: 'Music',
  },
  {
    title: 'Cooking Class',
    location: 'Nablus - Kitchen Lab',
    rating: '4.0',
    imageUrl: 'https://i.pinimg.com/1200x/78/82/3d/78823d16a9b37d76f4de6900ffe675d9.jpg',
    category: 'Cooking',
  },
 
];

const InterestPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interest = searchParams.get('interest') || 'Sport';
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
const [filters, setFilters] = useState<any>({});

  const description = descriptionMap[interest] || 'Explore recommended activities for this interest.';

  const recommendedActivities = useMemo(() => {
    return allActivities.filter((activity) => activity.category.toLowerCase() === interest.toLowerCase());
  }, [interest]);

  const filteredActivities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return recommendedActivities;

    return recommendedActivities.filter((activity) =>
      activity.title.toLowerCase().includes(query) ||
      activity.location.toLowerCase().includes(query)
    );
  }, [recommendedActivities, searchQuery]);

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.push('/')}>
          <MaterialIcons name="arrow-back-ios" size={20} color="#183B4E" />
          <Text style={styles.backText}>Home</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{interest} Interest</Text>
        <View style={styles.headerSpacer} />
      </View>

    <View style={styles.searchContainer}>
  <MaterialIcons name="search" size={18} color="#728293" />

  <TextInput
    style={styles.searchInput}
    placeholder="your search"
    placeholderTextColor="#728293"
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

      <Text style={styles.subTitle}>Description Interest</Text>
      <Text style={styles.description}>{description}</Text>

      <Text style={styles.sectionTitle}>Recommended For this Interest</Text>
      <View style={styles.grid}>
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity, index) => (
            <ActivityCard
              key={index}
              title={activity.title}
              location={activity.location}
              rating={activity.rating}
              imageUrl={activity.imageUrl}
              onPress={() => console.log('Pressed', activity.title)}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No activities match your search.</Text>
        )}
        <FilterModal
  visible={filterVisible}
  onClose={() => setFilterVisible(false)}
  onApply={(data:any) => setFilters(data)}
/>
      </View>
      
    </ScrollView>
  );
};

export default InterestPage;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
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
    marginLeft: 4,
    fontSize: 16,
    color: '#183B4E',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#183B4E',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 60,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#183B4E',
    height: 36,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#183B4E',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#4B5C6B',
    lineHeight: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#183B4E',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyText: {
    color: '#4B5C6B',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
    width: '100%',
  },
});