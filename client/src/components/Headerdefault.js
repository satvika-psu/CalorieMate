import React from "react";
import { Navbar, Container } from "react-bootstrap";
import "../styles.css";

const Headerdefault = () => {
  return (
    <Navbar
      expand="lg"
      style={{
        background: "#2C3E50",
        color: "white",
        paddingBottom: "25px",
      }}
    >
      <Container>
        <Navbar.Brand href="/"></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Headerdefault;
