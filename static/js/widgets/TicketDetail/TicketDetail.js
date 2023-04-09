import React, { useEffect, useState } from "react";
import { Space } from "antd";
import styles from "./TicketDetail.module.css";
import { TicketInfo } from "widgets/TicketInfo";
import { TicketResultList } from "widgets/TicketResultList";
import { useOktaAuth } from "@okta/okta-react";
import { ResultSubmitter } from "widgets/TicketResultSubmitter";
import axios from "axios";
import config from "config";
import { loading } from "helpers/promiseWithLoading";
import { TicketHistory } from "widgets/TicketHistory";

const resourceServer = config.resourceServer;

const TicketDetail = ({ hasSubmitter, ticketId }) => {
  const { authState } = useOktaAuth();
  const [ticketData, setTicketData] = useState();
  useEffect(() => {
    if (ticketId) {
      const accessToken = authState.accessToken.value;
      loading(
        axios({
          method: "get",
          url: resourceServer.GetTicketWithActionByID(ticketId),
          headers: { Authorization: `Bearer ${accessToken}` },
        }).then((res) => {
          if (res.status == 200) {
            setTicketData(res.data.data);
          }
        })
      );
    }
  }, [ticketId]);

  if (!ticketData) {
    return null;
  }
  let hasResult =
    ticketData.moderatorActions && ticketData.moderatorActions.length;
  let ticketIsLockedByOthers =
    ticketData.moderatorId &&
    ticketData.moderatorId != ticketData.currentModeratorId;
  let showSubmitter =
    hasSubmitter && ticketData.status == "Locked" && !ticketIsLockedByOthers;
  let showHistory = true;
  if (
    ticketData.dynamicEvent?.templateType == "PlaceUpdatedAfterOptInEvent" ||
    ticketData.dynamicEvent?.templateType == "GameOptInEvent" ||
    ticketData.dynamicEvent?.templateType == "PlaceUpdatedWhenOptInEvent"
  ) {
    showSubmitter = false;
    showHistory = false;
  }
  if (ticketData.dynamicEvent?.templateType == "PlaceSnapshotEvent") {
    showSubmitter = false;
    hasResult = false;
    showHistory = false;
  }
  let showActionSection = hasResult || showSubmitter || showHistory;
  return (
    <Space size={24} direction="vertical" className={styles.ticket_from_pool}>
      <TicketInfo ticket={ticketData} />
      {showActionSection && (
        <div style={{ padding: "0 24px 24px" }}>
          {showSubmitter && (
            <ResultSubmitter
              ticketData={ticketData}
              onTicketChange={() => window.location.reload()}
              doWhitelistAction={false}
            />
          )}
          {hasResult > 0 && (
            <TicketResultList results={ticketData.moderatorActions} />
          )}
          {showHistory && (
            <TicketHistory ticketId={ticketData.ticketId} visible={true} />
          )}
        </div>
      )}
    </Space>
  );
};

export default TicketDetail;
