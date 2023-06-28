import { useState, useEffect } from 'react';

import { CRow, CContainer, CCol, CCard, CCardBody, CCardTitle, CCardHeader, CCardText } from '@coreui/react';

import WaterbodyReportTable from './WaterbodyReportTable';

function Waterbody() {
  return (
    <div className="waterbody-single">
      <WaterbodyReportTable />
    </div>

  )
}

export default Waterbody