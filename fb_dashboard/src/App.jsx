import { Layout, Menu } from "antd";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";

import "./App.css";
import {
  AirtableProvider,
  useAirtableContext,
} from "./context/AirtableContext";
import AuthorizedUsersPage from "./pages/AuthorizedUsersPage";
import CompaniesPage from "./pages/CompaniesPage";
import EventsPage from "./pages/EventsPage";
import PeoplePage from "./pages/PeoplePage";
import AddContactPage from "./pages/AddContactPage";
import ConfigPage from "./pages/ConfigPage";
import HelpPage from "./pages/HelpPage";

const { Header, Content } = Layout;

const menuItems = [
  {
    key: "views",
    label: "Views",
    children: [
      { key: "people", label: <Link to={"people"}>People</Link> },
      {
        key: "companies",
        label: <Link to={"companies"}>Companies</Link>,
      },
      { key: "events", label: <Link to={"events"}>Events</Link> },
      {
        key: "users",
        label: <Link to={"users"}>Authorized Users</Link>,
      },
    ],
  },
  {
    key: "add_contact",
    label: <Link to={"add_contact"}>Add Contact</Link>,
  },
  { key: "config", label: <Link to={"config"}>Config</Link> },
  { key: "help", label: <Link to={"help"}>Help</Link> },
];

const AppContent = () => {
  const { initializing } = useAirtableContext();
  const location = useLocation();

  if (initializing) {
    // Avoid double-reload or premature render in React.StrictMode
    return null;
  }

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const selectedKeys = pathSegments.length > 0 ? pathSegments : ["help"];

  return (
    <Layout style={{ height: "100vh" }}>
      <Header className="header">
        <div className="logo">
          <img
            src={"BasisTech.png"}
            alt="BasisTech Logo"
            style={{ height: "31px", margin: "16px 24px 16px 0" }}
          />
        </div>
        <Menu mode="horizontal" selectedKeys={selectedKeys} items={menuItems} />
      </Header>
      <Content style={{ marginTop: 64, padding: "0 24px", background: "#fff" }}>
        <Routes>
          <Route path="/" element={<HelpPage />} />
          <Route path="people" element={<PeoplePage />} />
          <Route path="companies" element={<CompaniesPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="users" element={<AuthorizedUsersPage />} />
          <Route path="add_contact" element={<AddContactPage />} />
          <Route path="config" element={<ConfigPage />} />
          <Route path="help" element={<HelpPage />} />
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
