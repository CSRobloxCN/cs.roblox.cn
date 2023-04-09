import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader, Space } from "antd";
import { useOktaAuth } from "@okta/okta-react";
import axios from "axios";
import config from "config";
import styles from "./GameMetricsDashboard.module.css";
import { TwoAxisBarChart } from "components/TwoAxisBarChart";
import { ObjectKeyTable } from "components/ObjectKeyTable";
import { loading } from "helpers/promiseWithLoading";

const GameMetricsDashboard = () => {
  const { t } = useTranslation();
  const { authState } = useOktaAuth();
  let [metrics, setMetrics] = useState(null);
  useEffect(() => {
    const accessToken = authState.accessToken.value;
    loading(
      axios({
        method: "GET",
        url: config.resourceServer.GetLuobuGameStatusMetrics,
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then((res) => {
        if (res.status == 200) {
          setMetrics(res.data.data);
        }
      })
    );
  }, []);
  if (!metrics) return null;
  return (
    <div className={styles.dashboard}>
      <PageHeader title={t("Game Status Dashboard")}></PageHeader>
      <Space direction="vertical" size={24} style={{ width: "100%" }}>
        <div style={{ width: "100%", margin: "0 auto" }}>
          <TwoAxisBarChart
            labels={["Approved", "InReview", "Rejected"/*, "Unknown"*/]}
            datas={[
              {
                data: [
                  metrics.nowApproved,
                  metrics.nowInReview,
                  metrics.nowRejected,
                  // metrics.nowUnknown,
                ],
                name: t("Sort"),
              }
            ]}
          />
        </div>
        <ObjectKeyTable data={metrics} />
      </Space>
    </div>
  );
};

export default GameMetricsDashboard;
