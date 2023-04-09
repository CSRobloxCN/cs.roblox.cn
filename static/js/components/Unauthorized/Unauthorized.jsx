import React from "react";
import { Button } from "antd";
import { useOktaAuth } from "@okta/okta-react";
import { useTranslation } from "react-i18next";

import "./Unauthorized.css";

export default function Unauthorized() {
  const { oktaAuth } = useOktaAuth();
  const { t } = useTranslation();

  const login = async () => {
    oktaAuth.signInWithRedirect();
  };

  return (
    <div className="un-auth">
      <p>{t("No Access")}</p>
      <p>{t("Please Sign In")}</p>
      <p>
        <Button type="primary" onClick={login}>
          {t("Login")}
        </Button>
      </p>
    </div>
  );
}
