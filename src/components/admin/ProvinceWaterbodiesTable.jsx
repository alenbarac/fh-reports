import React, { useEffect, useState } from 'react';
import { CCol, CContainer, CRow, CCard, CCardHeader, CCardBody, CBadge, CButton, CAlert, CForm, CFormInput, CFormLabel, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CFormCheck, CToast, CToastHeader, CToastBody, CModalTitle, CFormSelect } from '@coreui/react';

import {
  Plugin, Template, TemplateConnector, TemplatePlaceholder,
} from '@devexpress/dx-react-core';

import SidebarNavigation from '../../pages/Admin/SidebarNavigation';
import { DataTypeProvider, IntegratedFiltering, SearchState, SortingState, IntegratedSorting, PagingState, IntegratedPaging, EditingState } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, VirtualTable, Toolbar, SearchPanel, PagingPanel, TableEditColumn } from '@devexpress/dx-react-grid-bootstrap4';

import apiClient from '../../helpers/api';
import str2bool from '../../helpers/str2bool';
import FormAddAdminWaterbody from './FormAddAdminWaterbody';
import { useGlobalContext } from '../../context';
import DeleteConfirmation from './DeleteConfirmation';

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
  const { adminRegions } = useGlobalContext();
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
                name="waterbodyName"
                label="Waterbody Name"
                value={row.waterbodyName}
                onChange={onChange}
                className='mb-3'
                type="text"
              />
            </CCol>

          </CRow>
          <CRow>
            <CCol sm={6} className="px-2">
              <InputFieldGroup
                name="longitude"
                label="Waterbody longitude"
                value={row.longitude}
                onChange={onChange}

              />
            </CCol>
            <CCol sm={6} className="px-2">
              <InputFieldGroup
                name="latitude"
                label="Waterbody latitude"
                value={row.latitude}
                onChange={onChange}
                className='mb-3'
                type="text"
              />
            </CCol>
            <CRow className='align-items-center'>
              <CCol md={12}>
                <CFormSelect size="lg"
                  className='mb-3'
                  aria-label="Default select example"
                  onChange={onChange}
                  name="region_id"

                >
                  <option> --- Select waterbody region ---</option>

                  {adminRegions.map((region) => <option key={region.id} value={region.id} selected={region.id === row.regionId ? 'selected' : ''}>{region.region_name}</option>)}

                </CFormSelect>

              </CCol>
            </CRow>
          </CRow>
          <CRow>
            <CCol sm={12} className="px-2">

              <RadioFieldGroup
                type="radio"
                name="waterbodyUnlisted"
                value={false}
                label="Listed"
                onChange={onChange}

              />
              <RadioFieldGroup
                type="radio"
                name="waterbodyUnlisted"
                value={true}
                label="Unlisted"
                onChange={onChange}

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
    </CModal >
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

const ProvinceWaterbodiesTable = ({ provinceId }) => {

  const [rows, setRows] = useState([]);
  const getRowId = row => row.id;
  const [filteringStateColumnExtensions, setFilteringStateColumnExtensions] = useState(false);
  const [editingRowIds, getEditingRowIds] = useState([]);
  const [addedRows, setAddedRows] = useState([]);
  const [rowChanges, setRowChanges] = useState({});
  const [isSubmited, setIsSubmited] = useState(false);
  const [cancelledDelete, setCancelledDelete] = useState(false);

  const { adminProvinceCollection, loading } = useGlobalContext();

  const [visibleAddWaterbody, setVisibleAddWaterbody] = useState(false);

  const handleShowAddWaterbody = () => setVisibleAddWaterbody(true);
  const handleCloseAddWaterbody = () => setVisibleAddWaterbody(false);

  const TableComponent = ({ ...restProps }) => <Table.Table {...restProps} className="table-striped table-sticky fixed-header" />;
  const [columns] = useState([
    { name: 'waterbodyName', title: 'Waterbody', width: 250, wordWrapEnabled: true, align: 'center' },
    { name: 'latitude', title: 'Latitude', width: 50, wordWrapEnabled: true, align: 'center' },
    { name: 'longitude', title: 'Longitude', width: 350, wordWrapEnabled: false, align: 'center' },
    { name: 'regionName', title: 'Region', width: 250, wordWrapEnabled: true, align: 'center' },
    { name: 'waterbodyUnlisted', title: 'Status', wordWrapEnabled: true, width: 250, align: 'center' },

  ]);

  //report status
  const waterbodyUnlistedFormatter = ({ value, row }) => (
    <CBadge shape="rounded-pill" className='table-badge' color={value == false ? 'secondary' : 'danger'}>{value == false ? 'Listed' : 'Unlisted'}</CBadge>

  );

  const WaterbodyUnlistedTypeProvider = (props) => <DataTypeProvider formatterComponent={waterbodyUnlistedFormatter} {...props} />;

  const [unlistedColumns] = useState(['waterbodyUnlisted']);


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

      const waterbody_id = Object.keys(changed)[0];
      const changed_waterbody = changedRows.find(row => row.id == waterbody_id);
      const newWaterbody = {
        waterbody_name: changed_waterbody.waterbodyName,
        latitude: changed_waterbody.latitude,
        longitude: changed_waterbody.longitude,
        region_id: isNaN(parseInt(changed_waterbody.region_id)) ? changed_waterbody.regionId : parseInt(changed_waterbody.region_id),
        waterbody_unlisted: str2bool(changed_waterbody.waterbodyUnlisted),
      }
      //make a request
      apiClient
        .put(`/admin/waterbodies/${waterbody_id}`, newWaterbody)
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
      const waterbody_id_delete = deleted[0];
      console.log(waterbody_id_delete);
      if (window.confirm('Are you sure you want to delete this waterbody?')) {
        apiClient
          .delete(`/waterbodies/${waterbody_id_delete}`)
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

  const getTableData = async () => {

    await apiClient
      .get(`/admin/provinces/${provinceId}/waterbodies`)
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
  }, [cancelledDelete]);

  if (loading) {
    return (<div className="spinner-container"><CSpinner /></div>)

  } else

    return (
      <>
        <CCard className='mb-4'>
          <CCardHeader className='card-header__darkblue'><div className="d-flex align-items-center justify-content-between"><div> {adminProvinceCollection?.provinceName} Province Waterbodies</div>  <CButton onClick={handleShowAddWaterbody} className="provinceList__item-btn" color="secondary" size="lg" shape="rounded-0">
            Add Waterbody
          </CButton></div></CCardHeader>
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
                  <WaterbodyUnlistedTypeProvider for={unlistedColumns} />
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

        <CModal alignment="center" size="lg" visible={visibleAddWaterbody} onClose={() => handleCloseAddWaterbody}>
          <CModalHeader>
            <CModalTitle>Add Waterbody</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <FormAddAdminWaterbody setVisibleAddWaterbody={setVisibleAddWaterbody} provinceId={provinceId} />
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

export default ProvinceWaterbodiesTable