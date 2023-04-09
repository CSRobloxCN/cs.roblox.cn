import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import styles from "./SideBar.module.css";
import { ModeratorAccount } from "context/ModeratorAccount";
import AdminMenuConfig from "./AdminMenuConfig";
import ModeratorMenuConfig from "./ModeratorMenuConfig";

const { Sider } = Layout;
const { SubMenu } = Menu;

const SideBar = ({ currentPage }) => {
  const { t } = useTranslation();
  let userInfo = useContext(ModeratorAccount);
  if (!userInfo) return null;
  let currentConfig = ModeratorMenuConfig;
  if (
    userInfo.groups &&
    userInfo.groups.find((v) => v === "LuobuModerationManager")
  ) {
    currentConfig = AdminMenuConfig;
  }
  return (
    <Sider width={250} className={styles.site_layout_background}>
      <Menu
        className={styles.menu}
        mode="inline"
        defaultSelectedKeys={[currentPage]}
        defaultOpenKeys={currentConfig
          .filter((menu) => menu.children)
          .map((menu) => menu.name)}
      >
        {currentConfig.map((subMenu) => {
          if (subMenu.children) {
            return (
              <SubMenu
                key={subMenu.name}
                title={t(subMenu.name)}
                icon={subMenu.icon}
              >
                {subMenu.children.map((subMenuItem) => {
                  return (
                    <Menu.Item key={subMenuItem.link} icon={subMenuItem.icon}>
                      <Link to={subMenuItem.link}>{t(subMenuItem.name)}</Link>
                    </Menu.Item>
                  );
                })}
              </SubMenu>
            );
          } else {
            return (
              <Menu.Item key={subMenu.link} icon={subMenu.icon}>
                <Link to={subMenu.link}>
                  <a>{t(subMenu.name)}</a>
                </Link>
              </Menu.Item>
            );
          }
        })}
      </Menu>
    </Sider>
  );
};

export default SideBar;
