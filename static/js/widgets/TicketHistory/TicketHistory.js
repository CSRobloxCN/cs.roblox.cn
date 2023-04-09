import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOktaAuth } from "@okta/okta-react";
import { Button, List, Typography } from "antd";
import { loading } from "helpers/promiseWithLoading";
import axios from "axios";
import config from "config";
const { Text, Paragraph } = Typography;
const TicketInfo = ({ ticketId, visible }) => {
  const { t } = useTranslation();
  const { authState } = useOktaAuth();
  const [history, setHistory] = useState(null);

  let switchTicketHistory = useCallback(() => {
    if (history) {
      setHistory(null);
    } else {
      const accessToken = authState.accessToken.value;
      loading(
        axios({
          method: "get",
          url: config.resourceServer.GetTicketHistoryByID(ticketId),
          headers: { Authorization: `Bearer ${accessToken}` },
        }).then((res) => {
          if (res.status == 200) {
            setHistory(res.data.data.itemList);
          }
        })
      );
    }
  }, [history, ticketId]);

  if (!visible) return null;

  return (
    <>
      <Button type="default" onClick={switchTicketHistory}>
        {history ? t("Hide Ticket History") : t("Show Ticket History")}
      </Button>
      {history && (
        <List
          dataSource={history}
          renderItem={(record) => {
            return (
              <List.Item>
                <Paragraph>
                  <Text>{t("Moderator ID")}: </Text>
                  <Text code>{record.moderatorId}</Text>
                  <Text>{t("Changed Ticket Status To")}: </Text>
                  <Text code>{record.status}</Text>
                  <br />
                  <Text type="secondary">
                    {new Date(record.createdUtc).toLocaleString()}
                  </Text>
                </Paragraph>
              </List.Item>
            );
          }}
        />
      )}
    </>
  );
};
export default TicketInfo;
