import type { ChildRecord } from "@/firebase";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";

type Props = {
  child: ChildRecord;
};

export default function ChildCard({ child }: Props) {
  const details = [child.gender, `${child.age} years`, child.city]
    .filter(Boolean)
    .join(" - ");

  return (
    <View style={styles.card}>
      <ChildAvatar child={child} />

      <View style={styles.info}>
        <Text style={styles.name}>{child.name}</Text>
        <Text style={styles.details}>{details}</Text>

        {child.dateOfBirth ? (
          <Text style={styles.meta}>Date of birth: {child.dateOfBirth}</Text>
        ) : null}

        {child.interests?.length ? (
          <Text style={styles.meta} numberOfLines={1}>
            {child.interests.join(", ")}
          </Text>
        ) : null}
      </View>

      <Ionicons name="chevron-forward" size={20} color="#1E3A46" />
    </View>
  );
}

const ChildAvatar = ({ child }: Props) => {
  if (child.imageUrl) {
    return <Image source={{ uri: child.imageUrl }} style={styles.avatar} />;
  }

  return (
    <View style={styles.avatarFallback}>
      <Text style={styles.avatarInitial}>
        {child.name.charAt(0).toUpperCase() || "?"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "#DCE3E7",
    borderRadius: 15,
    flexDirection: "row",
    marginBottom: 15,
    marginHorizontal: 20,
    padding: 12,
  },

  avatar: {
    borderRadius: 27,
    height: 55,
    marginRight: 12,
    width: 55,
  },

  avatarFallback: {
    alignItems: "center",
    backgroundColor: "#E6F0F3",
    borderRadius: 27,
    height: 55,
    justifyContent: "center",
    marginRight: 12,
    width: 55,
  },

  avatarInitial: {
    color: "#1E3A46",
    fontSize: 18,
    fontWeight: "700",
  },

  info: {
    flex: 1,
  },

  name: {
    color: "#1E3A46",
    fontSize: 14,
    fontWeight: "600",
  },

  details: {
    color: "#48606B",
    fontSize: 12,
    marginTop: 3,
  },

  meta: {
    color: "#6C7A89",
    fontSize: 11,
    marginTop: 3,
  },
});
