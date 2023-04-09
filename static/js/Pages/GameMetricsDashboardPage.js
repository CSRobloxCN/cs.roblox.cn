import React from "react";
import { GameMetricsDashboard } from "widgets/GameMetricsDashboard";
import { GameIdList } from "widgets/GameIdList";

const GameMetricsDashboardPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <GameMetricsDashboard />
      <GameIdList/>
    </div>
  );
};

export default GameMetricsDashboardPage;
