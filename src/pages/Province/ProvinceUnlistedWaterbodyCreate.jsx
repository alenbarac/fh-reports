import React from 'react'
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { CAlert, CButton, CCol, CForm, CFormInput, CFormLabel, CFormSelect, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'

import apiClient from '../../helpers/api';

const ProvinceUnlistedWaterbodyCreate = ({ regions, visibleLg, setVisibleLg }) => {
  const [regionSelect, setRegionSelect] = useState("Select waterbody Region");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, formState: { errors }, reset, handleSubmit } = useForm();

  const onSubmit = data => {
    const unlistedReport = {
      region_id: data.regionSelect,
      waterbody_name: data.waterbodyName,
      created_name: data.posterName,
      created_email: data.posterEmail,
      waterbody_report: data.posterMessage,
    }
    apiClient
      .post('/waterbodies', unlistedReport)
      .then((response) => {
        console.log(response.status);
        console.log(response.data);
      })

    setIsSubmitted(true);
    console.log(unlistedReport);
    reset();
  }

  return (
    <>
      <CModal alignment="center" size="lg" visible={visibleLg} onClose={() => setVisibleLg(false)}>
        <CModalHeader>
          <CModalTitle>Create Unlisted Waterbody Report</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {isSubmitted && (<CAlert
            color="success"
          >
            <strong>Thank you!</strong> After the approval unlisted waterbody will be added to the region.
          </CAlert>)}

          <CForm
            className="row g-3 needs-validation"
            onSubmit={handleSubmit(onSubmit)}
          >
            <CCol md={12}>
              <CFormLabel htmlFor="waterbodyName" >
                Unlisted Waterbody Name
              </CFormLabel>
              <CFormInput
                className='mb-3'
                type="text"
                id="waterbodyName"
                {...register("waterbodyName", { required: true })}
              />
              <span className='form-field-validation'>{errors.waterbodyName?.type === 'required' && "Waterbody name is required"}</span>
            </CCol>
            <CCol md={12}>
              <CFormSelect size="lg"
                className='mb-3'
                aria-label="Default select example"
                onChange={(e) => setRegionSelect(e.target.value, { shouldValidate: true })}
                {...register("regionSelect")}

              >
                <option> --- Select Region of unlisted waterbody ---</option>
                {regions.map((region) => <option key={region.id} value={region.id}>{region.region_name}</option>)}

              </CFormSelect>
              <span className='form-field-validation'>{errors.regionSelect?.type === 'required' && "Region is required"}</span>
            </CCol>

            <CCol md={6}>
              <CFormLabel htmlFor="posterName" >
                Your Name
              </CFormLabel>
              <CFormInput
                type="text"
                id="posterName"
                {...register("posterName", { required: true })}
              />
              <span className='form-field-validation'>{errors.posterName?.type === 'required' && "First name is required"}</span>
            </CCol>

            <CCol md={6}>
              <CFormLabel htmlFor="posterEmail" >
                Your Email
              </CFormLabel>
              <CFormInput
                type="email"
                id="posterEmail"
                {...register("posterEmail", { required: true })}
              />
              <span className='form-field-validation'>
                {errors.posterEmail?.type === 'required' && "Your email is required"}
              </span>
            </CCol>

            <CCol md={12}>
              <CFormLabel htmlFor="posterEmail" className='my-3'>
                Unlisted waterbody report & location description
              </CFormLabel>
              <CFormTextarea
                id="posterMessage"
                label="Example textarea"
                rows="3"
                text="Must be 8-20 words long."
                {...register("posterMessage", { required: true })}
              ></CFormTextarea>
              <span className='form-field-validation'>
                {errors.posterMessage?.type === 'required' && "Your description is required"}
              </span>
            </CCol>

            <CCol xs={12}>
              <CButton color="primary" type="submit" className='mt-4'>
                Submit Report
              </CButton>
            </CCol>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleLg(false)}>
            Close
          </CButton>

        </CModalFooter>
      </CModal>


    </>
  )
}

export default ProvinceUnlistedWaterbodyCreate