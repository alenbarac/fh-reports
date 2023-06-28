import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useParams } from 'react-router-dom';

import React from 'react';
import { CButton, CCol, CForm, CFormInput, CFormLabel, CFormTextarea, CCard, CCardBody, CCardTitle, CAlert } from '@coreui/react';
import apiClient from '../../helpers/api';

const WaterbodyPersonalReportCreate = ({ visibleLg, setVisibleLg }) => {


  const { register, formState: { errors }, reset, handleSubmit } = useForm();

  const { waterbody_id } = useParams();

  const [isSubmitted, setIsSubmitted] = useState(false);


  const onSubmit = data => {
    const personalReport = {
      waterbody_id: waterbody_id,
      poster_name: data.posterName,
      poster_email: data.posterEmail,
      poster_message: data.posterMessage,
    }
    apiClient
      .post(`/waterbodies/${waterbody_id}/personal_reports`, personalReport)
      .then((response) => {
        console.log(response.status);
        console.log(response.data);
      })

    setIsSubmitted(true);
    reset();
  }

  return (
    <>
      <CCard>
        <CCardBody>
          {isSubmitted && (<CAlert
            color="success"
          >
            <strong>Thank you!</strong> After the approval your report will be displayed shortly.
          </CAlert>)}

          <CCardTitle>
            Submit a personal report for this waterbody
          </CCardTitle>
          <hr />
          <CForm
            className="waterbody-create row g-3 needs-validation"
            onSubmit={handleSubmit(onSubmit)}
          >
            <CCol md={12}>
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
            <CCol md={12}>
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
                Personal waterbody report
              </CFormLabel>
              <CFormTextarea
                id="exampleFormControlTextarea1"
                label="Example textarea"
                rows="6"
                text="Must be 8-20 words long."
                {...register("posterMessage", { required: true })}
              ></CFormTextarea>
              <span className='form-field-validation'>
                {errors.posterMessage?.type === 'required' && "Your message is required"}
              </span>
            </CCol>
            <CCol xs={12}>
              <CButton color="secondary" type="submit" className='mt-4'>
                Submit Report
              </CButton>
            </CCol>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  )
}

export default WaterbodyPersonalReportCreate