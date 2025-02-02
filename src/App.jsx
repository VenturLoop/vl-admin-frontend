import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CreateInvestorForm from "./pages/CreateInvestorForm";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout"; // Includes Header and Sidebar
import InvestorsTable from "./pages/InvestorsTable";
import EditInvestorPage from "./pages/UpdateInvestorForm"; // Import the EditInvestorPage
import InvestorProfile from "./pages/InvestorProfile";
import UsersTable from "./pages/users/UsersTable";
import UserDetails from "./pages/users/UserDetails"; // Import the new UserDetails component

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route (Login Page) */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes with Layout (Header, Sidebar, Content) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute
              element={
                <Layout>
                  <DashboardPage />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/create-investor"
          element={
            <PrivateRoute
              element={
                <Layout>
                  <CreateInvestorForm />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/investors"
          element={
            <PrivateRoute
              element={
                <Layout>
                  <InvestorsTable />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/edit-investor/:id"
          element={
            <PrivateRoute
              element={
                <Layout>
                  <EditInvestorPage />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/investor/:id"
          element={
            <PrivateRoute
              element={
                <Layout>
                  <InvestorProfile />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute
              element={
                <Layout>
                  <UsersTable />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/user/:id" // Dynamic route for user details
          element={
            <PrivateRoute
              element={
                <Layout>
                  <UserDetails />
                </Layout>
              }
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
