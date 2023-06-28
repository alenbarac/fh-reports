import React from 'react'
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { CAlert, CButton, CCol, CContainer, CForm, CFormCheck, CFormInput, CFormLabel, CFormSelect, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CSpinner } from '@coreui/react'

import apiClient from '../../helpers/api';
import { useGlobalContext } from '../../context';
import str2bool from '../../helpers/str2bool';


const FormAddAdminWaterbody = ({ setVisibleAddWaterbody, provinceId }) => {

  const [isSubmitted, setIsSubmitted] = useState(false);

  const { adminRegions, addProvinceWaterbody, setWaterbodyAdded } = useGlobalContext();
  const { register, formState: { errors }, reset, handleSubmit } = useForm();

  const [newWaterbody, setNewWaterbody] = useState({
    region_id: null, waterbody_name: "", longitude: "", latitude: "", waterbody_unlisted: false
  });


  const onInputChange = (e) => {
    setNewWaterbody({ ...newWaterbody, [e.target.name]: e.target.type === 'number' || e.target.type === 'select-one' ? parseInt(e.target.value) : e.target.value })
  }


  const { region_id, waterbody_name, longitude, latitude, waterbody_unlisted } = newWaterbody;

  const addNewWaterbodyApi = async () => {
    await apiClient
      .post(`/admin/provinces/${provinceId}/waterbodies`, newWaterbody)
      .then((response) => {
        console.log(response.status);
        console.log(response.data);
      })
  }

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(newWaterbody)
    setIsSubmitted(true);
    addProvinceWaterbody(region_id, waterbody_name, longitude, latitude, waterbody_unlisted);
    addNewWaterbodyApi()
    setWaterbodyAdded(true)
    reset();
    setWaterbodyAdded(false)
  }

  return (
    <CForm
      className="row g-3 needs-validation"
      onSubmit={onSubmit}
    >
      <CContainer>
        <CRow className='align-items-center'>
          <CCol md={8}>
            <CFormLabel htmlFor="regionName" >
              Waterbody name
            </CFormLabel>
            <CFormInput
              className='mb-3'
              type="text"
              name="waterbody_name"
              value={waterbody_name}
              onChange={(e) => onInputChange(e)}
              required
            />
          </CCol>
          <CCol sm={4} className="px-2">
            <div className="d-flex align-items-center">
              <CFormCheck
                type="radio"
                name="waterbody_unlisted"
                value={waterbody_unlisted}
                label="Listed"
                className='mr-4'
                onChange={(e) => onInputChange(e)}
                defaultChecked
              />
              <CFormCheck
                type="radio"
                name="waterbody_unlisted"
                value={!waterbody_unlisted}
                label="Unlisted"
                onChange={(e) => onInputChange(e)}
              />
            </div>
          </CCol>
        </CRow>
        <CRow className='align-items-center'>
          <CCol md={12}>
            <CFormSelect size="lg"
              className='mb-3'
              aria-label="Default select example"
              onChange={(e) => onInputChange(e)}
              name="region_id"

            >
              <option> --- Select waterbody region ---</option>
              {adminRegions.map((region) => <option key={region.id} value={region.id}>{region.region_name}</option>)}

            </CFormSelect>
            <span className='form-field-validation'>{errors.regionSelect?.type === 'required' && "Region is required"}</span>
          </CCol>
        </CRow>

        <CRow className='align-items-center'>
          <CCol md={6}>
            <CFormLabel htmlFor="longitude" >
              Longitude
            </CFormLabel>
            <CFormInput
              className='mb-3'
              type="text"
              name="longitude"
              value={longitude}
              onChange={(e) => onInputChange(e)}
              step={0.1}

            />
          </CCol>

          <CCol md={6}>
            <CFormLabel htmlFor="latitude" >
              latitude
            </CFormLabel>
            <CFormInput
              className='mb-3'
              type="text"
              name="latitude"
              value={latitude}
              onChange={(e) => onInputChange(e)}
              step={'any'}

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

export default FormAddAdminWaterbody