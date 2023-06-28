import React, { useEffect, useState, useRef } from 'react';
import { useMediaQuery } from '@react-hook/media-query';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { CButton, CContainer, CRow, CCol, CCard, CCardBody, CCardHeader, CCardTitle, CCardText, CSpinner } from '@coreui/react';
import { Grid, Table, TableHeaderRow, VirtualTable, Toolbar, TableFixedColumns, TableColumnResizing } from '@devexpress/dx-react-grid-bootstrap4';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';
import apiClient from '../../helpers/api';
import removeTags from '../../helpers/removeTags';

import WaterbodyPersonalReportCreate from './WaterbodyPersonalReportCreate';
import { useGlobalContext } from '../../context';


const WaterbodyReportTable = () => {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const { loading, setLoading } = useGlobalContext();
  const [waterBodyName, setWaterbodyName] = useState('');
  const [waterBodyRegion, setWaterbodyRegion] = useState('');
  const [waterBodyProvince, setWaterbodyProvince] = useState('');
  const [waterBodyProvinceID, setWaterbodyProvinceID] = useState(null);
  const [waterbodyPersonalReports, setWaterBodyPersonalReports] = useState([]);
  const [leftColumns] = useState(['reportDate']);

  const ref = useRef(null);
  const mobileView = useMediaQuery('only screen and (max-width: 576px)')

  const handleMobileScrollLink = () => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const TableComponent = ({ ...restProps }) => <Table.Table {...restProps} className="table-striped table-sticky fixed-header" />;
  const [tableColumnExtensions] = useState([

    { columnName: 'report_date', wordWrapEnabled: true, align: 'center' },
    { columnName: 'column_value_1', wordWrapEnabled: true, align: 'center' },
    { columnName: 'column_value_2', align: 'center' },
    { columnName: 'column_value_3', align: 'center' },
    { columnName: 'column_value_4', align: 'center' },
    { columnName: 'column_value_5', align: 'center' },
    { columnName: 'column_value_6', align: 'center' },
    { columnName: 'column_value_7', align: 'center' },
    { columnName: 'column_value_8', wordWrapEnabled: true, align: 'center' },
    { columnName: 'column_value_9', align: 'center' },
    { columnName: 'column_value_10', align: 'center' },
    { columnName: 'column_value_11', align: 'center' },
    { columnName: 'column_value_12', align: 'center' },
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

  /*Waterbody link to single body of water*/


  const [waterBodyColumns] = useState(['report_date']);

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

  const { waterbody_id } = useParams();

  const getWaterbodyTableData = () => {
    setLoading(true)
    apiClient
      .get(`/waterbodies/${waterbody_id}`)
      .then((response) => {
        const cols = response.data.data.columns;
        setRows(response.data.data.rows);
        setColumns(cols);
        setWaterbodyName(response.data.data.waterbodyName);
        setWaterbodyRegion(response.data.data.regionName);
        setWaterbodyProvince(response.data.data.provinceName);
        setWaterbodyProvinceID(response.data.data.provinceID);
        setWaterBodyPersonalReports(response.data.data.personalReports);
      })

      .catch((error) => console.error(error));
    setLoading(false)
  };

  useEffect(() => {
    getWaterbodyTableData();

  }, []);



  { loading && <div className="spinner-container"><CSpinner /></div> }

  if (rows && columns && waterBodyRegion) {

    return (
      <>
        <section id="reportTableData" className="reportTable">

          <div className="reportTable__wrapper">
            <h3 className="text-center text-uppercase">{waterBodyName ? waterBodyName : 'No report for this waterbody'} </h3>
            {waterBodyRegion && (
              <h4 className="text-center">
                {waterBodyRegion}, {waterBodyProvince} fishing report
              </h4>

            )}

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
                <div className='waterbody-single__btn'>
                  <Link className='btn btn-secondary' to='/'>
                    Back to Map
                  </Link>
                </div>
                <div className="reportTable_info"></div>
              </div>
              <div className="reportTable__grid">
                <Grid rows={rows} columns={columns}>
                  <VirtualTable columnExtensions={tableColumnExtensions} cellComponent={Cell} />
                  <VirtualTable height="auto" />
                  <Table tableComponent={TableComponent} columnExtensions={tableColumnExtensions} cellComponent={waterBodyCell} />
                  <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
                  <TableHeaderRow className="table-sticky" />
                  <TableFixedColumns leftColumns={leftColumns} />
                  <Toolbar />
                </Grid>
              </div>
            </div>
          </div>
        </section>

        {waterbodyPersonalReports.length > 0 ? (

          <section className="waterbody-single__personal-reports">
            <CContainer>
              <h4 className="text-center waterbody-single__personal-reports__heading text-uppercase">
                Reports from this Year
              </h4>
              {mobileView ? <div className='waterbody-single__btn waterbody-single__btn--mobile'>
                <button className='btn btn-secondary' onClick={() => {
                  handleMobileScrollLink()
                }}>
                  Add personal report
                </button>
              </div> : ''}
              <CRow>

                <CCol md={7}>
                  <div className="waterbody-single__personal-report__list styled-scrollbars">
                    {waterbodyPersonalReports.map(personalReport => {
                      return (
                        <div className="waterbody-single__personal-report__list-item" key={personalReport.id}>
                          <CCard className='waterbody-single__personal-report__card'>
                            <CCardHeader>
                              <div className='d-flex align-items-center justify-content-between'>
                                <div>Report from: {personalReport.poster_name}</div>
                                <div>
                                  <span className='waterbody-single__personal-report__card-date'>{personalReport.report_date}</span>
                                </div>
                              </div>

                            </CCardHeader>
                            <CCardBody>

                              <hr />
                              <CCardText>
                                {removeTags(personalReport.poster_message)}
                              </CCardText>
                            </CCardBody>
                          </CCard>
                        </div>
                      )
                    })}
                  </div>

                </CCol>
                <CCol md={5} ref={ref}>
                  <WaterbodyPersonalReportCreate />
                </CCol>
              </CRow>
            </CContainer>

          </section>
        ) : (
          <>

            <section className="waterbody-single__personal-reports">
              <CContainer>
                <WaterbodyPersonalReportCreate />
              </CContainer>
            </section>
          </>
        )}

      </>
    );

  } else {
    return (
      <div className="spinner-container"><CSpinner /></div>
    )
  }


};

export default WaterbodyReportTable;
