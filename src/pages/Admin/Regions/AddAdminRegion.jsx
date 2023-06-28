import React from 'react'
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { CAlert, CButton, CCol, CContainer, CForm, CFormCheck, CFormInput, CFormLabel, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CSpinner } from '@coreui/react'

import apiClient from '../../../helpers/api';
import { useGlobalContext } from '../../../context';
import str2bool from '../../../helpers/str2bool';


const AddAdminRegion = ({ visibleRegionModal, setVisibleRegionModal, provinceId, regions, setAdminRegions }) => {

  const [isSubmitted, setIsSubmitted] = useState(false);

  const { loading, provinceUpdated, setProvinceUpdated, showMessage, setShowMessage } = useGlobalContext();
  const { register, formState: { errors }, reset, handleSubmit } = useForm();


  const onSubmit = data => {

    const newRegion = {
      province_id: Number(provinceId),
      region_name: data.regionName
    }


    apiClient
      .post(`/provinces/${provinceId}/regions`, newRegion)
      .then((response) => {
        console.log(response.status);
        console.log(response.data);
      })
    setIsSubmitted(true);
    /* setProvinceUpdated(true); */
    setAdminRegions([...regions, newRegion]);
    setShowMessage(true);

    reset();
    setVisibleRegionModal(false);
  }

  if (loading) {

    return (
      <CContainer fluid>
        <CRow md={{ gutter: 0 }}>
          <CSpinner />
        </CRow>
      </CContainer>
    )

  } else
    return (

      <>
        <CModal alignment="center" size="lg" visible={visibleRegionModal} onClose={() => setVisibleRegionModal(false)}>
          <CModalHeader>
            <CModalTitle>Add New Region</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm
              className="row g-3 needs-validation"
              onSubmit={handleSubmit(onSubmit)}
            >
              <CContainer>
                <CRow className='align-items-center'>
                  <CCol md={12}>
                    <CFormLabel htmlFor="provinceName" >
                      Region name
                    </CFormLabel>
                    <CFormInput
                      className='mb-3'
                      type="text"
                      id="provinceName"
                      {...register("regionName", { required: true })}
                    />
                    <span className='form-field-validation'>{errors.regionName?.type === 'required' && "Region name is required"}</span>

                  </CCol>
                </CRow>
              </CContainer>
              <CCol xs={12}>
                <CButton color="primary" type="submit" className='mt-4'>
                  Save changes
                </CButton>
              </CCol>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisibleRegionModal(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
      </>
    )
}

export default AddAdminRegion