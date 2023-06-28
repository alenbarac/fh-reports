import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useMediaQuery } from '@react-hook/media-query';

import { CCol, CContainer, CRow, CSidebar, CSidebarBrand, CSidebarNav, CNavTitle, CNavItem, CBadge, CNavGroup, CButton, COffcanvas, COffcanvasHeader, COffcanvasTitle, CCloseButton, COffcanvasBody } from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css'


const SidebarNavigation = ({ user }) => {
  const mobileView = useMediaQuery('only screen and (max-width: 900px)')
  const [visible, setVisible] = useState(false)

  if (!mobileView) {
    return (
      <CSidebar colorscheme='light' className='dashboard-sidebar'>

        <CSidebarBrand>Welcome {user?.name}</CSidebarBrand>
        <CSidebarNav>
          <CNavItem>
            <Link className='nav-link active' to="/dashboard">
              Dashboard
            </Link>
          </CNavItem>
          <CNavTitle>Configuration</CNavTitle>
          <CNavItem>
            <Link className='nav-link' to="/dashboard/provinces">
              Provinces
            </Link>
          </CNavItem>
          <CNavTitle>Moderation</CNavTitle>

          <CNavGroup toggler="Personal Reports">
            <CNavItem>
              <Link className='submenu-item' to="/dashboard/reports">
                All reports
              </Link>
            </CNavItem>
            <CNavItem>
              <Link className='submenu-item' to="/dashboard/unapproved_reports">
                Unapproved reports
              </Link>
            </CNavItem>

          </CNavGroup>

          <CNavItem>
            <Link className='nav-link' to="/dashboard/unlisted_waterbodies">
              Unlisted waterbodies
            </Link>
          </CNavItem>
          <CNavGroup toggler="Weekly Reports">
            <CNavItem>
              <Link className='submenu-item' to="/dashboard/province_weekly_report/13">
                Alberta
              </Link>
            </CNavItem>
            <CNavItem>
              <Link className='submenu-item' to="/dashboard/province_weekly_report/12">
                British Columbia
              </Link>
            </CNavItem>
            <CNavItem>
              <Link className='submenu-item' to="/dashboard/province_weekly_report/11">
                Manitoba
              </Link>
            </CNavItem>
            <CNavItem>
              <Link className='submenu-item' to="/dashboard/province_weekly_report/15">
                Ontario
              </Link>
            </CNavItem>
            <CNavItem>
              <Link className='submenu-item' to="/dashboard/province_weekly_report/14">
                Saskatchewan
              </Link>
            </CNavItem>
          </CNavGroup>
        </CSidebarNav>

      </CSidebar>
    )
  }
  return (
    <>


      <CButton className="d-lg-none toggle-btn secondary-btn" onClick={() => setVisible(true)}>Navigation</CButton>

      <COffcanvas placement="start" visible={visible} onHide={() => setVisible(false)}>
        <COffcanvasHeader>
          <COffcanvasTitle>Responsive offcanvas</COffcanvasTitle>
          <CCloseButton className="text-reset" onClick={() => setVisible(false)} />
        </COffcanvasHeader>
        <COffcanvasBody>
          <CSidebar colorscheme='light' className='dashboard-sidebar'>

            <CSidebarBrand>Welcome {user?.name}</CSidebarBrand>
            <CSidebarNav>
              <CNavItem>
                <Link className='nav-link active' to="/dashboard">
                  Dashboard
                </Link>
              </CNavItem>
              <CNavTitle>Configuration</CNavTitle>
              <CNavItem>
                <Link className='nav-link' to="/dashboard/provinces">
                  Provinces
                </Link>
              </CNavItem>
              <CNavTitle>Moderation</CNavTitle>
              <CNavItem>
                <Link className='nav-link' to="/dashboard/reports">
                  Personal reports
                </Link>

              </CNavItem>

              <CNavItem>
                <Link className='nav-link' to="/dashboard/unlisted_waterbodies">
                  Unlisted waterbodies
                </Link>
              </CNavItem>
              <CNavGroup toggler="Weekly Reports">
                <CNavItem>
                  <Link className='submenu-item' to="/dashboard/province_weekly_report/13">
                    Alberta
                  </Link>
                </CNavItem>
                <CNavItem>
                  <Link className='submenu-item' to="/dashboard/province_weekly_report/12">
                    British Columbia
                  </Link>
                </CNavItem>
                <CNavItem>
                  <Link className='submenu-item' to="/dashboard/province_weekly_report/11">
                    Manitoba
                  </Link>
                </CNavItem>
                <CNavItem>
                  <Link className='submenu-item' to="/dashboard/province_weekly_report/15">
                    Ontario
                  </Link>
                </CNavItem>
                <CNavItem>
                  <Link className='submenu-item' to="/dashboard/province_weekly_report/14">
                    Saskatchewan
                  </Link>
                </CNavItem>
              </CNavGroup>
            </CSidebarNav>

          </CSidebar>
        </COffcanvasBody>
      </COffcanvas>
    </>




  )
}

export default SidebarNavigation