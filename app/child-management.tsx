import BottomNav from "@/components/bottom-nav";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChildManagement() {
  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
    <View style={styles.header}>
  <TouchableOpacity onPress={() => router.back()}>
    <Ionicons name="arrow-back" size={20} color="#1E3A46" />
  </TouchableOpacity>

  <Text style={styles.headerTitle}>Child Management</Text>
</View>
      {/* Empty State */}
      <View style={styles.middle}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={50} color="#1E3A46" />
        </View>

        <Text style={styles.subtitleBold}>
          Add an account for your child
        </Text>
        <Text style={styles.subtitleLight}>No account available</Text>
      </View>

      {/* Add Button (زي الليست بالضبط) */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/add-child")}
      >
        <Ionicons name="add" size={18} color="#1E3A46" />
        <Text style={styles.addText}>Add new children</Text>
      </TouchableOpacity>
      <BottomNav />
    </SafeAreaView>
  
  );
}


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    paddingTop: 50,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#1E3A46",
    marginRight: 20,
  },

  /* Middle (empty state) */
  middle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E6F0F3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  subtitleBold: {
    fontSize: 14,
    color: "#1E3A46",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 5,
  },

  subtitleLight: {
    fontSize: 12,
    color: "#6C7A89",
    textAlign: "center",
  },

  /* Add button (مطابق لصفحة الليست) */
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#AFC1CC",
    marginHorizontal: 60,
    marginBottom: 30,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 6,
  },

  addText: {
    fontSize: 12,
    color: "#1E3A46",
  },
});