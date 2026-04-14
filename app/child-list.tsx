import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChildListScreen() {
  const children = [
    {
      id: 1,
      name: "KARMA",
      image: "https://i.pravatar.cc/100?img=1",
    },
    {
      id: 2,
      name: "JIHAD",
      image: "https://i.pravatar.cc/100?img=2",
    },
    {
      id: 3,
      name: "AHMAD",
      image: "https://i.pravatar.cc/100?img=3",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1E3A46" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Child Managment</Text>

        {/* spacer للمحافظة على توسيط العنوان */}
        <View style={{ width: 22 }} />
      </View>

      {/* List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {children.map((child) => (
          <View key={child.id} style={styles.card}>
            <Image source={{ uri: child.image }} style={styles.avatar} />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{child.name}</Text>
              <Text style={styles.dash}>----------------------</Text>
              <Text style={styles.dash}>----------</Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#1E3A46"
            />
          </View>
        ))}

        {/* Add Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/add-child")}
        >
          <Ionicons name="add" size={20} color="#1E3A46" />
          <Text style={styles.addText}>Add new childern</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/home")}
        >
          <Ionicons name="home-outline" size={22} color="#1E3A46" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/")}
        >
          <Ionicons name="heart-outline" size={22} color="#1E3A46" />
          <Text style={styles.navText}>Favourites</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/notifications")}
        >
          <Ionicons
            name="notifications-outline"
            size={22}
            color="#1E3A46"
          />
          <Text style={styles.navText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/profile")}
        >
          <Ionicons name="person-outline" size={22} color="#1E3A46" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    paddingTop: 50,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
    justifyContent: "space-between",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E3A46",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCE3E7",
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 15,
    padding: 12,
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 27,
    marginRight: 12,
  },

  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E3A46",
  },

  dash: {
    fontSize: 10,
    color: "#6C7A89",
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#AFC1CC",
    marginHorizontal: 60,
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 5,
  },

  addText: {
    fontSize: 12,
    color: "#1E3A46",
  },

  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#AFC1CC",
    paddingVertical: 15,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },

  navText: {
    fontSize: 10,
    color: "#1E3A46",
    marginTop: 3,
  },
});