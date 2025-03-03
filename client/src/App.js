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
import MealPlan from "./pages/MealPlan";
import Workout from "./pages/Workout";

function App() {
  const location = useLocation();

  // Default Header for the these pages
  const isDefaultHeader = ["/", "/signin", "/signup"].includes(
    location.pathname
  );

  return (
    <div>
      {isDefaultHeader ? <Headerdefault /> : <Header />}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signout" element={<Signout />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/page2" element={<Page2 />} />
        <Route path="/mealplan" element={<MealPlan />} />{" "}
        <Route path="/workout" element={<Workout />} />
      </Routes>
    </div>
  );
}

export default function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}
