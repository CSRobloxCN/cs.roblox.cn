import React from "react";
import {
  AppstoreOutlined,
  SearchOutlined,
  TeamOutlined,
  MailOutlined,
  UserSwitchOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
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
    name: "Allowlist Management",
    icon: <TeamOutlined />,
    children: [
      {
        name: "Toolbox Assets Allowlist",
        link: "/assetsallowlist",
        icon: <MailOutlined />,
      },
      {
        name: "Game Allowlist",
        link: "/gameallowlist",
        icon: <MailOutlined />,
      },
      {
        name: "Asset Management Panel",
        link: "/asset-management-panel",
        icon: <SearchOutlined />,
      },
    ],
  },
  {
    name: "User Management",
    icon: <UserSwitchOutlined />,
    children: [
      {
        name: "Ban User",
        link: "/banuser",
        icon: <ExclamationCircleOutlined />,
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
      },
      {
        name: "Game Sort Info",
        link: "/gamesortinfo",
        icon: <SearchOutlined />,
      },
      {
        name: "Place Version Allowlist Query",
        link: "/gamewhitelistquery",
        icon: <SearchOutlined />,
      },
      {
        name: "Close Game",
        link: "/close-game",
        icon: <WarningOutlined />,
      },
    ],
  },
  {
    name: "Action History",
    icon: <SearchOutlined />,
    children: [
      {
        name: "Search",
        link: "/actionhistory",
        icon: <SearchOutlined />,
      },
    ],
  },
  {
    name: "Data Dashboard",
    icon: <SearchOutlined />,
    children : [
      {
        name: "Moderator",
        link: "/moderator-ticket-review",
        icon: <UserSwitchOutlined />,
      }
    ]
  }
];
