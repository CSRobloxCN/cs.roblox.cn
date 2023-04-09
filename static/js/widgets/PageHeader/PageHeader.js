import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Layout, Button, Space, Typography } from "antd";
import styles from "./PageHeader.module.css";
import { LocaleSwitcher } from "components/LocaleSwitcher";
import { useOktaAuth } from "@okta/okta-react";
import { ModeratorAccount } from "context/ModeratorAccount";
const { Text } = Typography;

const { Header } = Layout;

const PageHeader = () => {
  const { t } = useTranslation();
  const { authState, oktaAuth } = useOktaAuth();
  // const [userInfo, setUserInfo] = useState(null);
  let userInfo = useContext(ModeratorAccount);
  let button = authState.isAuthenticated ? (
    <Button type="link" onClick={() => oktaAuth.signOut()}>
      {t("logout")}
    </Button>
  ) : (
    <Button type="link" onClick={() => oktaAuth.signIn()}>
      {t("login")}
    </Button>
  );

  return (
    <Header className={styles.header}>
      <div className={styles.logo}>{t("logo")}</div>
      <div className={styles.header_nav}>
        <Space size={20}>
          <LocaleSwitcher />
          {userInfo && <Text type="warning">{userInfo.name}</Text>}
          <div>{button}</div>
        </Space>
      </div>
    </Header>
  );
};

export default PageHeader;
