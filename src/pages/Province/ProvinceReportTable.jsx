import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CButton } from '@coreui/react';
import { DataTypeProvider, IntegratedFiltering, SearchState, SortingState, IntegratedSorting } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, VirtualTable, Toolbar, SearchPanel, PagingPanel, TableFixedColumns, TableColumnResizing } from '@devexpress/dx-react-grid-bootstrap4';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';
import apiClient from '../../helpers/api';
import ProvinceUnlistedWaterbodyCreate from './ProvinceUnlistedWaterbodyCreate';

const ProvinceReportTable = () => {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [regions, setRegions] = useState([]);
  const [provinceName, setProvinceName] = useState('');
  const [filteringStateColumnExtensions, setFilteringStateColumnExtensions] = useState(false);
  const [sorting, setSorting] = useState([{ columnName: 'waterbodyName', direction: 'asc' }]);
  const [leftColumns] = useState(['waterbodyName']);
  // modal state
  const [visibleLg, setVisibleLg] = useState(false);

  const TableComponent = ({ ...restProps }) => <Table.Table {...restProps} className="table-striped table-sticky fixed-header" />;
  const [tableColumnExtensions] = useState([

    { columnName: 'waterbodyName', wordWrapEnabled: true, align: 'center' },
    { columnName: 'regionName', wordWrapEnabled: true, align: 'left' },
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
    { columnName: 'waterbodyName', width: 180 },
    { columnName: 'regionName', width: 180 },
    { columnName: 'column_value_1', width: 150 },
    { columnName: 'column_value_2', width: 100 },
    { columnName: 'column_value_3', width: 140 },
    { columnName: 'column_value_4', width: 120 },
    { columnName: 'column_value_5', width: 120 },
    { columnName: 'column_value_6', width: 120 },
    { columnName: 'column_value_7', width: 120 },
    { columnName: 'column_value_8', width: 160 },
    { columnName: 'column_value_9', width: 120 },
    { columnName: 'column_value_10', width: 120 },
    { columnName: 'column_value_11', width: 120 },
    { columnName: 'column_value_12', width: 120 },
  ]);

  /*Waterbody link to single body of water*/
  const waterBodyFormatter = ({ value, row }) => (
    <Link className="reportTable_link" to={`/waterbodies/${row.waterbody_id}`}>
      {value}
    </Link>
  );


  const WaterBodyTypeProvider = (props) => <DataTypeProvider formatterComponent={waterBodyFormatter} {...props} />;
  const [waterBodyColumns] = useState(['waterbodyName']);

  /*waterbody cell styling*/

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
    if (column.name === 'waterbodyName') {
      return <HighlightedCell {...props} />;
    }
    return <Table.Cell {...props} />;
  };

  const { province_id } = useParams();

  const getTableData = () => {

    apiClient
      .get(`/provinces/${province_id}`)
      .then((response) => {
        const cols = response.data.data.columns;
        setRows(response.data.data.rows);
        setColumns(cols);
        setProvinceName(response.data.data.provinceName);
        setRegions(response.data.data.regions);
        setFilteringStateColumnExtensions(
          cols.map((col) => {
            return { columnName: col.name, filteringEnabled: false };
          })
        );
        console.log(response)
      })
      .catch((error) => console.error(error));

  };

  useEffect(() => {
    getTableData();
  }, []);

  return (
    <>
      <section id="reportTableData" className="reportTable">

        {rows && columns && (
          <>
            <div className="reportTable__wrapper">
              <h3 className="text-center text-uppercase">{provinceName} Fishing reports</h3>
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
                  <div className="reportTable_info">Click on the name of the waterbody for a detailed history and personal reports</div>
                  <div>
                    <CButton color="secondary" onClick={() => setVisibleLg(!visibleLg)}>
                      Add unlisted waterbody report
                    </CButton>
                    <ProvinceUnlistedWaterbodyCreate regions={regions} visibleLg={visibleLg} setVisibleLg={setVisibleLg} />
                  </div>
                </div>

                <div className="reportTable__grid">
                  <Grid rows={rows} columns={columns}>
                    <SearchState />

                    <SortingState sorting={sorting} onSortingChange={setSorting} />
                    <IntegratedSorting />
                    <IntegratedFiltering columnExtensions={filteringStateColumnExtensions} />
                    <VirtualTable columnExtensions={tableColumnExtensions} cellComponent={Cell} />
                    <VirtualTable height="auto" />
                    <WaterBodyTypeProvider for={waterBodyColumns} />
                    <Table tableComponent={TableComponent} columnExtensions={tableColumnExtensions} cellComponent={waterBodyCell} />
                    <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
                    <TableHeaderRow className="table-sticky" />
                    <TableFixedColumns leftColumns={leftColumns} />
                    {/*  <PagingPanel /> */}

                    <Toolbar />
                    <SearchPanel />
                  </Grid>
                </div>
              </div>
            </div>
          </>
        )}

      </section>

    </>
  );
};

export default ProvinceReportTable;
