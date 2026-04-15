import React from "react";
import { Ionicons } from "@expo/vector-icons";

import type { OverviewIconName } from "./types";

type OverviewIconProps = {
  name: OverviewIconName;
};

export default function OverviewIcon({ name }: OverviewIconProps) {
  const p = { size: 20, color: "#2C6E8A" };

  switch (name) {
    case "shield-checkmark":
      return <Ionicons name="shield-checkmark-outline" {...p} />;

    case "calendar":
      return <Ionicons name="calendar-outline" {...p} />;

    case "people":
      return <Ionicons name="people-outline" {...p} />;

    case "football":
      return <Ionicons name="football-outline" {...p} />;

    case "location":
      return <Ionicons name="location-outline" {...p} />;

    case "call":
      return <Ionicons name="call-outline" {...p} />;

    default:
      return <Ionicons name="information-circle-outline" {...p} />;
  }
}
