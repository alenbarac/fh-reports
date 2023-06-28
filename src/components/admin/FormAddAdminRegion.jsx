import React from 'react'
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { CAlert, CButton, CCol, CContainer, CForm, CFormCheck, CFormInput, CFormLabel, CFormSelect, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CSpinner } from '@coreui/react'

import apiClient from '../../helpers/api';
import { useGlobalContext } from '../../context';
import str2bool from '../../helpers/str2bool';


const FormAddAdminRegion = ({ setVisibleAddRegion }) => {

  const [isSubmitted, setIsSubmitted] = useState(false);

  const { loading, showMessage, setShowMessage, adminProvinceCollection, adminRegions, addRegion, setRegionAdded } = useGlobalContext();
  const { register, formState: { errors }, reset, handleSubmit } = useForm();

  const [newRegion, setNewRegion] = useState({
    province_id: adminProvinceCollection.id, region_name: ""
  });


  const onInputChange = (e) => {
    setNewRegion({ ...newRegion, province_id: province_id, [e.target.name]: e.target.value })
  }

  const { province_id, region_name } = newRegion;

  const addNewRegionApi = async () => {
    await apiClient
      .post(`/provinces/${province_id}/regions`, newRegion)
      .then((response) => {
        console.log(response.status);
        console.log(response.data);
      })
  }

  const onSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    addRegion(province_id, region_name);
    addNewRegionApi()
    setRegionAdded(true)
    reset();
    setRegionAdded(false)
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
              Region Name
            </CFormLabel>
            <CFormInput
              className='mb-3'
              type="text"
              name="region_name"
              value={region_name}
              onChange={(e) => onInputChange(e)}
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

export default FormAddAdminRegion