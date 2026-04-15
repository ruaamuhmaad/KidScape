import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const TABS = ["Overview", "Details", "Costs", "Reviews"];

export default function ActivityTabs({ activeTab, setActiveTab }) {
  return (
    <View style={styles.tabBar}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => setActiveTab(tab)}
          style={styles.tabItem}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === tab && styles.tabLabelActive,
            ]}
          >
            {tab}
          </Text>

          {activeTab === tab && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
  },

  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 10,
  },

  tabLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#999",
  },

  tabLabelActive: {
    color: "#2C6E8A",
    fontWeight: "700",
  },

  tabUnderline: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 2.5,
    backgroundColor: "#2C6E8A",
    borderRadius: 2,
  },
});