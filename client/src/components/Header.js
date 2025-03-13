import React, { useContext } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles.css";
import { UserContext } from "../UserContext"; // Import UserContext

const Header = () => {
  const { userEmail } = useContext(UserContext); // Access userEmail from context

  return (
    <Navbar
      expand="lg"
      style={{
        background: "#2C3E50",
        color: "white",
      }}
    >
      <Container>
        <Navbar.Brand style={{ color: "white", fontWeight: "bold" }}>
          {/* Display the welcome message if the user is signed in */}
          {userEmail && (
            <span
              style={{
                color: "White",

                //fontWeight: "bold",
                fontSize: "14px",
                //textTransform: "uppercase",
                letterSpacing: "1px",
                //position: "fixed",
                marginRight: "15px",
              }}
            >
              Welcome {userEmail}!
            </span>
          )}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              to="/browsefood"
              className="nav-link"
              style={{ color: "white", fontWeight: "bold" }}
            >
              Browse Food
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/mealplan"
              className="nav-link"
              style={{ color: "white", fontWeight: "bold" }}
            >
              Meal Plan
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/Workout"
              className="nav-link"
              style={{ color: "white", fontWeight: "bold" }}
            >
              Workouts
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/dashboard"
              className="nav-link"
              style={{ color: "white", fontWeight: "bold" }}
            >
              Dashboard
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/signout"
              className="nav-link"
              style={{ color: "white", fontWeight: "bold" }}
            >
              Sign Out
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
