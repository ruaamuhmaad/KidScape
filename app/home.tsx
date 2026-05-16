import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ActivityCard from '@/components/ActivityCard';
import BottomNav from '@/components/bottom-nav';
import ClubsCard from '@/components/clubsCard';
import FilterModal from '@/components/FilterModal';
import { HomeProvider, useHome } from '@/contexts/HomeContext';
import { getCurrentUserProfile, onUserStateChange } from '@/services/authService';
import { getChildrenByParentId, type ChildRecord } from '@/firebase';
import { type Activity } from '@/services/homeService';

type HomePageProps = { showBottomNav?: boolean };

const normalizeText = (value: string) => value.trim().toLowerCase();

const activityRecommendationValues = (activity: Activity) => [
  activity.category,
  activity.type,
  activity.mood,
  activity.emotion,
  activity.status,
  activity.targetMood,
  activity.recommendedMood,
  activity.title,
  activity.description,
  ...activity.tags,
  ...activity.moods,
  ...activity.emotions,
  ...activity.categories,
  ...activity.recommendedFor,
].map(normalizeText).filter(Boolean);

const matchesChildInterests = (activity: Activity, child: ChildRecord | undefined) => {
  const childInterests = child?.interests?.map(normalizeText).filter(Boolean) ?? [];

  if (!childInterests.length) {
    return true;
  }

  const recommendationValues = activityRecommendationValues(activity);

  return childInterests.some((interest) =>
    recommendationValues.some((value) => value === interest || value.includes(interest) || interest.includes(value))
  );
};

const HomeContent = ({ showBottomNav = true }: HomePageProps) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [children, setChildren] = useState<ChildRecord[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const {
    filteredActivities, filteredClubs, searchQuery, setSearchQuery, filterVisible,
    openFilters, closeFilters, applyFilters, displayInterests, isLoading, isFetching,
    isError, errorMessage, refetchHomeData,
    activitySource,
    setActivitySource,
  } = useHome();

  const loadUserData = useCallback(async () => {
    try {
      const profile = await getCurrentUserProfile();
      setIsLoggedIn(true);
      setActivitySource('child');
      setUserName(profile.PName || profile.Email || '');
      const parentChildren = await getChildrenByParentId(profile.uid);
      setChildren(parentChildren);
      const selectedChildStillExists = parentChildren.some((child) => child.id === selectedChildId);
      if ((!selectedChildId || !selectedChildStillExists) && parentChildren.length > 0) {
        setSelectedChildId(parentChildren[0].id);
      }
    } catch {
      setIsLoggedIn(false);
      setActivitySource('guest');
      setUserName('');
      setChildren([]);
      setSelectedChildId(null);
    }
  }, [selectedChildId, setActivitySource]);

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = onUserStateChange((user) => {
      if (!isMounted || !user) {
        setIsLoggedIn(false);
        setActivitySource('guest');
        setUserName('');
        setChildren([]);
        setSelectedChildId(null);
        return;
      }
      void loadUserData();
    });
    void loadUserData();
    return () => { isMounted = false; unsubscribe(); };
  }, [loadUserData, setActivitySource]);

  useFocusEffect(useCallback(() => { if (isLoggedIn) void loadUserData(); }, [isLoggedIn, loadUserData]));

  const handleAddChild = () => {
    if (!isLoggedIn) {
      Alert.alert('Login Required', 'You must be logged in to add a child.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => router.push('/login') }
      ]);
      return;
    }
    router.push('/add-child');
  };

  const selectedChild = useMemo(
    () => children.find((child) => child.id === selectedChildId),
    [children, selectedChildId]
  );

  const shouldUseChildRecommendations = isLoggedIn && Boolean(selectedChild);

  const recommendedActivities = useMemo(
    () => shouldUseChildRecommendations
      ? filteredActivities.filter((activity) => matchesChildInterests(activity, selectedChild))
      : filteredActivities,
    [filteredActivities, selectedChild, shouldUseChildRecommendations]
  );

  if (isLoading) return (
    <SafeAreaView style={styles.page}>
      <View style={styles.feedbackCard}>
        <ActivityIndicator color="#183B4E" />
        <Text style={styles.feedbackText}>Loading home data...</Text>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Home Page</Text>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.greeting}>{userName ? `Hello ${userName}` : 'Welcome to KidScape!'}</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.childRow}>
            {children.map((child) => {
              const selected = child.id === selectedChildId;
              return (
                <Pressable key={child.id} style={[styles.childButton, selected && styles.childButtonSelected]}
                  onPress={() => setSelectedChildId(child.id)}>
                  <Text style={[styles.childButtonText, selected && styles.childButtonTextSelected]}>{child.name}</Text>
                </Pressable>
              );
            })}
            <Pressable style={styles.childAddButton} onPress={handleAddChild}>
              <Text style={styles.childAddButtonText}>+ Add New Child</Text>
            </Pressable>
          </ScrollView>

          <View style={styles.searchContainer}>
            <View style={styles.searchBox}>
              <TextInput style={styles.searchInput} placeholder="search bar" placeholderTextColor="#183B4E"
                value={searchQuery} onChangeText={setSearchQuery} />
              <MaterialIcons name="tune" size={22} color="#728293" onPress={openFilters} />
            </View>
          </View>

          {isError && (
            <View style={styles.feedbackCard}>
              <Text style={styles.errorText}>{errorMessage ?? 'Something went wrong'}</Text>
              <Pressable style={styles.retryButton} onPress={() => void refetchHomeData()}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </Pressable>
            </View>
          )}
          {isFetching && !isLoading && <Text style={styles.syncText}>Refreshing data...</Text>}

          <Text style={styles.sectionTitle}>Common Interests</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {displayInterests.length ? (
              displayInterests.map((item, index) => (
                <Pressable key={`${item.title}-${index}`} style={styles.interestCard}
                  onPress={() => router.push({ pathname: '/interest', params: { interest: item.title } })}>
                  <Text style={styles.interestCardLabel}>{item.title}</Text>
                </Pressable>
              ))
            ) : (
              <Text style={styles.emptyStateText}>No interests found in Firebase.</Text>
            )}
          </ScrollView>

          <Text style={styles.sectionTitle}>Recommended Activities</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recommendedActivities.length ? (
              recommendedActivities.map((item, index) => (
                <ActivityCard key={item.id ?? index} {...item}
                  onPress={() =>
                    router.push({
                      pathname: '/ActivityDetails/[id]',
                      params: { id: item.id, source: activitySource },
                    })
                  } />
              ))
            ) : (
              <Text style={styles.emptyStateText}>
                {shouldUseChildRecommendations && selectedChild
                  ? `No recommended activities found for ${selectedChild.name}.`
                  : 'No activities available from Firebase right now.'}
              </Text>
            )}
          </ScrollView>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top-Best clubs in palestine</Text>
              <Pressable onPress={() => router.push('/topclubs')}
                style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View All</Text>
              </Pressable>
            </View>
            {filteredClubs.length ? (
              filteredClubs.map((club, index) => (
                <ClubsCard key={club.id ?? index} title={club.title} details={club.details}
                  rating={club.rating} imageUrl={club.imageUrl} location={club.location}
                  onPress={() => router.push({ pathname: '/club-details', params: { id: club.id } })} />
              ))
            ) : (
              <Text style={styles.emptyStateText}>No clubs match the current search or filters.</Text>
            )}
          </View>
        </View>
        <FilterModal visible={filterVisible} onClose={closeFilters} onApply={applyFilters} />
      </ScrollView>
      {showBottomNav && <BottomNav />}
    </SafeAreaView>
  );
};

