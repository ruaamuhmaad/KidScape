import { StyleSheet } from "react-native";

const reviewsTabStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
  },
  reviewCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  starsRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  star: {
    marginRight: 3,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#6B7280",
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginBottom: 16,
  },
  rateButtonCustom: {
    marginTop: 10,
    backgroundColor: "#173B4D",
  },
});

export default reviewsTabStyles;