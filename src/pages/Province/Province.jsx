import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { CRow, CContainer } from '@coreui/react';
import ProvinceReportTable from './ProvinceReportTable';

function Province() {

  return (
    <div className="waterbody-single">
      <ProvinceReportTable />
    </div>

  )
}

export default Province