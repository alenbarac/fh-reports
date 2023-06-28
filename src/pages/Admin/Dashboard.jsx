import React, { useState, useContext, useEffect } from 'react';

import { CCol, CContainer, CRow, CButton, CCard, CCardBody, CCardTitle, CBreadcrumb, CBreadcrumbItem, CWidgetStatsF, CLink, CSpinner, CCardText, CBadge, CSidebarToggler } from '@coreui/react';


import '@coreui/coreui/dist/css/coreui.min.css'
import CIcon from '@coreui/icons-react';
import { cilPuzzle, cilSpeedometer, cilArrowRight, cilChartPie } from '@coreui/icons';
import SidebarNavigation from './SidebarNavigation';
import { useGlobalContext } from '../../context';
import apiClient from '../../helpers/api';
import { Link } from 'react-router-dom';

import albertaProvince from '../../img/alberta-province.jpg'
import bcProvince from '../../img/bc-province.jpg'
import manitobaProvince from '../../img/manitoba-province.jpg'
import ontarioProvince from '../../img/ontario-province.jpg'
import saskatchewanProvince from '../../img/sascatchewan-province.jpg'

const Dashboard = ({ user }) => {

  const { loading, setLoading } = useGlobalContext();
  const [provinceData, setProvinceData] = useState([]);
  const [unapprovedData, setUnapprovedData] = useState({});

  const getProvinces = async () => {
    setLoading(true);
    await apiClient
      .get('/admin/provinces')
      .then((response) => {
        console.log(response);
        setProvinceData(response.data);
        setLoading(false);
      })

      .catch((error) => console.error(error));
  };

  const getUnapprovedData = async () => {
    setLoading(true);
    await apiClient
      .get('/admin/unapproved_data')
      .then((response) => {
        setUnapprovedData(response.data);
        setLoading(false);
      })

      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getProvinces();
    getUnapprovedData();
  }, [])

  if (loading) {

    return (
      <div className="spinner-container"><CSpinner /></div>
    )

  } else
    return (

      <CContainer fluid>

        <CRow md={{ gutter: 0 }}>

          <SidebarNavigation user={user} />

          <CCol style={{ background: '#f7f7f7' }}>
            <div className='dashboard-wrapp'>
              <CRow>
                <CBreadcrumb className='dashboard-breadcrumb'>
                  <CBreadcrumbItem active>Dashboard</CBreadcrumbItem>
                </CBreadcrumb>
                <CCol md={7} xs={12}>


                  {loading ? (
                    <div className="spinner-container--component"><CSpinner /></div>
                  ) :
                    <div className="dashboard__provinces-wrapper">

                      {provinceData.data && (
                        provinceData.data.map((province, index) => {
                          const { id, provinceName, regions, isActive } = province;
                          const waterBodyCount = regions.map((region) => {
                            return region.waterbodies.length;
                          });

                          let image;
                          switch (id) {
                            case 13:
                              image = albertaProvince // code block
                              break;
                            case 12:
                              image = bcProvince
                              break;
                            case 11:
                              image = manitobaProvince
                              break;
                            case 15:
                              image = ontarioProvince
                              break;

                            case 14:
                              image = saskatchewanProvince
                              break;
                            default:
                              image = albertaProvince
                          }
                          const waterbodiesByProvince = waterBodyCount.reduce((a, b) => a + b, 0);

                          return (
                            <div className="provinceList__item" key={id}>
                              <CCard className="mb-3 border-warning">
                                <CRow className="no-gutters">
                                  <CCol md={5}>
                                    <div className="province__list-img">
                                      <img src={image} className="img-fluid rounded-start" alt="..." />
                                    </div>
                                  </CCol>
                                  <CCol md={7}>
                                    <CCardBody>
                                      <CCardTitle>{provinceName}</CCardTitle>
                                      <div className="provinceList__item-detail">Regions: {regions.length}</div>
                                      <div className="provinceList__item-detail">Waterbodies: {waterbodiesByProvince}</div>
                                      <Link className='provinceList__item-btn provinceList__item-btn--sm,all' to={`/dashboard/provinces/${id}`}>Config</Link>
                                      {isActive == false ? <CBadge color="danger" shape="rounded-pill" className='provinceList__item-disabled'>Disabled</CBadge> : ''}
                                    </CCardBody>
                                  </CCol>
                                </CRow>
                              </CCard>
                            </div>

                          )

                        })
                      )}

                    </div>
                  }


                  <CCol>
                  </CCol>

                </CCol>

                <CCol md={5} xs={12}>
                  <CWidgetStatsF
                    className="mb-3"
                    color="primary"
                    footer={
                      <Link
                        className="font-weight-bold font-xs text-medium-emphasis"
                        to="/dashboard/unapproved_reports"
                      >
                        View more
                        <CIcon icon={cilArrowRight} className="float-end" width={16} />
                      </Link>
                    }
                    icon={<CIcon icon={cilChartPie} height={24} />}
                    title="Unaproved Personal Reports"
                    value={unapprovedData?.reports} />

                  <CWidgetStatsF
                    className="mb-3"
                    color="tertiary"
                    footer={
                      <Link
                        className="font-weight-bold font-xs text-medium-emphasis"
                        to="/dashboard/unlisted_waterbodies"
                      >
                        View more
                        <CIcon icon={cilArrowRight} className="float-end" width={16} />
                      </Link>
                    }
                    icon={<CIcon icon={cilChartPie} height={24} />}
                    title="Unlisted waterbodies"
                    value={unapprovedData?.waterbodies} />
                </CCol>
              </CRow>
            </div>
          </CCol>
        </CRow>

      </CContainer >
    )
}

export default Dashboard