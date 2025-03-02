import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Headerdefault from "./components/Headerdefault";
import Header from "./components/Header";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Signout from "./pages/Signout";
import Dashboard from "./pages/Dashboard";
import Page2 from "./pages/Page_2";
import Workout from "./pages/Workout";
import { UserProvider } from "./UserContext"; // Import the context

function App() {
  const location = useLocation();

  // Default Header for these pages
  const isDefaultHeader = ["/", "/signin", "/signup"].includes(
    location.pathname
  );

  return (
    <div>
      {/* Conditionally render Header based on the route */}
      {isDefaultHeader ? <Headerdefault /> : <Header />}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signout" element={<Signout />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/page2" element={<Page2 />} />
        <Route path="/workout" element={<Workout />} />
      </Routes>
    </div>
  );
}

export default function Root() {
  return (
    <UserProvider>
      {" "}
      {/* Wrap the entire app in UserProvider */}
      <Router>
        <App />
      </Router>
    </UserProvider>
  );
}
