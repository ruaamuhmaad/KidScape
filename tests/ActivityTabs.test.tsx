import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import ActivityTabs from "@/components/activity-details/ActivityTabs";
import type { ActivityTabName } from "@/components/activity-details/types";

describe("ActivityTabs", () => {
  it("calls setActiveTab when user presses Costs tab", () => {
    const mockSetActiveTab = jest.fn();

    const activeTab: ActivityTabName = "Overview";

    const { getByText } = render(
      <ActivityTabs
        activeTab={activeTab}
        setActiveTab={mockSetActiveTab}
      />
    );

    fireEvent.press(getByText("Costs"));

    expect(mockSetActiveTab).toHaveBeenCalledWith("Costs");
  });
});