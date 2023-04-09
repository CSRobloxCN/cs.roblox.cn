import React, { useEffect, useState } from "react";
import { Breadcrumb, Layout, message } from "antd";
import {
  DisplayNameChangeTicketsTable,
  AssetStatusUpdateTicketsTable,
  DisplayNameOnlineRescanTicketsTable,
} from "widgets/BatchUpdateTicketsTable";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { ModerationEvents } from "constants/index";
import parseSearch from "helpers/parseSearch";
import { getData, postData } from "helpers/httpRequest";
import config from "config";
import { useOktaAuth } from "@okta/okta-react";

/*
 * This page serves as a place holder of different kinds of dynamic event batch handling.
 * It fetches the tickets data and pass down to specific dynamic event table.
 * */
const BatchUpdateTicketsPage = () => {
  const { t } = useTranslation();
  const searchString = useLocation().search;
  const { authState } = useOktaAuth();
  const urlParams = parseSearch(searchString);
  const { moderatorId, templateType } = urlParams;
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const getTickets = async () => {
      const hide = message.loading("", 10);
      const response = await getData(
        config.resourceServer.GetBatchLockedTickets,
        { templateType },
        authState.accessToken.value
      );
      hide();

      if (response.status !== 200 || (response.data && response.data.error)) {
        message.error(t("Load tickets failed"));
        return;
      }

      const ticketList =
        response.data && response.data.data && response.data.data.ticketList;
      if (ticketList.length === 0) {
        message.error(t("No tickets"));
        return;
      }
      setTickets(ticketList);
    };

    getTickets();
  }, [templateType, moderatorId]);

  /*
   * This methods provides a link within the current page to pick more tickets.
   * */
  const handlePickTickets = async (moderationEvent) => {
    const hide = message.loading("", 10);
    const response = await postData(
      config.resourceServer.BatchLockTickets,
      {
        ticketPoolId: moderationEvent.value,
      },
      authState.accessToken.value
    );
    hide();

    if (response.status !== 200 || (response.data && response.data.error)) {
      message.error(t("Load tickets failed"));
      return;
    }

    history.go(0);
  };

  const getTicketsTable = (templateType) => {
    switch (templateType) {
      case ModerationEvents.AssetStatusUpdateEvent_Avatar.name:
      case ModerationEvents.AssetStatusUpdateEvent_Toolbox.name:
        return (
          <AssetStatusUpdateTicketsTable
            tickets={tickets}
            handlePickTickets={handlePickTickets}
            eventType={templateType}
          />
        );
      case ModerationEvents.DisplayNameChangeEvent.name:
      case ModerationEvents.DisplayNameRescanEvent.name:
        return (
          <DisplayNameChangeTicketsTable
            tickets={tickets}
            handlePickTickets={handlePickTickets}
            eventType={templateType}
          />
        );
      case ModerationEvents.DisplayNameOnlineRescanEvent.name:
        return (
          <DisplayNameOnlineRescanTicketsTable
            tickets={tickets}
            handlePickTickets={handlePickTickets}
            eventType={templateType}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{padding:24}}>
      <Layout.Content
        style={{ background: "#fff", padding: "10px 28px", marginBottom: 12 }}
      >
        <Breadcrumb>
          <Breadcrumb.Item>{t("Batch update tickets")}</Breadcrumb.Item>
        </Breadcrumb>
      </Layout.Content>
      {getTicketsTable(urlParams.templateType)}
    </div>
  );
};

export default BatchUpdateTicketsPage;
