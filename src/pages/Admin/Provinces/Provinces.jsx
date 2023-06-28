import React from 'react'
import { useState, useEffect } from 'react';
import { CCol, CContainer, CRow, CButton, CCard, CCardBody, CCardTitle, CBreadcrumb, CBreadcrumbItem, CWidgetStatsF, CLink, CSpinner, CBadge } from '@coreui/react';

import '@coreui/coreui/dist/css/coreui.min.css'
import CIcon from '@coreui/icons-react';
import { cilPuzzle, cilSpeedometer, cilArrowRight, cilChartPie } from '@coreui/icons';
import SidebarNavigation from '../SidebarNavigation';
import { useGlobalContext } from '../../../context';
import { Link } from 'react-router-dom';
import apiClient from '../../../helpers/api';

import albertaProvince from '../../../img/alberta-province.jpg'
import bcProvince from '../../../img/bc-province.jpg'
import manitobaProvince from '../../../img/manitoba-province.jpg'
import ontarioProvince from '../../../img/ontario-province.jpg'
import saskatchewanProvince from '../../../img/sascatchewan-province.jpg'

const Provinces = ({ user }) => {

  const { loading, setLoading } = useGlobalContext();

  const [provinceData, setProvinceData] = useState([]);

  const getProvinces = async () => {
    setLoading(true);
    await apiClient
      .get('/admin/provinces')
      .then((response) => {
        setProvinceData(response.data);
        setLoading(false);
      })

      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getProvinces();
  }, [])

  if (loading) {
    return (<div className="spinner-container"><CSpinner /></div>)

  } else
    return (
      <CContainer fluid>

        <CRow md={{ gutter: 0 }}>

          <SidebarNavigation />

          <CCol style={{ background: '#f7f7f7' }}>
            <div className='dashboard-wrapp'>
              <CRow>
                <CBreadcrumb className='dashboard-breadcrumb'>
                  <CBreadcrumbItem active>Provinces configuration</CBreadcrumbItem>
                </CBreadcrumb>
                <CCol xs={12}>
                  <div className="dashboard__provinces__config-wrapper">

                    {
                      provinceData.data?.map((province, index) => {
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

                                    <Link className='provinceList__item-btn' to={`/dashboard/provinces/${id}`}>Config</Link>
                                    {isActive == false ? <CBadge color="danger" shape="rounded-pill" className='provinceList__item-disabled'>Disabled</CBadge> : ''}
                                  </CCardBody>
                                </CCol>
                              </CRow>
                            </CCard>
                          </div>

                        )

                      })
                    }

                  </div>

                  <CCol>
                  </CCol>

                </CCol>

              </CRow>
            </div>
          </CCol>
        </CRow>

      </CContainer >
    )
}

export default Provinces