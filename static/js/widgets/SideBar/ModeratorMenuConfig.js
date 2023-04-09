import React from "react";
import {
  AppstoreOutlined,
  SearchOutlined,
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";
export default [
  {
    name: "Ticket Management",
    icon: <MailOutlined />,
    children: [
      {
        name: "Ticket Dashboard",
        link: "/",
        icon: <AppstoreOutlined />,
      },
      {
        name: "Ticket Query",
        link: "/ticketquery",
        icon: <SearchOutlined />,
      },
      {
        name: "My Tickets",
        link: "/mytickets",
        icon: <SearchOutlined />,
      },
      {
        name: "My Locked Tickets",
        link: "/mylockedtickets",
        icon: <LockOutlined />,
      },
    ],
  },
  {
    name: "Game Dashboard",
    icon: <MailOutlined />,
    children: [
      {
        name: "Overview",
        link: "/gamestatusmetrics",
        icon: <AppstoreOutlined />,
      },
      {
        name: "Game Allowlist History",
        link: "/gamestatushistory",
        icon: <SearchOutlined />,
      }
    ],
  }
];
