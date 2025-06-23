import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

export default function Title() {
    const userInfo = useSelector((state) => state.userDetails?.user || null);
    const location = useLocation();

    return (
        <Navbar className='title' expand="lg">
            <Container>
                <img src="/Logo.png" className='logo' alt="Logo" />
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto d-flex">
                        <Nav.Link
                            as={Link}
                            to="/user/project"
                            className={`poppins-bold text-white nav-link-custom ${location.pathname === "/user/project" ? "active" : ""}`}
                        >
                            Projects
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/user/userdetails"
                            className={`poppins-bold text-white nav-link-custom ${location.pathname === "/user/userdetails" ? "active" : ""}`}
                        >
                            User Details
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}