import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CContainer, CRow, CSpinner, CFormInput, CFormLabel, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CFormCheck, CToast, CToastHeader, CToastBody, CModalTitle, CFormSelect } from '@coreui/react';

import {
  Plugin, Template, TemplateConnector, TemplatePlaceholder,
} from '@devexpress/dx-react-core';

import { EditingState } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, VirtualTable, Toolbar, SearchPanel, PagingPanel, TableFixedColumns, TableColumnResizing, TableEditColumn } from '@devexpress/dx-react-grid-bootstrap4';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';
import apiClient from '../../helpers/api';
import { useGlobalContext } from '../../context';
import SidebarNavigation from '../../pages/Admin/SidebarNavigation';
import { BsStackOverflow } from 'react-icons/bs';


function InputFieldGroup({ id, label, ...props }) {
  return (
    <>
      <CFormLabel htmlFor={label}>{label}</CFormLabel>
      <CFormInput {...props} />
    </>
  );
}

const ProvinceWeeklyReportTable = ({ user, rows, setRows, columns, waterBodyName, waterBodyRegion, waterBodyProvince, waterBodyProvinceID, getWaterbodyTableData }) => {

  const [leftColumns] = useState(['report_date']);

  const TableComponent = ({ ...restProps }) => <Table.Table {...restProps} className="table-striped table-sticky fixed-header" />;
  const [tableColumnExtensions] = useState([

    { columnName: 'report_date', width: 150, wordWrapEnabled: true, align: 'center' },
    { columnName: 'column_value_1', width: 160, wordWrapEnabled: true, align: 'center' },
    { columnName: 'column_value_2', width: 160, align: 'center' },
    { columnName: 'column_value_3', width: 160, align: 'center' },
    { columnName: 'column_value_4', width: 160, align: 'center' },
    { columnName: 'column_value_5', width: 160, align: 'center' },
    { columnName: 'column_value_6', width: 160, align: 'center' },
    { columnName: 'column_value_7', width: 160, align: 'center' },
    { columnName: 'column_value_8', width: 160, wordWrapEnabled: true, align: 'center' },
    { columnName: 'column_value_9', width: 160, align: 'center' },
    { columnName: 'column_value_10', width: 160, align: 'center' },
    { columnName: 'column_value_11', width: 160, align: 'center' },
    { columnName: 'column_value_12', width: 160, align: 'center' },
  ]);

  const [defaultColumnWidths] = useState([
    { columnName: 'report_date', width: 160 },
    { columnName: 'column_value_1', width: 180 },
    { columnName: 'column_value_2', width: 100 },
    { columnName: 'column_value_3', width: 140 },
    { columnName: 'column_value_4', width: 120 },
    { columnName: 'column_value_5', width: 120 },
    { columnName: 'column_value_6', width: 120 },
    { columnName: 'column_value_7', width: 120 },
    { columnName: 'column_value_8', width: 120 },
    { columnName: 'column_value_9', width: 120 },
    { columnName: 'column_value_10', width: 120 },
    { columnName: 'column_value_11', width: 120 },
    { columnName: 'column_value_12', width: 120 },
  ]);


  const { waterbodyId } = useParams();
  const [addedRows, setAddedRows] = useState([]);
  const [isSubmited, setIsSubmited] = useState(false);
  const [cancelledDelete, setCancelledDelete] = useState(false);

  const [waterBodyColumns] = useState(['reportDate']);

  const HighlightedCell = ({ value, style, ...restProps }) => (
    <Table.Cell
      {...restProps}
      style={{
        backgroundColor: 'white',
        borderRight: '1px solid #dee2e6',
        ...style,
      }}
    ></Table.Cell>
  );

  const Cell = (props) => {
    const { column } = props;
    return <VirtualTable.Cell {...props} />;
  };

  const waterBodyCell = (props) => {
    const { column } = props;
    if (column.name === 'reportDate') {
      return <HighlightedCell {...props} />;
    }
    return <Table.Cell {...props} />;
  };

  // editing reports

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

  const commitChanges = ({ added, changed, deleted }) => {
    let changedRows;

    if (added) {
      const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
      changedRows = [
        ...rows,
        ...added.map((row, index) => ({
          id: startingAddedId + index,
          ...row,
        })),
      ];

      const weeklyReport = {
        waterbody_id: waterbodyId,
        report_date: new Date(added[0].report_date).toISOString().split('T')[0],
        column_value_1: added[0].column_value_1,
        column_value_2: added[0].column_value_2,
        column_value_3: added[0].column_value_3,
        column_value_4: added[0].column_value_4,
        column_value_5: added[0].column_value_5,
        column_value_6: added[0].column_value_6,
        column_value_7: added[0].column_value_7,
        column_value_8: added[0].column_value_8,
        column_value_9: added[0].column_value_9,
        column_value_10: added[0].column_value_10,
        column_value_11: added[0].column_value_11,
        column_value_12: added[0].column_value_12,
      }
      //make a request
      apiClient
        .post(`/admin/waterbodies/${waterbodyId}/reports`, weeklyReport)
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

    if (changed) {

      changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));

      const report_id = Object.keys(changed)[0];
      const changed_report = changedRows.find(row => row.id == report_id);
      const weeklyReportUpdate = {
        report_date: new Date(changed_report.report_date).toISOString().split('T')[0],
        column_value_1: changed_report.column_value_1,
        column_value_2: changed_report.column_value_2,
        column_value_3: changed_report.column_value_3,
        column_value_4: changed_report.column_value_4,
        column_value_5: changed_report.column_value_5,
        column_value_6: changed_report.column_value_6,
        column_value_7: changed_report.column_value_7,
        column_value_8: changed_report.column_value_8,
        column_value_9: changed_report.column_value_9,
        column_value_10: changed_report.column_value_10,
        column_value_11: changed_report.column_value_11,
        column_value_12: changed_report.column_value_12,
      }
      //make a request
      apiClient
        .put(`/report/${report_id}`, weeklyReportUpdate)
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
          .delete(`/report/${report_id_delete}`)
          .then((response) => {
            console.log(response.status);
            console.log(response.data);
          })
        changedRows = deleteRows(deleted);
        setRows(changedRows);
        // success message
        setIsSubmited(true);

        setTimeout(() => {
          setIsSubmited(false);
        }, 4000)
      } else {
        setCancelledDelete(true);
      }
    } else {
      setCancelledDelete(true);
    }
    setRows(changedRows);
  };

  const Popup = ({ row, onChange, onApplyChanges, onCancelChanges, open }) => {
    const report_columns =
      columns.filter((item) => {
        return item.name !== 'waterbodyName' && item.name !== "regionName" && item.name !== "report_date"
      })
    return (
      <CModal size='lg' visible={open} onClose={onCancelChanges} aria-labelledby="form-dialog-title">
        <CModalHeader id="form-dialog-title">
          Report Details
        </CModalHeader>
        <CModalBody>

          <div className="d-flex justify-content-center mb-4">
            <div className="reportTable__legend d-flex justify-content-around">
              <span>Legend: </span>
              <div className="reportTable__legend-item">S = Slow</div>
              <div className="reportTable__legend-item">F = Fair</div>
              <div className="reportTable__legend-item">G = Good</div>
            </div>
          </div>
          <CContainer>
            <CRow>
              <CCol sm={7} className="px-2">
                <InputFieldGroup
                  name="waterbodyName"
                  label="Waterbody Name"
                  onChange={onChange}
                  value={waterBodyName}
                  className='mb-3'
                  type="text"
                  disabled
                />
              </CCol>
              <CCol sm={5} className="px-2">
                <InputFieldGroup
                  name="report_date"
                  label="Report Date"
                  onChange={onChange}
                  className='mb-3'
                  type="date"
                  value={row.report_date}
                />
              </CCol>
            </CRow>

            <CRow>
              {report_columns.map((item, index) => {
                return <CCol sm={4} className="px-2" key={index}>
                  <InputFieldGroup
                    name={item.name}
                    label={item.title}
                    value={row[item.name]}
                    onChange={onChange}
                    className='mb-3'
                    type="text"
                  />
                </CCol>
              })}
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
              addedRows,
              editingRowIds,
              createRowChange,
              rowChanges,
            },
            {
              changeRow, changeAddedRow, commitChangedRows, commitAddedRows,
              stopEditRows, cancelAddedRows, cancelChangedRows,
            },
          ) => {
            const isNew = addedRows.length > 0;
            let editedRow;
            let rowId;
            if (isNew) {
              rowId = 0;
              editedRow = addedRows[rowId];
            } else {
              [rowId] = editingRowIds;
              const targetRow = rows.filter(row => getRowId(row) === rowId)[0];
              editedRow = { ...targetRow, ...rowChanges[rowId] };
            }

            const processValueChange = ({ target: { name, value } }) => {
              const changeArgs = {
                rowId,
                change: createRowChange(editedRow, value, name),
              };
              if (isNew) {
                changeAddedRow(changeArgs);
              } else {
                changeRow(changeArgs);
              }
            };
            const rowIds = isNew ? [0] : editingRowIds;
            const applyChanges = () => {
              if (isNew) {
                commitAddedRows({ rowIds });
              } else {
                stopEditRows({ rowIds });
                commitChangedRows({ rowIds });
              }
            };
            const cancelChanges = () => {
              if (isNew) {
                cancelAddedRows({ rowIds });
              } else {
                stopEditRows({ rowIds });
                cancelChangedRows({ rowIds });
              }
            };

            const open = editingRowIds.length > 0 || isNew;
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

  const getRowId = row => row.id;

  if (rows && columns) {
    return (
      <>
        <h4 className="text-center text-uppercase">{waterBodyName ? waterBodyName : 'No report for this waterbody'} </h4>
        {waterBodyRegion && (
          <h5 className="text-center">
            {waterBodyRegion}, {waterBodyProvince} fishing report
          </h5>

        )}

        {isSubmited && (<CToast autohide={false} visible={true} color="primary" className='text-white align-items-center'>
          <CToastBody>Weekly report updated.</CToastBody>
        </CToast>)}

        <div className="d-flex justify-content-center">
          <div className="reportTable__legend d-flex justify-content-around">
            <span>Legend: </span>
            <div className="reportTable__legend-item">S = Slow</div>
            <div className="reportTable__legend-item">F = Fair</div>
            <div className="reportTable__legend-item">G = Good</div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center">
            <div className='waterbody-single__abs-btn'>
              <Link className='btn btn-secondary' to={`/dashboard/province_weekly_report/${waterBodyProvinceID}`}>
                Back to waterbodies
              </Link>
            </div>

            <div className="reportTable_info"></div>
          </div>
          <div className="reportTable__grid">
            <Grid rows={rows} columns={columns} getRowId={getRowId}>
              <VirtualTable columnExtensions={tableColumnExtensions} cellComponent={Cell} />
              <VirtualTable height="auto" />
              <EditingState
                onCommitChanges={commitChanges}

              />
              <Table tableComponent={TableComponent} columnExtensions={tableColumnExtensions} cellComponent={waterBodyCell} />
              <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
              <TableHeaderRow className="table-sticky" />

              <TableEditColumn
                showEditCommand
                showDeleteCommand
                showAddCommand
              />
              <TableFixedColumns leftColumns={leftColumns} />
              <Toolbar />
              <PopupEditing popupComponent={Popup} />
            </Grid>
          </div>

        </div>
      </>
    );

  }

};

export default ProvinceWeeklyReportTable;


