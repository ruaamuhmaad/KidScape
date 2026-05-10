import { StyleSheet } from "react-native";

const costsTabStyles = StyleSheet.create({
  tabContent: {
    marginHorizontal: 16,
    marginTop: 18,
    gap: 12,
  },

  costCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FBFD",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0eef4",
    overflow: "hidden",
  },

  costImage: {
    width: 70,
    height: 65,
  },

  costLabel: {
    flex: 1,
    fontSize: 14,
    color: "#1a1a1a",
    fontWeight: "500",
    paddingHorizontal: 12,
  },

  costPrice: {
    fontSize: 14,
    color: "#2C6E8A",
    fontWeight: "700",
    paddingRight: 14,
  },
});

export default costsTabStyles;