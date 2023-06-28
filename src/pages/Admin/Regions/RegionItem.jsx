import { useState } from 'react';

import { CAlert, CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CTableDataCell, CTableRow } from '@coreui/react'

import apiClient from '../../../helpers/api';
import { useGlobalContext } from '../../../context';
// import { confirmAlert } from 'react-confirm-alert';
import { BsChatLeftTextFill, BsFillTrashFill } from 'react-icons/bs';
import DeleteConfirmation from '../../../components/admin/DeleteConfirmation';
import { useEffect } from 'react';
import FormEditAdminRegion from '../../../components/admin/FormEditAdminRegion';


const RegionItem = ({ region }) => {

  const { setAdminRegions, adminRegions, setRegionDeleted } = useGlobalContext();

  const [visibleEditRegion, setVisibleEditRegion] = useState(false);

  const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const handleShowEditRegion = () => setVisibleEditRegion(true);
  const handleCloseEditRegion = () => setVisibleEditRegion(false);

  const showDeleteModal = (id) => {
    setDeleteId(id);
    setDeleteMessage('Are you sure you want to delete?');
    setDisplayConfirmationModal(true);
  };
  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  const deleteAdminRegion = async () => {
    await apiClient
      .delete(`/regions/${region.id}`)
      .then((response) => {
        console.log(response.status);
        console.log(response.data);
      })
      .catch((error) => console.error(error));
  }

  const submitDelete = (id) => {
    deleteAdminRegion();
    setAdminRegions(adminRegions.filter(region => region.id !== id));
    setRegionDeleted(true);
  }
  return (
    <CTableRow>
      <CTableDataCell>{region.region_name}</CTableDataCell>
      <CTableDataCell>
        <CButton onClick={handleShowEditRegion} color="primary" size="sm" className='mr-1' ><BsChatLeftTextFill /></CButton>
        <CButton onClick={() => showDeleteModal(region.id)} color="danger" size="sm"><BsFillTrashFill /></CButton>
      </CTableDataCell>
      <DeleteConfirmation showModal={displayConfirmationModal} confirmModal={submitDelete} hideModal={hideConfirmationModal} deleteId={deleteId} message={deleteMessage} />

      <CModal alignment="center" size="lg" visible={visibleEditRegion} onClose={() => handleCloseEditRegion}>
        <CModalHeader>
          <CModalTitle>Edit Region</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <FormEditAdminRegion region={region} />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseEditRegion}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </CTableRow>

  )
}

export default RegionItem