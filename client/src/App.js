import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Header from "./components/Header";
import Page1 from "./pages/Page_1";
import Page2 from "./pages/Page_2";
import Page3 from "./pages/Page_3";
export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/page1" element={<Page1 />} />
        <Route path="/page2" element={<Page2 />} />
        <Route path="/page3" element={<Page3 />} />
      </Routes>
    </Router>
  );
}
