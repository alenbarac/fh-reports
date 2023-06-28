import React from 'react'
import { CFooter } from '@coreui/react';
import bannerImg from './../../img/Weekly_Specials_Background_New.jpg'
import { CNavbar, CNavbarBrand, CNavbarNav, CNavItem, CNavLink, CNavbarToggler, CCollapse, CContainer } from '@coreui/react';

const Footer = () => {
  return (
    <>
      <div className="footer-banner">
        <div className="footer-banner__img">
          <img src={bannerImg} alt="" />
        </div>
      </div>
      <CFooter className="front-footer">
        <CNavbar expand="lg">
          <CContainer fluid>
            <CNavbarNav className="">
              <CNavItem>
                <CNavLink href="#">
                  Fishing Records
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#">
                  Fishing Videos
                </CNavLink>
              </CNavItem>

              <CNavItem>
                <CNavLink href="#">
                  Buy a Gift Card
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#">
                  Privacy Policy
                </CNavLink>
              </CNavItem>
            </CNavbarNav>
          </CContainer>
        </CNavbar>
      </CFooter>
    </>

  )
}

export default Footer