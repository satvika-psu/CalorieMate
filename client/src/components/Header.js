import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles.css";

const Header = () => {
  return (
    <Navbar
      expand="lg"
      style={{
        background: "#2C3E50",
        color: "white",
      }}
    >
      <Container>
        <Navbar.Brand href="/" style={{ color: "white", fontWeight: "bold" }}>
          CALORIEMATE
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              to="/"
              className="nav-link"
              style={{ color: "white", fontWeight: "bold" }}
            >
              Login
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/home"
              className="nav-link"
              style={{ color: "white", fontWeight: "bold" }}
            >
              Home
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
