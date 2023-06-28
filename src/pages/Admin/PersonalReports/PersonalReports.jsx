import React, { useEffect, useState } from 'react';
import { CCol, CContainer, CRow, CCard, CCardHeader, CCardBody, CBadge, CButton, CAlert, CForm, CFormInput, CFormLabel, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CFormCheck, CToast, CToastHeader, CToastBody } from '@coreui/react';

import {
  Plugin, Template, TemplateConnector, TemplatePlaceholder,
} from '@devexpress/dx-react-core';

import SidebarNavigation from '../SidebarNavigation';
import { DataTypeProvider, IntegratedFiltering, SearchState, SortingState, IntegratedSorting, PagingState, IntegratedPaging, EditingState } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, VirtualTable, Toolbar, SearchPanel, PagingPanel, TableEditColumn } from '@devexpress/dx-react-grid-bootstrap4';

import apiClient from '../../../helpers/api';
import str2bool from '../../../helpers/str2bool';

function InputFieldGroup({ id, label, ...props }) {
  return (
    <>
      <CFormLabel htmlFor={label}>{label}</CFormLabel>
      <CFormInput {...props} />
    </>
  );
}

function RadioFieldGroup({ id, label, ...props }) {
  return (
    <>
      <CFormCheck type="radio" {...props}
        label={label}
      />
    </>
  );
}


function TextFieldGroup({ id, label, ...props }) {
  return (
    <>
      <CFormLabel htmlFor={label}>{label}</CFormLabel>
      <CFormTextarea
        {...props}
      ></CFormTextarea>
    </>
  );
}

const Popup = ({ row, onChange, onApplyChanges, onCancelChanges, open }) => {
  return (
    <CModal size='lg' visible={open} onClose={onCancelChanges} aria-labelledby="form-dialog-title">
      <CModalHeader id="form-dialog-title">
        Report Details
      </CModalHeader>
      <CModalBody>

        <CContainer>
          <CRow>
            <CCol sm={12} className="px-2">
              <InputFieldGroup
                name="posterName"
                label="Poster Name"
                value={row.posterName}
                onChange={onChange}
                className='mb-3'
                type="text"
              />
            </CCol>
            <CCol sm={12} className="px-2">
              <InputFieldGroup
                name="posterEmail"
                label="Poster Email"
                value={row.posterEmail}
                onChange={onChange}
                className='mb-3'
                type="text"
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol sm={12} className="px-2">
              <TextFieldGroup
                name="posterMessage"
                label="Report description"
                value={row.posterMessage}
                onChange={onChange}
                rows="6"
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol sm={12} className="px-2">

              <RadioFieldGroup
                type="radio"
                name="reportApproved"
                value={true}
                label="Approved"
                onChange={onChange}
                defaultChecked={row.reportApproved ? true : false}
              />
              <RadioFieldGroup
                type="radio"
                name="reportApproved"
                value={false}
                label="Unapproved"
                onChange={onChange}
                defaultChecked={!row.reportApproved ? true : false}
              />
            </CCol>
          </CRow>
        </CContainer>
      </CModalBody>
      <CModalFooter>
        <CButton onClick={onCancelChanges} color="secondary">
          Cancel
        </CButton>
        {' '}
        <CButton onClick={onApplyChanges} color="primary">
          Save
        </CButton>
      </CModalFooter>
    </CModal>
  );

}

const PopupEditing = React.memo(({ popupComponent: Popup }) => (
  <Plugin>
    <Template name="popupEditing">

      <TemplateConnector>
        {(
          {
            rows,
            getRowId,

            editingRowIds,
            createRowChange,
            rowChanges,
          },
          {
            changeRow, commitChangedRows,
            stopEditRows, cancelChangedRows,
          },
        ) => {

          let editedRow;
          let rowId;

          [rowId] = editingRowIds;
          const targetRow = rows.filter(row => getRowId(row) === rowId)[0];
          editedRow = { ...targetRow, ...rowChanges[rowId] };


          const processValueChange = ({ target: { name, value } }) => {
            const changeArgs = {
              rowId,
              change: createRowChange(editedRow, value, name),
            };
            changeRow(changeArgs);
          };
          const rowIds = editingRowIds;
          const applyChanges = () => {
            stopEditRows({ rowIds });
            commitChangedRows({ rowIds });

          };
          const cancelChanges = () => {
            stopEditRows({ rowIds });
            cancelChangedRows({ rowIds });
          };

          const open = editingRowIds.length > 0;
          return (
            <Popup
              open={open}
              row={editedRow}
              onChange={processValueChange}
              onApplyChanges={applyChanges}
              onCancelChanges={cancelChanges}
            />
          );
        }}
      </TemplateConnector>
    </Template>
    <Template name="root">
      <TemplatePlaceholder />
      <TemplatePlaceholder name="popupEditing" />
    </Template>
  </Plugin>
));


