import { StyleSheet } from "react-native";

const bookingSubmittedStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  header: {
    height: 56,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },
  iconBtn: {
    width: 32,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  container: {
    flex: 1,
    padding: 18,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  successCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 28 / 1.6,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  summaryBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  mainButtonCustom: {
    backgroundColor: "#2563EB",
    marginBottom: 14,
  },
  linkText: {
    textAlign: "center",
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "600",
  },
  helpBox: {
    marginTop: 22,
    alignItems: "center",
  },
  helpText: {
    fontSize: 12,
    color: "#94A3B8",
  },
  supportText: {
    fontSize: 13,
    color: "#2563EB",
    fontWeight: "600",
    marginTop: 4,
  },
});

export default bookingSubmittedStyles;