export default function HomePage({ showBottomNav = true }: HomePageProps) {
  return <HomeProvider><HomeContent showBottomNav={showBottomNav} /></HomeProvider>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollView: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { paddingBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 20, color: '#183B4E' },
  container: { padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 18, fontWeight: 'bold', color: '#183B4E' },
  childRow: { paddingVertical: 12, paddingHorizontal: 2 },
  childButton: { backgroundColor: '#E5E8F8', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 20, marginRight: 10 },
  childButtonSelected: { backgroundColor: '#2C6E8A' },
  childButtonText: { color: '#183B4E', fontWeight: '600' },
  childButtonTextSelected: { color: '#FFFFFF' },
  childAddButton: { backgroundColor: '#F0F0F5', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 20, borderWidth: 1, borderColor: '#A7AAE1' },
  childAddButtonText: { color: '#183B4E', fontWeight: '600' },
  searchContainer: { marginVertical: 20 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D9D9D9', borderRadius: 20, paddingHorizontal: 12 },
  searchInput: { flex: 1, height: 50, color: '#183B4E' },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginVertical: 10, padding: 14, color: '#183B4E' },
  interestCard: { width: 120, height: 120, backgroundColor: '#A7AAE1', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  interestCardLabel: { fontWeight: 'bold' },
  sectionContainer: { backgroundColor: '#f5f5f5' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewAllButton: { padding: 8 },
  viewAllText: { color: '#235671', fontWeight: 'bold' },
  feedbackCard: { alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 16, marginBottom: 16, padding: 16 },
  feedbackText: { color: '#183B4E', marginTop: 12 },
  errorText: { color: '#7C2D12', marginBottom: 12, textAlign: 'center' },
  retryButton: { backgroundColor: '#183B4E', borderRadius: 20, paddingHorizontal: 18, paddingVertical: 10 },
  retryButtonText: { color: '#fff', fontWeight: '700' },
  syncText: { color: '#235671', marginBottom: 12, textAlign: 'center' },
  emptyStateText: { color: '#4B5C6B', fontSize: 14, marginTop: 16, paddingHorizontal: 14 }
});
