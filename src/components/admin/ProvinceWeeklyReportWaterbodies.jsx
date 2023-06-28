import React, { useEffect, useState } from 'react';
import { CCol, CContainer, CRow, CCard, CCardHeader, CCardBody, CBadge, CButton, CAlert, CForm, CFormInput, CFormLabel, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CFormCheck, CToast, CToastHeader, CToastBody, CModalTitle, CFormSelect } from '@coreui/react';


import SidebarNavigation from '../../pages/Admin/SidebarNavigation';
import { DataTypeProvider, IntegratedFiltering, SearchState, SortingState, IntegratedSorting, PagingState, IntegratedPaging, EditingState } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, VirtualTable, Toolbar, SearchPanel, PagingPanel } from '@devexpress/dx-react-grid-bootstrap4';

import apiClient from '../../helpers/api';
import FormAddAdminWaterbody from './FormAddAdminWaterbody';
import { useGlobalContext } from '../../context';
import { Link } from 'react-router-dom';


const ProvinceWeeklyReportWaterbodies = ({ adminProvinceId, provinceName }) => {

  const [rows, setRows] = useState([]);
  const getRowId = row => row.id;
  const [filteringStateColumnExtensions, setFilteringStateColumnExtensions] = useState(false);
  const [visibleAddWaterbody, setVisibleAddWaterbody] = useState(false);
  const [isSubmited, setIsSubmited] = useState(false);

  const handleShowAddWaterbody = () => setVisibleAddWaterbody(true);
  const handleCloseAddWaterbody = () => setVisibleAddWaterbody(false);

  const { loading } = useGlobalContext();

  const TableComponent = ({ ...restProps }) => <Table.Table {...restProps} className="table-striped table-sticky fixed-header" />;
  const [columns] = useState([
    { name: 'waterbodyName', title: 'Waterbody', width: 250, wordWrapEnabled: true, align: 'center' },
    { name: 'provinceName', title: 'Province', width: 250, wordWrapEnabled: true, align: 'center' },
    { name: 'regionName', title: 'Region', width: 250, wordWrapEnabled: true, align: 'center' },
    { name: 'waterbodyInfo', title: 'Info', wordWrapEnabled: true, width: 250, align: 'center' },

  ]);

  //report status
  const tableInfoFormatter = ({ value, row }) => (
    <div>
      <Link className="reportTable__link-action" to={`/dashboard/waterbodies/${row.id}/weekly_reports`}>
        Show reports
      </Link>

    </div>

  );

  const WeeklyReportInfoTypeProvider = (props) => <DataTypeProvider formatterComponent={tableInfoFormatter} {...props} />;

  const [infoColumns] = useState(['waterbodyInfo']);

  const getTableData = async () => {

    await apiClient
      .get(`/admin/provinces/${adminProvinceId}/waterbodies`)
      .then((response) => {
        console.log(response)
        setRows(response.data.data.rows);
        setFilteringStateColumnExtensions(
          columns.map((col) => {
            return { columnName: col.name, filteringEnabled: false };
          })
        );
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getTableData();
  }, []);

  useEffect(() => {
    getTableData();
  }, [adminProvinceId]);

  if (loading) {
    return (<div className="spinner-container"><CSpinner /></div>)

  } else

    return (
      <>
        <CCard className='mb-4'>
          <CCardHeader className='card-header__darkblue'>Province Waterbodies</CCardHeader>
          <CCardBody className='dashboard-table'>
            {isSubmited && (<CToast autohide={false} visible={true} color="primary" className='text-white align-items-center'>
              <CToastBody>Waterbody updated.</CToastBody>
            </CToast>)}

            {rows && columns && (
              <>

                <Grid rows={rows} columns={columns} getRowId={getRowId}>
                  <SearchState />

                  <IntegratedFiltering columnExtensions={filteringStateColumnExtensions} />
                  <VirtualTable height="auto" />

                  <PagingState
                    defaultCurrentPage={0}
                    pageSize={8}
                  />
                  <IntegratedPaging />

                  <Table tableComponent={TableComponent} />
                  <WeeklyReportInfoTypeProvider for={infoColumns} />
                  <TableHeaderRow className="table-sticky" />

                  <PagingPanel />
                  <Toolbar />
                  <SearchPanel />
                </Grid>

              </>

            )}

          </CCardBody>
        </CCard>

        <CModal alignment="center" size="lg" visible={visibleAddWaterbody} onClose={() => handleCloseAddWaterbody}>
          <CModalHeader>
            <CModalTitle>Add Waterbody</CModalTitle>
          </CModalHeader>
          <CModalBody>

          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={handleCloseAddWaterbody}>
              Close
            </CButton>

          </CModalFooter>
        </CModal>
      </>

    )
}

export default ProvinceWeeklyReportWaterbodies