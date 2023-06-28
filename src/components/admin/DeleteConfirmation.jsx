import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import React from 'react'

const DeleteConfirmation = ({ showModal, hideModal, confirmModal, deleteId, message }) => {
  return (
    <CModal alignment="center" size="lg" visible={showModal} onClose={() => hideModal}>
      <CModalHeader>
        <CModalTitle>Delete Item</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="alert alert-danger">{message}</div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={hideModal}>
          cancel
        </CButton>
        <CButton color="danger" onClick={() => confirmModal(deleteId)}>
          Delete
        </CButton>

      </CModalFooter>
    </CModal>
  )
}

export default DeleteConfirmation