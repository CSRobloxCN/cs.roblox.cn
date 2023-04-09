import React from "react";
import { Link } from "react-router-dom";
import { BanUser } from "widgets/BanUser";
import { useTranslation } from "react-i18next";

const RescanColumns = ({ handleBanUser }) => {
  const { t } = useTranslation();

  const columns = [
    {
      title: t("Ticket ID"),
      dataIndex: "ticketId",
      width: "10%",
      // eslint-disable-next-line react/display-name
      render: (ticketId) => (
        <Link to={`/ticket?ticketId=${ticketId}`}>{ticketId}</Link>
      ),
    },
    {
      title: t("User ID"),
      dataIndex: "userId",
      width: "10%",
      // eslint-disable-next-line react/display-name
      render: (userId) => (
        <a
          href={`https://www.roblox.com/users/${userId}/profile`}
          target="_blank"
          rel="noreferrer"
        >
          {userId}
        </a>
      ),
    },
    {
      title: t("Current Display Name"),
      dataIndex: "currentDN",
    },
    {
      title: t("Violation words"),
      dataIndex: "violatingWords",
    },
    {
      title: t("Rescan type"),
      dataIndex: "filterType",
    },
    {
      title: t("Ban User"),
      dataIndex: "userId",
      // eslint-disable-next-line react/display-name
      render: (userId) => (
        <BanUser handleBanUser={handleBanUser} userId={userId} size="small" />
      ),
    },
  ];

  return columns;
};

export default RescanColumns;
