import React from "react";
import { Navbar, Container } from "react-bootstrap";
import "../styles.css";

const Headerdefault = () => {
  return (
    <Navbar
      expand="lg"
      style={{
        background: "#467d74",
        color: "white",
        //paddingBottom: "40px",
      }}
    >
      <Container>
        <Navbar.Brand
          href="/"
          style={{
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            color: "white",
          }}
        >
          CALORIEMATE
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Headerdefault;
