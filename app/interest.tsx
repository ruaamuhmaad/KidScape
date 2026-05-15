import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator, Pressable, ScrollView, StyleSheet,
  Text, TextInput, View
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ActivityCard from '@/components/ActivityCard';
import FilterModal from '@/components/FilterModal';
import { fetchInterestPageData, type Activity } from '@/services/homeService';

const InterestPage = () => {
  const router = useRouter();
  const { interest: interestParam } = useLocalSearchParams<{ interest?: string | string[] }>();
  const interest = Array.isArray(interestParam) ? interestParam[0] : interestParam || 'Sport';

  const [activities, setActivities] = useState<Activity[]>([]);
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      setLoading(true); setError(null);
      try {
        const data = await fetchInterestPageData(interest);
        if (mounted) {
          setDescription(data.description);
          setActivities(data.activities);
        }
      } catch {
        if (mounted) setError('Failed to load interest data');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void loadData();
    return () => { mounted = false; };
  }, [interest]);

  const filteredActivities = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    return term
      ? activities.filter(a =>
          a.title.toLowerCase().includes(term) ||
          a.location.toLowerCase().includes(term))
      : activities;
  }, [activities, searchQuery]);

  if (loading) return (
    <Center>
      <ActivityIndicator size="large" color="#183B4E" />
      <Text style={styles.loadingText}>Loading...</Text>
    </Center>
  );

  if (error) return (
    <Center>
      <MaterialIcons name="error" size={48} color="#ff4444" />
      <Text style={styles.errorText}>{error}</Text>
      <Pressable style={styles.retryButton} onPress={() => setError(null)}>
        <Text style={styles.retryText}>Try again</Text>
      </Pressable>
    </Center>
  );

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.push('/home')}>
          <MaterialIcons name="arrow-back-ios" size={20} color="#183B4E" />
          <Text style={styles.backText}>Home</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{interest} Interest</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={18} color="#728293" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search activities..."
          placeholderTextColor="#728293"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <MaterialIcons name="tune" size={20} color="#728293" onPress={() => setFilterVisible(true)} />
      </View>

      <Text style={styles.subTitle}>Description</Text>
      <Text style={styles.description}>{description}</Text>

      <Text style={styles.sectionTitle}>Recommended Activities</Text>
      <View style={styles.grid}>
        {filteredActivities.length ? (
          filteredActivities.map(a => (
            <View key={a.id} style={styles.cardSlot}>
              <ActivityCard
                title={a.title}
                location={a.location}
                rating={a.rating}
                imageUrl={a.imageUrl}
                style={styles.activityCard}
                onPress={() => console.log('Pressed:', a.title)}
              />
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>
            {searchQuery ? 'No activities match your search.' : 'No activities available.'}
          </Text>
        )}
      </View>

      <FilterModal visible={filterVisible} onClose={() => setFilterVisible(false)} onApply={() => setFilterVisible(false)} />
    </ScrollView>
  );
};

const Center = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.center}>{children}</View>
);

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', padding: 20 },
  loadingText: { marginTop: 12, fontSize: 16, color: '#183B4E' },
  errorText: { fontSize: 16, color: '#ff4444', marginTop: 12 },
  retryButton: { backgroundColor: '#183B4E', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginTop: 16 },
  retryText: { color: 'white', fontWeight: '600', fontSize: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { marginLeft: 4, fontSize: 16, color: '#183B4E', fontWeight: '600' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#183B4E', flex: 1, textAlign: 'center' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#D9D9D9', paddingHorizontal: 10, paddingVertical: 8, marginBottom: 20 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: '#183B4E', height: 36 },
  subTitle: { fontSize: 16, fontWeight: '700', color: '#183B4E', marginBottom: 8 },
  description: { fontSize: 14, color: '#4B5C6B', lineHeight: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#183B4E', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cardSlot: { width: '50%', alignItems: 'center' },
  activityCard: { marginRight: 0 },
  emptyText: { color: '#4B5C6B', fontSize: 16, marginTop: 40, textAlign: 'center', width: '100%' },
});

export default InterestPage;
