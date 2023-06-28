import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@react-hook/media-query';
import { Link } from 'react-router-dom';
import { CNavbar, CNavbarBrand, CNavbarNav, CNavItem, CNavLink, CNavbarToggler, CCollapse, CContainer } from '@coreui/react';

const Header = ({ isAdmin, signOut }) => {
  const [visible, setVisible] = useState(false);

  const mobileView = useMediaQuery('only screen and (max-width: 576px)')
  const handleLogout = () => {
    signOut().then(() => console.log('Signed Out'))
      .catch(() => console.log('Incorrect email or password'));;
  }

  return (
    <>
      <div className={`header__navbar-top d-flex  ${mobileView ? 'justify-content-start' : 'justify-content-end'}`}>
        <CNavbar expand="lg" className='header-top'>
          <CContainer fluid>

            <CNavbarNav className="header__nav-top">
              <CNavItem>
                <CNavLink href="https://fishinhole-integration.commer.com/">
                  Store Homepage
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#">
                  Download Free Catalog
                </CNavLink>
              </CNavItem>

            </CNavbarNav>
          </CContainer>

        </CNavbar>
      </div>
      <CNavbar expand="lg" colorScheme="light" className='header'>
        <CContainer fluid>
          <CNavbarBrand className="header__brand">
            <Link to="/"><img className='header-logo' src="https://fishinhole-integration.commer.com/static/version1661782460/frontend/FishinHole/store/en_CA/images/logo.png" alt="" /></Link>
          </CNavbarBrand>
          <CNavbarToggler aria-label="Toggle navigation" aria-expanded={visible} onClick={() => setVisible(!visible)} />
          <CCollapse className="navbar-collapse justify-content-end" visible={visible}>
            <CNavbarNav className="header__nav">
              <CNavItem>
                <CNavLink href="https://reports.fishinhole-integration.commer.com/">
                  Home
                </CNavLink>
              </CNavItem>

              <CNavItem>
                <CNavLink href="#">
                  Fishing Events
                </CNavLink>
              </CNavItem>

              <CNavItem>
                <CNavLink href="#">
                  Customer Service
                </CNavLink>
              </CNavItem>
              {!isAdmin && (
              <>
              <CNavItem>
                <CNavLink href="/login">
                  Login
                </CNavLink>
              </CNavItem>
                </>)}
             
              {isAdmin && (
                <>
                  <CNavItem>
                    <Link className='nav-link active dash-link' to="/dashboard">
                      Dashboard
                    </Link>
                  </CNavItem>

                  <CNavItem>
                    <Link className='nav-link active logout-link' to="/" onClick={handleLogout}>
                      Logout
                    </Link>
                  </CNavItem>
                </>

              )}

            </CNavbarNav>
          </CCollapse>
        </CContainer>
      </CNavbar>
    </>
  );
};

export default Header;