import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
  CRow,
  CContainer,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CCardTitle,
  CListGroup,
  CListGroupItem,
  CCardFooter,
  CButton,
  CBadge,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-bootstrap4'
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css'

import SidebarNavigation from '../SidebarNavigation'
import apiClient from '../../../helpers/api'
import EditAdminProvince from './EditAdminProvince'
import { useGlobalContext } from '../../../context'
import { set } from 'react-hook-form'

import { BsChatLeftTextFill, BsFillTrashFill } from 'react-icons/bs'
import AddAdminRegion from '../Regions/AddAdminRegion'
import EditAdminRegion from '../Regions/EditAdminRegion'
import RegionItem from '../Regions/RegionItem'
import FormEditAdminProvince from '../../../components/admin/FormEditAdminProvince'
import FormAddAdminRegion from '../../../components/admin/FormAddAdminRegion'
import { useMemo } from 'react'
import ProvinceWaterbodiesTable from '../../../components/admin/ProvinceWaterbodiesTable'
import FormAddAdminWaterbody from '../../../components/admin/FormAddAdminWaterbody'

function AdminProvince({ user }) {
  const [currentRegionId, setCurrentRegionId] = useState(null)

  const { adminProvinceId } = useParams()
  const {
    provinceUpdated,
    regionAdded,
    regionDeleted,
    regionUpdated,
    waterbodyAdded,
    showMessage,
    setShowMessage,
    setPath,
    adminProvinceCollection,
    adminRegions,
    loading,
    getAdminProvinceData,
  } = useGlobalContext()

  // modal state
  const [visibleEditProvince, setVisibleEditProvince] = useState(false)
  const [visibleAddRegion, setVisibleAddRegion] = useState(false)

  useEffect(() => {
    setPath(adminProvinceId)
  }, [adminProvinceId])

  const handleShowEditProvince = () => setVisibleEditProvince(true)
  const handleCloseEditProvince = () => setVisibleEditProvince(false)

  const handleShowAddRegion = () => setVisibleAddRegion(true)
  const handleCloseAddRegion = () => setVisibleAddRegion(false)

  // TODO: remove or add a handler for close icon on modal

  useEffect(() => {
    handleCloseAddRegion()
  }, [adminRegions])

  useEffect(() => {
    if (provinceUpdated) {
      console.count('fetched - province updated!!')
      getAdminProvinceData()
    }
  }, [provinceUpdated])

  useEffect(() => {
    if (regionDeleted) {
      console.log('fetched - region deleted!!')
      getAdminProvinceData()
    }
  }, [regionDeleted])

  useEffect(() => {
    if (regionAdded) {
      console.log('fetched - region added!!')
      getAdminProvinceData()
    }
  }, [regionAdded])

  useEffect(() => {
    if (regionUpdated) {
      console.log('fetched - region edited!!')
      getAdminProvinceData()
    }
  }, [regionUpdated])

  useEffect(() => {
    if (waterbodyAdded) {
      console.log('fetched - waterbody added!!')
      getAdminProvinceData()
    }
  }, [waterbodyAdded])

  if (loading) {
    return (
      <div className="spinner-container">
        <CSpinner />
      </div>
    )
  } else
    return (
      adminProvinceCollection && (
        <CContainer fluid>
          <CRow md={{ gutter: 0 }}>
            <SidebarNavigation user={user} />
            <CCol style={{ paddingLeft: 0 }}>
              <div className="dashboard-wrapp">
                <CContainer fluid>
                  <CRow>
                    <CCol xs={12}>
                      <ProvinceWaterbodiesTable provinceId={adminProvinceId} />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol xxl={8} xl={7}>
                      <CCard className="mb-4">
                        {showMessage && (
                          <CAlert color="success">
                            <strong>Succes!</strong> You updated the province data.
                          </CAlert>
                        )}
                        <CCardHeader className="card-header__darkblue">
                          <div className="d-flex align-items-center justify-content-between">
                            <div>{adminProvinceCollection.provinceName} Province column labels</div>{' '}
                            <CButton
                              onClick={handleShowEditProvince}
                              className="provinceList__item-btn"
                              color="secondary"
                              size="lg"
                              shape="rounded-0"
                            >
                              Edit province
                            </CButton>
                          </div>{' '}
                        </CCardHeader>
                        <CCardBody className="dashboard-table">
                          <CListGroup flush className="dashboard__provinces-field-list">
                            <CListGroupItem>
                              <div className="dashboard__provinces-field-group">
                                <div className="dashboard__provinces-field-group-item">
                                  <span className="dashboard__provinces-field-group-item__label">
                                    Province Name:
                                  </span>{' '}
                                  <span className="dashboard__provinces-field-group-item__value">
                                    {adminProvinceCollection.provinceName}
                                  </span>
                                </div>
                                <div className="dashboard__provinces-field-group-item">
                                  <span className="dashboard__provinces-field-group-item__label">
                                    Province status:
                                  </span>{' '}
                                  <span className="dashboard__provinces-field-group-item__value">
                                    <CBadge
                                      color={
                                        adminProvinceCollection.isActive === 1
                                          ? 'primary'
                                          : 'danger'
                                      }
                                      shape="rounded-pill"
                                    >
                                      {adminProvinceCollection.isActive === 1
                                        ? 'Active'
                                        : 'Disabled'}
                                    </CBadge>
                                  </span>
                                </div>

                                <div className="dashboard__provinces-field-group-item"></div>
                              </div>
                            </CListGroupItem>

                            <CListGroupItem>
                              <div className="dashboard__provinces-field-group">
                                <div className="dashboard__provinces-field-group-item">
                                  <span className="dashboard__provinces-field-group-item__label">
                                    Label 1:
                                  </span>
                                  <span
                                    className={
                                      adminProvinceCollection.columnLabel1?.length === 0
                                        ? 'dashboard__provinces-field-group-item__value--empty'
                                        : 'dashboard__provinces-field-group-item__value'
                                    }
                                  >
                                    {' '}
                                    {adminProvinceCollection.columnLabel1?.length === 0
                                      ? 'no-value'
                                      : adminProvinceCollection.columnLabel1}
                                  </span>
                                </div>
                                <div className="dashboard__provinces-field-group-item">
                                  <span className="dashboard__provinces-field-group-item__label">
                                    Label 2:
                                  </span>
                                  <span
                                    className={
                                      adminProvinceCollection.columnLabel2?.length === 0
                                        ? 'dashboard__provinces-field-group-item__value--empty'
                                        : 'dashboard__provinces-field-group-item__value'
                                    }
                                  >
                                    {' '}
                                    {adminProvinceCollection.columnLabel2?.length === 0
                                      ? 'no-value'
                                      : adminProvinceCollection.columnLabel2}
                                  </span>
                                </div>

                                <div className="dashboard__provinces-field-group-item">
                                  <span className="dashboard__provinces-field-group-item__label">
                                    Label 3:
                                  </span>
                                  <span
                                    className={
                                      adminProvinceCollection.columnLabel3?.length === 0
                                        ? 'dashboard__provinces-field-group-item__value--empty'
                                        : 'dashboard__provinces-field-group-item__value'
                                    }
                                  >
                                    {' '}
                                    {adminProvinceCollection.columnLabel3?.length === 0
                                      ? 'no-value'
                                      : adminProvinceCollection.columnLabel3}
                                  </span>
                                </div>
                              </div>
                            </CListGroupItem>

                            <CListGroupItem>
                              <div className="dashboard__provinces-field-group">
                                <div className="dashboard__provinces-field-group-item">
                                  <span className="dashboard__provinces-field-group-item__label">
                                    Label 4:
                                  </span>
                                  <span
                                    className={
                                      adminProvinceCollection.columnLabel4?.length === 0
                                        ? 'dashboard__provinces-field-group-item__value--empty'
                                        : 'dashboard__provinces-field-group-item__value'
                                    }
                                  >
                                    {' '}
                                    {adminProvinceCollection.columnLabel4?.length === 0
                                      ? 'no-value'
                                      : adminProvinceCollection.columnLabel4}
                                  </span>
                                </div>
                                <div className="dashboard__provinces-field-group-item">
                                  <span className="dashboard__provinces-field-group-item__label">
                                    Label 5:
                                  </span>
                                  <span
                                    className={
                                      adminProvinceCollection.columnLabel5?.length === 0
                                        ? 'dashboard__provinces-field-group-item__value--empty'
                                        : 'dashboard__provinces-field-group-item__value'
                                    }
                                  >
                                    {' '}
                                    {adminProvinceCollection.columnLabel5?.length === 0
                                      ? 'no-value'
                                      : adminProvinceCollection.columnLabel5}
                                  </span>
                                </div>

                                <div className="dashboard__provinces-field-group-item">
                                  <span className="dashboard__provinces-field-group-item__label">
                                    Label 6:
                                  </span>
                                  <span
                                    className={
                                      adminProvinceCollection.columnLabel6?.length === 0
                                        ? 'dashboard__provinces-field-group-item__value--empty'
                                        : 'dashboard__provinces-field-group-item__value'
                                    }
                                  >
                                    {' '}
                                    {adminProvinceCollection.columnLabel6?.length === 0
                                      ? 'no-value'
                                      : adminProvinceCollection.columnLabel6}
                                  </span>
                                </div>
                              </div>
                            </CListGroupItem>

                            <CListGroupItem>
                              <div className="dashboard__provinces-field-group">
                                <div className="dashboard__provinces-field-group-item">
                                  <span className="dashboard__provinces-field-group-item__label">
                                    Label 7:
                                  </span>
                                  <span
                                    className={
                                      adminProvinceCollection.columnLabel7?.length === 0
                                        ? 'dashboard__provinces-field-group-item__value--empty'
                                        : 'dashboard__provinces-field-group-item__value'
                                    }
                                  >
                                    {' '}
                                    {adminProvinceCollection.columnLabel7?.length === 0
                                      ? 'no-value'
                                      : adminProvinceCollection.columnLabel7}
                                  </span>
                                </div>
                                <div className="dashboard__provinces-field-group-item">
                                  <span className="dashboard__provinces-field-group-item__label">
                                    Label 8:
                                  </span>
                                  <span
                                    className={
                                      adminProvinceCollection.columnLabel8?.length === 0
                                        ? 'dashboard__provinces-field-group-item__value--empty'
                                        : 'dashboard__provinces-field-group-item__value'
                                    }
                                  >
                                    {' '}
                                    {adminProvinceCollection.columnLabel8?.length === 0
                                      ? 'no-value'
                                      : adminProvinceCollection.columnLabel8}
                                  </span>
                                </div>

                                <div className="dashboard__provinces-field-group-item">
                                  <span className="dashboard__provinces-field-group-item__label">
                                    Label 9:
                                  </span>
                                  <span
                                    className={
                                      adminProvinceCollection.columnLabel9?.length === 0
                                        ? 'dashboard__provinces-field-group-item__value--empty'
                                        : 'dashboard__provinces-field-group-item__value'
                                    }
                                  >
                                    {' '}
                                    {adminProvinceCollection.columnLabel9?.length === 0
                                      ? 'no-value'
                                      : adminProvinceCollection.columnLabel9}
                                  </span>
                                </div>
                              </div>
                            </CListGroupItem>

                            <CListGroupItem>
                              <div className="dashboard__provinces-field-group">
                                <div className="dashboard__provinces-field-group-item">
                                  <span className="dashboard__provinces-field-group-item__label">
                                    Label 10:
                                  </span>
                                  <span
                                    className={
                                      adminProvinceCollection.columnLabel10?.length === 0
                                        ? 'dashboard__provinces-field-group-item__value--empty'
                                        : 'dashboard__provinces-field-group-item__value'
                                    }
                                  >
                                    {' '}
                                    {adminProvinceCollection.columnLabel10?.length === 0
                                      ? 'no-value'
                                      : adminProvinceCollection.columnLabel10}
                                  </span>
                                </div>
                                <div className="dashboard__provinces-field-group-item">
                                  <span className="dashboard__provinces-field-group-item__label">
                                    Label 11:
                                  </span>
                                  <span
                                    className={
                                      adminProvinceCollection.columnLabel11?.length === 0
                                        ? 'dashboard__provinces-field-group-item__value--empty'
                                        : 'dashboard__provinces-field-group-item__value'
                                    }
                                  >
                                    {' '}
                                    {adminProvinceCollection.columnLabel11?.length === 0
                                      ? 'no-value'
                                      : adminProvinceCollection.columnLabel11}
                                  </span>
                                </div>

                                <div className="dashboard__provinces-field-group-item">
                                  <span className="dashboard__provinces-field-group-item__label">
                                    Label 12:
                                  </span>
                                  <span
                                    className={
                                      adminProvinceCollection.columnLabel12?.length === 0
                                        ? 'dashboard__provinces-field-group-item__value--empty'
                                        : 'dashboard__provinces-field-group-item__value'
                                    }
                                  >
                                    {' '}
                                    {adminProvinceCollection.columnLabel12?.length === 0
                                      ? 'no-value'
                                      : adminProvinceCollection.columnLabel12}
                                  </span>
                                </div>
                              </div>
                            </CListGroupItem>
                          </CListGroup>
                        </CCardBody>
                      </CCard>
                      {/*  <EditAdminProvince visibleLg={visibleLg} setVisibleLg={setVisibleLg} province={adminProvinceCollection} setAdminProvince={setAdminProvinceCollection} getProvinceData={getAdminProvinceData} /> */}

                      <CModal
                        alignment="center"
                        size="lg"
                        visible={visibleEditProvince}
                        onClose={() => handleCloseEditProvince}
                      >
                        <CModalHeader>
                          <CModalTitle>Update Province</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                          <FormEditAdminProvince
                            handleCloseEditProvince={handleCloseEditProvince}
                          />
                        </CModalBody>
                        <CModalFooter>
                          <CButton color="secondary" onClick={handleCloseEditProvince}>
                            Close
                          </CButton>
                        </CModalFooter>
                      </CModal>
                    </CCol>
                    <CCol xxl={4} xl={5} xs={12}>
                      <CCard className="mb-4">
                        <CCardHeader className="card-header__darkblue">
                          <div className="d-flex align-items-center justify-content-between">
                            <div>Regions</div>{' '}
                            <CButton
                              onClick={handleShowAddRegion}
                              className="provinceList__item-btn"
                              color="secondary"
                              size="lg"
                              shape="rounded-0"
                            >
                              Add a region
                            </CButton>
                          </div>
                        </CCardHeader>
                        <CCardBody className="dashboard-table">
                          <CTable>
                            <CTableHead>
                              <CTableRow>
                                <CTableHeaderCell scope="col">Region Name</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              {adminRegions.map((region, index) => {
                                return <RegionItem key={region.id} region={region} />
                              })}
                            </CTableBody>
                          </CTable>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>

                  <CModal
                    alignment="center"
                    size="lg"
                    visible={visibleAddRegion}
                    onClose={() => handleCloseAddRegion}
                  >
                    <CModalHeader>
                      <CModalTitle>Add Region</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                      <FormAddAdminRegion setVisibleAddRegion={setVisibleAddRegion} />
                    </CModalBody>
                    <CModalFooter>
                      <CButton color="secondary" onClick={handleCloseAddRegion}>
                        Close
                      </CButton>
                    </CModalFooter>
                  </CModal>
                </CContainer>
              </div>
            </CCol>
          </CRow>
        </CContainer>
      )
    )
}

export default AdminProvince
