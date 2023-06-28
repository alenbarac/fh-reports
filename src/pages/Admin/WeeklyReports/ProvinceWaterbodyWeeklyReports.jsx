import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CContainer, CRow, CSpinner, CFormInput, CFormLabel, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CFormCheck, CToast, CToastHeader, CToastBody, CModalTitle, CFormSelect } from '@coreui/react';

import {
  Plugin, Template, TemplateConnector, TemplatePlaceholder,
} from '@devexpress/dx-react-core';

import { DataTypeProvider, IntegratedFiltering, SearchState, SortingState, IntegratedSorting, EditingState } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, VirtualTable, Toolbar, SearchPanel, PagingPanel, TableFixedColumns, TableEditColumn } from '@devexpress/dx-react-grid-bootstrap4';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';
import apiClient from '../../../helpers/api'
import { useGlobalContext } from '../../../context';
import SidebarNavigation from '../../../pages/Admin/SidebarNavigation';
import ProvinceWeeklyReportTable from '../../../components/admin/ProvinceWeeklyReportTable';

const ProvinceWaterbodyWeeklyReport = ({ user }) => {

  const { waterbodyId } = useParams();
  const { loading } = useGlobalContext();

  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [waterBodyName, setWaterbodyName] = useState('');
  const [waterBodyRegion, setWaterbodyRegion] = useState('');
  const [waterBodyProvince, setWaterbodyProvince] = useState('');
  const [waterBodyProvinceID, setWaterbodyProvinceID] = useState(null);

  const getWaterbodyTableData = () => {

    apiClient
      .get(`/waterbodies/${waterbodyId}`)
      .then((response) => {
        const cols = response.data.data.columns;
        setRows(response.data.data.rows);
        setColumns(cols);
        setWaterbodyName(response.data.data.waterbodyName);
        setWaterbodyRegion(response.data.data.regionName);
        setWaterbodyProvince(response.data.data.provinceName);
        setWaterbodyProvinceID(response.data.data.provinceID);
      })

      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getWaterbodyTableData();

  }, []);

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
                    <CCard className='mb-4'>
                      <CCardHeader className='card-header__darkblue'>Weekly reports</CCardHeader>
                      <CCardBody className='dashboard-table'>
                        <ProvinceWeeklyReportTable rows={rows} setRows={setRows} columns={columns} waterBodyName={waterBodyName} waterBodyRegion={waterBodyRegion} waterBodyProvince={waterBodyProvince} waterBodyProvinceID={waterBodyProvinceID} getWaterbodyTableData={getWaterbodyTableData} />
                      </CCardBody>
                    </CCard>
                  </CCol>
                </CRow>
              </CContainer>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    );
};

export default ProvinceWaterbodyWeeklyReport;


