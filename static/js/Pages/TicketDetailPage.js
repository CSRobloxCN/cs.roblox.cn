import React from "react";
import { TicketDetail } from "widgets/TicketDetail";
import { Breadcrumb, Layout } from "antd";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import parseSearch from "helpers/parseSearch";

const TicketPage = () => {
  const { t } = useTranslation();
  const searchString = useLocation().search;
  const searchStringObject = parseSearch(searchString);
  const { ticketId } = searchStringObject;
  let history = useHistory();
  let pageContent;
  if (ticketId) {
    pageContent = (
      <>
        <Layout.Content
          style={{ background: "#fff",padding:"12px 24px" }}
        >
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link
                to={
                  history.location.state && history.location.state.pageNum
                    ? `/mytickets?pageNum=${history.location.state.pageNum}`
                    : "/mytickets"
                }
              >
                {t("My Tickets")}
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{t("Ticket Detail")}</Breadcrumb.Item>
          </Breadcrumb>
        </Layout.Content>
        <TicketDetail hasSubmitter={true} ticketId={ticketId} />
      </>
    );
  } else {
    pageContent = "Error: No Ticket";
  }
  return pageContent;
};

export default TicketPage;
