import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { OktaAuth } from "@okta/okta-auth-js";
import { Security, SecureRoute, LoginCallback } from "@okta/okta-react";
import config from "config";
import IndexPage from "Pages/DashboardPage";
import TicketDetailPage from "Pages/TicketDetailPage";
import TicketQueryPage from "Pages/TicketQueryPage";
import ModeratorTicketsPage from "Pages/ModeratorTicketsPage";
import ModeratorLockedTicketsPage from "Pages/ModeratorLockedTicketsPage";
import AssetsAllowlistPage from "Pages/AssetsAllowlistPage";
import GameAllowlistPage from "Pages/GameAllowlistPage";
import AssetManagementPanel from "Pages/AssetManagementPanelPage";
import GameMetricsDashboardPage from "Pages/GameMetricsDashboardPage";
import GameSortInfoPage from "Pages/GameSortInfoPage";
import GameStatusHistoryPage from "Pages/GameStatusHistoryPage";
import UserManagementPage from "Pages/UserManagementPage";
import ActionHistoryPage from "Pages/ActionHistoryPage";
import BatchUpdateTicketsPage from "Pages/BatchUpdateTicketsPage";
import ModeratorReviewDataPage from "Pages/ModeratorReviewDataPage";
import ModeratorFinishedTicketPage from "Pages/ModeratorFinishedTicketPage";
import ModeratorReopenedTicketPage from "Pages/ModeratorReopenedTicketPage";
import GameWhitelistQueryPage from "Pages/GameWhitelistQueryPage";
import AssetWhitelistHistoryPage from "Pages/AssetWhitelistHistoryPage";
import CloseGamePage from "Pages/CloseGamePage";

import { PageFrame } from "widgets/PageFrame";
import "i18n";

const oktaAuth = new OktaAuth(config.oidc);

const App = () => (
  <Router>
    <Security oktaAuth={oktaAuth}>
      <PageFrame>
        <Switch>
          <SecureRoute path="/" exact component={IndexPage} />
          <SecureRoute path="/ticket" component={TicketDetailPage} />
          <SecureRoute path="/ticketquery" exact component={TicketQueryPage} />
          <SecureRoute
            path="/gamestatusmetrics"
            exact
            component={GameMetricsDashboardPage}
          />
          <SecureRoute
            path="/gamesortinfo"
            exact
            component={GameSortInfoPage}
          />
          <SecureRoute
            path="/gamestatushistory"
            exact
            component={GameStatusHistoryPage}
          />
          <SecureRoute
            path="/mytickets"
            exact
            component={ModeratorTicketsPage}
          />
          <SecureRoute
            path="/mylockedtickets"
            exact
            component={ModeratorLockedTicketsPage}
          />
          <SecureRoute
            path="/assetsallowlist"
            exact
            component={AssetsAllowlistPage}
          />
          <SecureRoute
            path="/gameallowlist"
            exact
            component={GameAllowlistPage}
          />
          <SecureRoute
            path="/asset-management-panel"
            exact
            component={AssetManagementPanel}
          />
          <SecureRoute
            path="/gamewhitelistquery"
            exact
            component={GameWhitelistQueryPage}
          />
          <SecureRoute path="/banuser" 
            exact 
            component={UserManagementPage} 
          />
          <SecureRoute
            path="/actionhistory"
            exact
            component={ActionHistoryPage}
          />
          <SecureRoute
            path="/batch-update"
            component={BatchUpdateTicketsPage}
          />
          <SecureRoute
            path="/moderator-ticket-review"
            component={ModeratorReviewDataPage}
          />
          <SecureRoute
            path="/moderator-finished-ticket-review"
            component={ModeratorFinishedTicketPage}
          />
          <SecureRoute
            path="/moderator-reopened-ticket-review"
            component={ModeratorReopenedTicketPage}
          />
          <SecureRoute
            path="/asset-whitelist-history"
            component={AssetWhitelistHistoryPage}
          />
          <SecureRoute 
            path="/close-game" 
            exact 
            component={CloseGamePage} 
          />
        </Switch>
      </PageFrame>
      <Route path="/login/callback" component={LoginCallback} />
    </Security>
  </Router>
);

export default App;
