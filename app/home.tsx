import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import ActivityCard from '@/components/ActivityCard';
import ClubsCard from '@/components/clubsCard';
import FilterModal from '@/components/FilterModal';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const router = useRouter();

  const handleAddChild = () => {
    router.push('/add-child');
  };

  const Data = ['Sport', 'Art', 'Swimming', 'Football', 'Cooking', 'educational', 'Music'];

  const Activitys = [
    {
      id: '1',
      title: 'football',
      location: 'Nablus - Aibal Sports Club',
      rating: '3.8',
      imageUrl: 'https://i.pinimg.com/1200x/4b/79/d6/4b79d64a2c7f680eab3b32754613110f.jpg',
    },
    {
      id: '2',
      title: 'Swimming Lessons',
      location: 'Nablus-hayat nablus',
      rating: '4.2',
      imageUrl: 'https://i.pinimg.com/1200x/a6/d2/32/a6d2323d7718377c2711dfab1358bfb6.jpg',
    },
    {
      id: '3',
      title: 'Cycling Adventure',
      location: 'Nablus-jamal Abdel Nasser Street',
      rating: '3.2',
      imageUrl: 'https://i.pinimg.com/736x/f7/a8/90/f7a890ae099b7030a0ad935660f62435.jpg',
    },
  ];

  const Clubs = [
    {
      id: '1',
      title: 'Youth of Tomorrow Organization',
      details: 'Nablus -All activities',
      rating: '4.5',
      imageUrl: 'https://i.pinimg.com/736x/06/66/98/0666982525812d60b419307d7415c689.jpg',
    },
    {
      id: '2',
      title: 'Equestrian Club',
      details: 'jenin-Horse riding activity',
      rating: '2.5',
      imageUrl: 'https://tse3.mm.bing.net/th/id/OIP.8sbfZ6kHdiT5y5-2d_G4AgHaEK?rs=1&pid=ImgDetMain&o=7&rm=3',
    },
  ];

  const filteredActivities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return Activitys;

    return Activitys.filter(activity =>
      activity.title.toLowerCase().includes(query) ||
      activity.location.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // FILTER CLUBS
  const filteredClubs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return Clubs;

    return Clubs.filter(club =>
      club.title.toLowerCase().includes(query) ||
      club.details.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <ScrollView style={styles.safeArea}>
      <SafeAreaView>
      <Text style={styles.title}>Home Page</Text>
</SafeAreaView>
      <View style={styles.container}>

        {/* HEADER */}
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
              onPress={() => setFilterVisible(true)}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRow}>
            {filteredActivities.map((activity, index) => (
              <ActivityCard
                key={index}
                title={activity.title}
                location={activity.location}
                rating={activity.rating}
                imageUrl={activity.imageUrl}
                 onPress={() => router.push(
                     '/ActivityDetails/1'
                    /* `/ActivityDetails/${index + 1}`*/
                     )}
              />
            ))}
          </ScrollView>
        </View>

        <Text style={styles.sectionTitle}>Common Interests</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Data.map((item, index) => (
            <Pressable
              key={index}
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
          {filteredActivities.map((item, index) => (
            <ActivityCard
              key={item.id ?? index}
              {...item}
              onPress={() => router.push(`/ActivityDetails/${item.id}`)}
            />
          ))}
        </ScrollView>

        <View style={styles.safeArea}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top-Best clubs in palestine</Text>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/topclubs',
                  params: { clubs: JSON.stringify(Clubs) },
                })
              }
              style={styles.viewAllButton}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </Pressable>
          </View>
          <View>
            {filteredClubs.map((club, index) => (
              <ClubsCard
                key={club.id ?? index}
                title={club.title}
                details={club.details}
                rating={club.rating}
                imageUrl={club.imageUrl}
               onPress={() => router.push({
                 pathname: '/ActivityDetails/1',
                /*onPress={() => router.push(`/ActivityDetails/${item.id}`)}"*/
                 params: { id: club.id }
               })}
              />
            ))}
          </View>
        </View>
      </View>
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={(filters: any) => {
          console.log('Filters:', filters);
        }}
      />
    </ScrollView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#f5f5f5',
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
    padding:14,
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
});