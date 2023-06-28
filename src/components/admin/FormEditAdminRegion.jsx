import React from 'react'
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { CAlert, CButton, CCol, CContainer, CForm, CFormCheck, CFormInput, CFormLabel, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CSpinner } from '@coreui/react'

import apiClient from '../../helpers/api';
import { useGlobalContext } from '../../context';

const FormEditAdminRegion = ({ region }) => {

  const [isSubmitted, setIsSubmitted] = useState(false);
  const { loading, showMessage, setShowMessage, adminProvinceCollection, adminRegions, updateRegion, regionUpdated, setRegionUpdated } = useGlobalContext();
  const { register, formState: { errors }, reset, handleSubmit } = useForm();

  const id = region.id;
  const province_id = adminProvinceCollection.id;
  const [regionName, setRegionName] = useState(region.region_name);

  const editedRegion = { province_id, region_name: regionName };

  const updateRegionApi = async () => {
    apiClient
      .put(`/regions/${id}`, editedRegion)
      .then((response) => {
        console.log(response.status);
        console.log(response.data);
      })
  }
  const onSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    updateRegion(id, editedRegion);
    updateRegionApi();
    setRegionUpdated(true);
    reset();
    setRegionUpdated(false);
  }

  return (
    <CForm
      className="row g-3 needs-validation"
      onSubmit={onSubmit}
    >
      <CContainer>
        <CRow className='align-items-center'>
          <CCol md={12}>
            <CFormLabel htmlFor="regionName" >
              Region name
            </CFormLabel>
            <CFormInput
              className='mb-3'
              type="text"
              value={regionName}
              onChange={(e) => setRegionName(e.target.value)}
              required
            />
          </CCol>
        </CRow>
      </CContainer>
      <CCol xs={12}>
        <CButton color="primary" type="submit" className='mt-4'>
          Save changes
        </CButton>
      </CCol>
    </CForm>
  )
}

export default FormEditAdminRegion