const PersonalReports = ({ user }) => {

  const [rows, setRows] = useState([]);
  const getRowId = row => row.id;

  const [filteringStateColumnExtensions, setFilteringStateColumnExtensions] = useState(false);
  const [editingRowIds, getEditingRowIds] = useState([]);
  const [addedRows, setAddedRows] = useState([]);
  const [rowChanges, setRowChanges] = useState({});
  const [isSubmited, setIsSubmited] = useState(false);
  const [cancelledDelete, setCancelledDelete] = useState(false);

  const TableComponent = ({ ...restProps }) => <Table.Table {...restProps} className="table-striped table-sticky fixed-header" />;
  const [columns] = useState([
    { name: 'waterbodyName', title: 'Waterbody', width: 250, wordWrapEnabled: true, align: 'center' },
    { name: 'reportDate', title: 'Report Date', width: 50, wordWrapEnabled: true, align: 'center' },
    { name: 'posterMessage', title: 'Report excerpt', width: 350, wordWrapEnabled: false, align: 'center' },
    { name: 'reportApproved', title: 'Report status', wordWrapEnabled: true, width: 250, align: 'center' },
    { name: 'provinceName', title: 'Province', width: 250, wordWrapEnabled: true, align: 'center' },
    { name: 'regionName', title: 'Region', width: 250, wordWrapEnabled: true, align: 'center' },

  ]);

  //report status
  const reportApprovedFormatter = ({ value, row }) => (
    <CBadge shape="rounded-pill" className='table-badge' color={value === true ? 'secondary' : 'danger'}>{value === true ? 'Approved' : 'Unapproved'}</CBadge>
  );

  const ReportApprovedTypeProvider = (props) => <DataTypeProvider formatterComponent={reportApprovedFormatter} {...props} />;

  const [reportColumns] = useState(['reportApproved']);


  const changeAddedRows = value => setAddedRows(
    value.map(row => (Object.keys(row).length ? row : '')),
  );

  const deleteRows = (deletedIds) => {
    const rowsForDelete = rows.slice();
    deletedIds.forEach((rowId) => {
      const index = rowsForDelete.findIndex(row => row.id === rowId);
      if (index > -1) {
        rowsForDelete.splice(index, 1);
      }
    });
    return rowsForDelete;
  };

  const commitChanges = ({ changed, deleted }) => {
    let changedRows;

    if (changed) {

      changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));

      const report_id = Object.keys(changed)[0];
      const changed_report = changedRows.find(row => row.id == report_id);
      const personalReport = {
        poster_name: changed_report.posterName,
        poster_email: changed_report.posterEmail,
        poster_message: changed_report.posterMessage,
        report_approved: str2bool(changed_report.reportApproved),
      }
      //make a request
      apiClient
        .put(`/personal_reports/${report_id}`, personalReport)
        .then((response) => {
          console.log(response.status);
          console.log(response.data);
        })

      // success message
      setIsSubmited(true);

      setTimeout(() => {
        setIsSubmited(false);
      }, 4000)
    }

    if (deleted) {
      const report_id_delete = deleted[0];
      if (window.confirm('Are you sure you want to delete this report?')) {
        apiClient
          .delete(`/personal_reports/${report_id_delete}`)
          .then((response) => {
            console.log(response.status);
            console.log(response.data);
          })
        changedRows = deleteRows(deleted);
        setRows(changedRows);
      } else {
        setCancelledDelete(true);
      }
    } else {
      setCancelledDelete(true);
    }
    setRows(changedRows);
  };

  const getTableData = () => {

    apiClient
      .get(`/personal_reports`)
      .then((response) => {
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
  }, [rowChanges]);

  useEffect(() => {
    getTableData();

    return () => {
      setCancelledDelete(false);
    }
  }, [cancelledDelete])

  { console.log(rows) }

  return (
    <CContainer fluid>
      <CRow md={{ gutter: 0 }}>
        <SidebarNavigation user={user} />
        <CCol style={{ paddingLeft: 0 }}>
          <div className='dashboard-wrapp'>

            <CContainer fluid>
              <CRow>
                <CCol>
                  <CCard className='mb-4'>
                    <CCardHeader className='card-header__darkblue'>Personal reports</CCardHeader>
                    <CCardBody className='dashboard-table'>
                      {isSubmited && (<CToast autohide={false} visible={true} color="primary" className='text-white align-items-center'>
                        <CToastBody>Personal report updated.</CToastBody>
                      </CToast>)}

                      {rows && columns && (
                        <>

                          <Grid rows={rows} columns={columns} getRowId={getRowId}>
                            <SearchState />

                            <IntegratedFiltering columnExtensions={filteringStateColumnExtensions} />
                            <VirtualTable height="auto" />

                            <PagingState
                              defaultCurrentPage={0}
                              pageSize={10}
                            />
                            <IntegratedPaging />
                            <EditingState
                              onCommitChanges={commitChanges}
                              editingRowIds={editingRowIds}
                              onEditingRowIdsChange={getEditingRowIds}
                              rowChanges={rowChanges}
                              onRowChangesChange={setRowChanges}
                              addedRows={addedRows}
                              onAddedRowsChange={changeAddedRows}
                            />
                            <Table tableComponent={TableComponent} />
                            <ReportApprovedTypeProvider for={reportColumns} />
                            <TableHeaderRow className="table-sticky" />

                            <TableEditColumn
                              showEditCommand
                              showDeleteCommand
                            />
                            <PagingPanel />
                            <Toolbar />
                            <SearchPanel />
                            <PopupEditing popupComponent={Popup} />
                          </Grid>

                        </>

                      )}

                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CContainer>
          </div>
        </CCol>
      </CRow>

    </CContainer>
  )
}

export default PersonalReports