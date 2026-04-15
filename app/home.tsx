import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import ActivityCard from '@/components/ActivityCard';
import BottomNav from '@/components/bottom-nav';
import ClubsCard from '@/components/clubsCard';
import FilterModal from '@/components/FilterModal';
import { HomeProvider, useHome } from '@/contexts/HomeContext';

type HomePageProps = {
  showBottomNav?: boolean;
};

const HomeContent = ({ showBottomNav = true }: HomePageProps) => {
  const router = useRouter();
  const {
    clubs,
    filteredActivities,
    filteredClubs,
    searchQuery,
    setSearchQuery,
    filterVisible,
    openFilters,
    closeFilters,
    applyFilters,
    displayInterests,
    isLoading,
    isFetching,
    isError,
    errorMessage,
    refetchHomeData,
  } = useHome();

  const handleAddChild = () => {
    router.push('/add-child');
  };

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Home Page</Text>

        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Hello!</Text>

            <View style={styles.headerButtons}>
              <Pressable onPress={handleAddChild}>
                <Text style={styles.addChildButton}>+Add New Child</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchBox}>
              <TextInput
                style={styles.searchInput}
                placeholder="search bar"
                placeholderTextColor="#183B4E"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />

              <MaterialIcons
                name="tune"
                size={22}
                color="#728293"
                onPress={openFilters}
              />
            </View>
          </View>

          {isLoading ? (
            <View style={styles.feedbackCard}>
              <ActivityIndicator color="#183B4E" />
              <Text style={styles.feedbackText}>Loading home data...</Text>
            </View>
          ) : null}

          {isError ? (
            <View style={styles.feedbackCard}>
              <Text style={styles.errorText}>
                {errorMessage ?? 'Something went wrong while loading data.'}
              </Text>
              <Pressable
                style={styles.retryButton}
                onPress={() => void refetchHomeData()}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </Pressable>
            </View>
          ) : null}

          {isFetching && !isLoading ? (
            <Text style={styles.syncText}>Refreshing data...</Text>
          ) : null}

          <Text style={styles.sectionTitle}>Common Interests</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {displayInterests.map((item, index) => (
              <Pressable
                key={`${item}-${index}`}
                style={styles.interestCard}
                onPress={() =>
                  router.push({ pathname: '/interest', params: { interest: item } })
                }
              >
                <Text style={styles.interestCardLabel}>{item}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Recommended Activities</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filteredActivities.length ? (
              filteredActivities.map((item, index) => (
                <ActivityCard
                  key={item.id ?? index}
                  {...item}
                  onPress={() => router.push(`/ActivityDetails/${item.id}`)}
                />
              ))
            ) : (
              <Text style={styles.emptyStateText}>
                No activities match the current search or filters.
              </Text>
            )}
          </ScrollView>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top-Best clubs in palestine</Text>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/topclubs',
                    params: { clubs: JSON.stringify(clubs) },
                  })
                }
                style={styles.viewAllButton}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </Pressable>
            </View>

            <View>
              {filteredClubs.length ? (
                filteredClubs.map((club, index) => (
                  <ClubsCard
                    key={club.id ?? index}
                    title={club.title}
                    details={club.details}
                    rating={club.rating}
                    imageUrl={club.imageUrl}
                    location={club.location}
                    onPress={() =>
                      router.push({
                        pathname: '/club-details',
                        params: { id: club.id },
                      })
                    }
                  />
                ))
              ) : (
                <Text style={styles.emptyStateText}>
                  No clubs match the current search or filters.
                </Text>
              )}
            </View>
          </View>
        </View>

        <FilterModal
          visible={filterVisible}
          onClose={closeFilters}
          onApply={applyFilters}
        />
      </ScrollView>

      {showBottomNav ? <BottomNav /> : null}
    </SafeAreaView>
  );
};

export default function HomePage({ showBottomNav = true }: HomePageProps) {
  return (
    <HomeProvider>
      <HomeContent showBottomNav={showBottomNav} />
    </HomeProvider>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: '#183B4E',
  },
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#183B4E',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  addChildButton: {
    backgroundColor: '#A7AAE1',
    padding: 8,
    borderRadius: 20,
  },
  searchContainer: {
    marginVertical: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: '#183B4E',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    padding: 14,
    color: '#183B4E',
  },
  interestCard: {
    width: 120,
    height: 120,
    backgroundColor: '#A7AAE1',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  interestCardLabel: {
    fontWeight: 'bold',
  },
  sectionContainer: {
    backgroundColor: '#f5f5f5',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAllButton: {
    padding: 8,
  },
  viewAllText: {
    color: '#235671',
    fontWeight: 'bold',
  },
  feedbackCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
  },
  feedbackText: {
    color: '#183B4E',
    marginTop: 12,
  },
  errorText: {
    color: '#7C2D12',
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#183B4E',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  syncText: {
    color: '#235671',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    color: '#4B5C6B',
    fontSize: 14,
    marginTop: 16,
    paddingHorizontal: 14,
  },
});
