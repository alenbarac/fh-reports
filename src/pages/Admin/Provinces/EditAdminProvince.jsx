import React from 'react'
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { CAlert, CButton, CCol, CContainer, CForm, CFormCheck, CFormInput, CFormLabel, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CSpinner } from '@coreui/react'

import apiClient from '../../../helpers/api';
import { useGlobalContext } from '../../../context';
import str2bool from '../../../helpers/str2bool';


const EditAdminProvince = ({ visibleLg, setVisibleLg, province, setAdminProvince, getProvinceData }) => {

  const [isSubmitted, setIsSubmitted] = useState(false);

  const { loading, provinceUpdated, setProvinceUpdated, showMessage, setShowMessage } = useGlobalContext();
  const { register, formState: { errors }, reset, handleSubmit } = useForm();
  const [provinceName, setProvinceName] = useState(province.provinceName);
  const [provinceIsActive, setProvinceIsActive] = useState(province.isActive);
  const [columnLabel1, setColumnLabel1] = useState(province.columnLabel1);
  const [columnLabel2, setColumnLabel2] = useState(province.columnLabel2);
  const [columnLabel3, setColumnLabel3] = useState(province.columnLabel3);
  const [columnLabel4, setColumnLabel4] = useState(province.columnLabel4);
  const [columnLabel5, setColumnLabel5] = useState(province.columnLabel5);
  const [columnLabel6, setColumnLabel6] = useState(province.columnLabel6);
  const [columnLabel7, setColumnLabel7] = useState(province.columnLabel7);
  const [columnLabel8, setColumnLabel8] = useState(province.columnLabel8);
  const [columnLabel9, setColumnLabel9] = useState(province.columnLabel9);
  const [columnLabel10, setColumnLabel10] = useState(province.columnLabel10);
  const [columnLabel11, setColumnLabel11] = useState(province.columnLabel11);
  const [columnLabel12, setColumnLabel12] = useState(province.columnLabel12);

  const province_id = province.id;
  const onSubmit = data => {

    const provinceUpdate = {
      province_name: data.provinceName,
      is_active: str2bool(data.provinceIsActive),
      column_label_1: data.columnLabel1,
      column_label_2: data.columnLabel2,
      column_label_3: data.columnLabel3,
      column_label_4: data.columnLabel4,
      column_label_5: data.columnLabel5,
      column_label_6: data.columnLabel6,
      column_label_7: data.columnLabel7,
      column_label_8: data.columnLabel8,
      column_label_9: data.columnLabel9,
      column_label_10: data.columnLabel10,
      column_label_11: data.columnLabel11,
      column_label_12: data.columnLabel12,
    }

    apiClient
      .put(`/provinces/${province_id}`, provinceUpdate)
      .then((response) => {
        console.log(response.status);
        console.log(response.data);
      })
    setIsSubmitted(true);
    setAdminProvince({ ...province, provinceUpdate });
    setProvinceUpdated(true);

    setShowMessage(true);

    reset();
    setVisibleLg(false);
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
        <CModal alignment="center" size="lg" visible={visibleLg} onClose={() => setVisibleLg(false)}>
          <CModalHeader>
            <CModalTitle>Update  Province</CModalTitle>
          </CModalHeader>
          <CModalBody>


            <CForm
              className="row g-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <CContainer>
                <CRow className='align-items-center'>
                  <CCol md={8}>
                    <CFormLabel htmlFor="provinceName" >
                      Province name
                    </CFormLabel>
                    <CFormInput
                      className='mb-3'
                      type="text"
                      id="provinceName"
                      defaultValue={provinceName}
                      onChange={(e) => setProvinceName(e.target.value, { shouldValidate: true })}
                      {...register("provinceName")}
                    />

                  </CCol>
                  <CCol sm={4} className="px-2">
                    <div className="d-flex align-items-center">
                      <CFormCheck type="radio"
                        name="provinceIsActive"
                        defaultValue={true}
                        label="Active"
                        className='mr-4'
                        onChange={(e) => setProvinceIsActive(e.target.value)}
                        defaultChecked={provinceIsActive ? true : false}
                        {...register("provinceIsActive")}
                      />
                      <CFormCheck
                        type="radio"
                        name="provinceIsActive"
                        defaultValue={false}
                        label="Disable"
                        onChange={(e) => setProvinceIsActive(e.target.value)}
                        defaultChecked={!provinceIsActive ? true : false}
                        {...register("provinceIsActive")}
                      />
                    </div>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md={4}>
                    <CFormLabel htmlFor="columnLabel1" >
                      Column Label 1
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="columnLabel1"
                      defaultValue={columnLabel1}
                      onChange={(e) => setColumnLabel1(e.target.value)}
                      {...register("columnLabel1")}
                    />

                  </CCol>

                  <CCol md={4}>
                    <CFormLabel htmlFor="columnLabel2" >
                      Column Label 2
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="columnLabel2"
                      defaultValue={columnLabel2}
                      onChange={(e) => setColumnLabel2(e.target.value)}
                      {...register("columnLabel2")}
                    />

                  </CCol>

                  <CCol md={4}>
                    <CFormLabel htmlFor="columnLabel3" >
                      Column Label 3
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="columnLabel3"
                      defaultValue={columnLabel3}
                      onChange={(e) => setColumnLabel3(e.target.value)}
                      {...register("columnLabel3")}
                    />

                  </CCol>
                </CRow>
                <CRow>
                  <CCol md={4}>
                    <CFormLabel htmlFor="columnLabel" >
                      Column Label 4
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="columnLabel4"
                      defaultValue={columnLabel4}
                      onChange={(e) => setColumnLabel4(e.target.value)}
                      {...register("columnLabel4")}
                    />

                  </CCol>

                  <CCol md={4}>
                    <CFormLabel htmlFor="columnLabel" >
                      Column Label 5
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="columnLabel5"
                      defaultValue={columnLabel5}
                      onChange={(e) => setColumnLabel5(e.target.value)}
                      {...register("columnLabel5")}
                    />

                  </CCol>

                  <CCol md={4}>
                    <CFormLabel htmlFor="columnLabel" >
                      Column Label 6
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="columnLabel6"
                      defaultValue={columnLabel6}
                      onChange={(e) => setColumnLabel6(e.target.value)}
                      {...register("columnLabel6")}
                    />

                  </CCol>
                </CRow>

                <CRow>
                  <CCol md={4}>
                    <CFormLabel htmlFor="columnLabel7" >
                      Column Label 7
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="columnLabel7"
                      defaultValue={columnLabel7}
                      onChange={(e) => setColumnLabel7(e.target.value)}
                      {...register("columnLabel7")}
                    />

                  </CCol>

                  <CCol md={4}>
                    <CFormLabel htmlFor="columnLabel" >
                      Column Label 8
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="columnLabel8"
                      defaultValue={columnLabel8}
                      onChange={(e) => setColumnLabel8(e.target.value)}
                      {...register("columnLabel8")}
                    />

                  </CCol>

                  <CCol md={4}>
                    <CFormLabel htmlFor="columnLabel" >
                      Column Label 9
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="columnLabel9"
                      defaultValue={columnLabel9}
                      onChange={(e) => setColumnLabel9(e.target.value)}
                      {...register("columnLabel9")}
                    />

                  </CCol>

                </CRow>
                <CRow>
                  <CCol md={4}>
                    <CFormLabel htmlFor="columnLabel" >
                      Column Label 10
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="columnLabel10"
                      defaultValue={columnLabel10}
                      onChange={(e) => setColumnLabel10(e.target.value)}
                      {...register("columnLabel10")}
                    />

                  </CCol>

                  <CCol md={4}>
                    <CFormLabel htmlFor="columnLabel" >
                      Column Label 11
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="columnLabel11"
                      defaultValue={columnLabel11}
                      onChange={(e) => setColumnLabel11(e.target.value)}
                      {...register("columnLabel11")}
                    />

                  </CCol>

                  <CCol md={4}>
                    <CFormLabel htmlFor="columnLabel" >
                      Column Label 12
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="columnLabel12"
                      defaultValue={columnLabel12}
                      onChange={(e) => setColumnLabel12(e.target.value)}
                      {...register("columnLabel12")}
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

export default EditAdminProvince