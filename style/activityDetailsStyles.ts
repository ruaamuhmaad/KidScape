import { StyleSheet } from "react-native";

const activityDetailsStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e8e8e8",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: 0.2,
  },
  iconBtn: {
    padding: 4,
    width: 30,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  imageWrapper: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: 210,
  },
  titleBlock: {
    marginHorizontal: 16,
    marginTop: 14,
  },
  activityTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  locationText: {
    fontSize: 13.5,
    color: "#555",
    marginLeft: 4,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 60,
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#e8e8e8",
  },
});

export default activityDetailsStyles;