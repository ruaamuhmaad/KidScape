import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import ActivityCard from '@/components/ActivityCard';
import ClubsCard from '@/components/clubsCard';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleAddChild = () => {
    router.push('/add-child');
  };
  const Data=['Sport', 'Art', 'Swimming', 'Football', 'Cooking', 'educational','Music'];
const Activitys=[
    
    {
      title: 'football',
      location: 'Nablus - Aibal Sports Club',
      rating: '3.8',
      imageUrl: 'https://i.pinimg.com/1200x/4b/79/d6/4b79d64a2c7f680eab3b32754613110f.jpg',
    },
    {
      title: 'Swimming Lessons',
      location: 'Nablus-hayat nablus',
      rating: '4.2',
      imageUrl: 'https://i.pinimg.com/1200x/a6/d2/32/a6d2323d7718377c2711dfab1358bfb6.jpg',
    },
    {
      title: 'Cycling Adventure',
      location: 'Nablus-jamal Abdel Nasser Street',
      rating: '3.2',
      imageUrl: 'https://i.pinimg.com/736x/f7/a8/90/f7a890ae099b7030a0ad935660f62435.jpg',
    },
    {
      title: 'Running Club',
      location: 'Nablus-al-rafidi Street',
      rating: '4.8',
      imageUrl: 'https://i.pinimg.com/736x/06/66/98/0666982525812d60b419307d7415c689.jpg',
    },
    {
      title: 'Basketball Camp',
      location: 'Nablus-al-anjah-aniviercity',
      rating: '4.8',
      imageUrl: 'https://i.pinimg.com/736x/f1/e2/33/f1e233655176149bea5325fefe9cb16c.jpg',
    },
  ];
  const Clubs=[
    {
      title: 'Youth of Tomorrow Organization',
      details: 'Nablus -All activities',
      rating: '4.5',
      imageUrl: 'https://scontent.fjrs26-1.fna.fbcdn.net/v/t39.30808-6/401500972_1862485134167778_4226220839367772720_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=25d718&_nc_ohc=5RSh_26bIMMQ7kNvwGvcIG9&_nc_oc=Adp5t0SlOzjRx_ff3vfPk-b82JKEHzD_5_vfFz97NcQy7bdRW4fZzhXO-s71YSFlrqk&_nc_zt=23&_nc_ht=scontent.fjrs26-1.fna&_nc_gid=1yen63dSCqXwVPqAJKew7w&_nc_ss=7a3a8&oh=00_Af2TDo0hPXLOT5-wPHdjaQF3wefHSNqArS3LV4HJ5WVnlg&oe=69DB0D61',
    },
     {
      title: 'Equestrian Club',
      details: 'jenin-Horse riding activity',
      rating: '2.5',
      imageUrl: 'https://tse3.mm.bing.net/th/id/OIP.8sbfZ6kHdiT5y5-2d_G4AgHaEK?rs=1&pid=ImgDetMain&o=7&rm=3',
    },
    {
      title: 'Our Heritage Club',
      details: 'Nablus - Dabkea',
      rating: '3.5',
      imageUrl: 'https://i.ytimg.com/vi/jGofWPugytA/maxresdefault.jpg',
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
      <Text style={{ fontSize: 24, fontWeight: 'bold', top: 16, padding: 36, textAlign: 'center', color: '#183B4E' }}>
        Home Page
      </Text>

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello!</Text>
          <Pressable onPress={handleAddChild}>
            <Text style={styles.addChildButton}>+Add New Child</Text>
          </Pressable>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="search bar"
            placeholderTextColor="#183B4E"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.safeArea}>
          <Text style={styles.sectionTitle}>Common Interests</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRow}>
            {Data.map((item, index) => (
              <Pressable
                style={styles.interestCard}
                key={index}
                onPress={() => router.push({ pathname: '/interest', params: { interest: item } })}
              >
                <Text style={styles.interestCardLabel}>{item}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.safeArea}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended Activities</Text>
          
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRow}>
            {filteredActivities.map((activity, index) => (
              <ActivityCard
                key={index}
                title={activity.title}
                location={activity.location}
                rating={activity.rating}
                imageUrl={activity.imageUrl}
                onPress={() => console.log('Pressed', activity.title)}
              />
            ))}
          </ScrollView>
        </View>

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
                key={index}
                title={club.title}
                details={club.details}
                rating={club.rating}
                imageUrl={club.imageUrl}
               onPress={() => router.push({
                 pathname: '/(tabs)/ActivityDetails/1',
                 params: { id: club.id }
               })}
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#f5f5f5',
    color: '#183B4E',
    fontSize: 22,
    fontWeight:'bold',
    paddingHorizontal: 8,
    paddingVertical:8,
    paddingBottom: 16,
  },
  container: {
    flex: 1,
    
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize:18,
    fontWeight: 'bold',
    color: '#183B4E',
    paddingLeft: 16,
     
  },
  addChildButton: {
    fontSize: 16,
    fontWeight:'light',
    paddingHorizontal:12,
    paddingVertical: 8,
  marginRight: 16,
    borderWidth: 1.5,
    backgroundColor: '#A7AAE1',
    borderColor: '#A7AAE1',
    borderRadius: 20,
    overflow: 'hidden',
    color: '#183B4E',
  },
  searchContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
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
  
  sectionTitle: {
     color: '#183B4E',
    fontSize: 22,
    fontWeight:'bold',
    paddingHorizontal: 8,
    paddingVertical:8,
    paddingBottom: 16,
  },
  scrollRow: {
    paddingBottom: 16,
  },
  interestCard: {
    
    width: 120,
    height: 120,
    backgroundColor: '#A7AAE1',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  interestCardLabel: {
    color: '#183B4E',
    fontSize: 20,
    fontWeight: 'bold',
    
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#A7AAE1',
    borderRadius: 15,
  },
  viewAllText: {
    color: '#183B4E',
    fontSize: 14,
    fontWeight: '600',
  },
});