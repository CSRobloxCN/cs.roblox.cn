import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import { useOktaAuth } from "@okta/okta-react";
import { Unauthorized } from "components/Unauthorized";
import { LoadingWindow } from "components/LoadingWindow";
import { useLocation } from "react-router-dom";
import { SideBar } from "widgets/SideBar";
import { ModeratorAccount } from "context/ModeratorAccount";
import { PageHeader } from "widgets/PageHeader";
import { useTranslation } from "react-i18next";
const { Content } = Layout;

const PageFrame = ({ children }) => {
  const { t } = useTranslation();
  const pathname = useLocation().pathname;
  const { authState, oktaAuth } = useOktaAuth();
  let [moderatorAccountInfo, setModeratorAccountInfo] = useState(null);
  let pageContent;
  if (authState.isAuthenticated) {
    pageContent = (
      <>
        <SideBar currentPage={pathname} />
        <Layout style={{height:"100%",overflow:"auto"}}>
          <Content>{children}</Content>
        </Layout>
      </>
    );
  } else {
    pageContent = <Unauthorized />;
  }
  if (authState.isPending && !authState.isAuthenticated) {
    pageContent = (
      <LoadingWindow
        loadText={t(
          "If page is loading forever, check with your IT manager to see if you have access to this Okta application first."
        )}
      />
    );
  }
  useEffect(() => {
    if (authState.isAuthenticated) {
      oktaAuth.getUser().then((info) => {
        setModeratorAccountInfo(info);
      });
    }
  }, [authState, oktaAuth]);
  return (
    <ModeratorAccount.Provider value={moderatorAccountInfo}>
      <PageHeader />
      <Layout className="page-frame">
        <Layout>{pageContent}</Layout>
      </Layout>
    </ModeratorAccount.Provider>
  );
};

export default PageFrame;
