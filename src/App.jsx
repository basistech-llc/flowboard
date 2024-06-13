import React from "react";
import { Layout, Menu } from "antd";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";

import "./App.css";
import { AirtableProvider, useAirtable } from "./context/AirtableContext";
import EventsPage from "./pages/EventsPage";
import FunnelPage from "./pages/FunnelPage";
import ConfigPage from "./pages/ConfigPage";
import HelpPage from "./pages/HelpPage";
import { urlOf } from "./utils/deploymentUtils";

const { Header, Content } = Layout;

const menuItems = [
  { key: "events", label: <Link to={urlOf("events")}>Events</Link> },
  { key: "funnel", label: <Link to={urlOf("funnel")}>Funnel</Link> },
  { key: "config", label: <Link to={urlOf("config")}>Config</Link> },
  { key: "help", label: <Link to={urlOf("help")}>Help</Link> },
];

const AppContent = () => {
  const { airtableToken, initializing } = useAirtable();
  const location = useLocation();

  if (initializing) {
    return null;
  }

  const basePath = urlOf("").replace(/\/$/, "");
  const relativePath = location.pathname.replace(basePath, "");
  const selectedKey =
    relativePath.split("/")[1] || (airtableToken ? "funnel" : "config");

  return (
    <Layout style={{ height: "100vh" }}>
      <Header className="header">
        <div className="logo">
          <img
            src={urlOf("BasisTech.png")}
            alt="BasisTech Logo"
            style={{ height: "31px", margin: "16px 24px 16px 0" }}
          />
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={menuItems}
        />
      </Header>
      <Content style={{ marginTop: 64, padding: "0 24px", background: "#fff" }}>
        <Routes>
          <Route
            path={urlOf("")}
            element={
              <Navigate
                to={airtableToken ? urlOf("funnel") : urlOf("config")}
              />
            }
          />
          <Route path={urlOf("events")} element={<EventsPage />} />
          <Route path={urlOf("funnel")} element={<FunnelPage />} />
          <Route path={urlOf("config")} element={<ConfigPage />} />
          <Route path={urlOf("help")} element={<HelpPage />} />
        </Routes>
      </Content>
    </Layout>
  );
};

const App = () => (
  <AirtableProvider>
    <Router>
      <AppContent />
    </Router>
  </AirtableProvider>
);

export default App;
