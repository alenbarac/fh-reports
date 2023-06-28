import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CCol, CContainer, CRow, CSpinner } from '@coreui/react';


import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';

import { useGlobalContext } from '../../context';
import SidebarNavigation from '../../pages/Admin/SidebarNavigation';
import ProvinceWeeklyReportWaterbodies from './ProvinceWeeklyReportWaterbodies';



const ProvinceWeeklyReport = ({ user }) => {

  const { adminProvinceId } = useParams();
  const { loading, adminProvinceCollection } = useGlobalContext();
  if (loading) {
    return (<div className="spinner-container"><CSpinner /></div>)

  } else
    return (

      <CContainer fluid>
        <CRow md={{ gutter: 0 }}>
          <SidebarNavigation user={user} />
          <CCol style={{ paddingLeft: 0, overflow: 'hidden' }} >
            <div className='dashboard-wrapp' style={{ overflow: 'hidden' }}>

              <CContainer fluid>
                <CRow>
                  <CCol style={{ overflow: 'hidden' }}>
                    <ProvinceWeeklyReportWaterbodies adminProvinceId={adminProvinceId} />
                  </CCol>
                </CRow>
              </CContainer>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    );
};

export default ProvinceWeeklyReport;



