// src/App.jsx

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignIn from "./pages/Signin";
import Register from "./pages/Register";
import MainPage from "./pages/MainPage";
import ErrorPage from "./pages/NotFound";
import NavBar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const authToken = localStorage.getItem("authToken");

  return (
    <Router>
      <NavBar />
      <Routes>
        {/* If logged in, redirect from signin/register to main page */}
        <Route
          path="/signin"
          element={authToken ? <Navigate to="/main" replace /> : <SignIn />}
        />
        <Route
          path="/register"
          element={authToken ? <Navigate to="/main" replace /> : <Register />}
        />

        {/* Protect the main page route */}
        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />

        {/* Error page for unknown URLs */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
