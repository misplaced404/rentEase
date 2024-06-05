// eslint-disable-next-line no-unused-vars
import React from 'react'
import { RegistrationModalBackdrop } from './RegistrationModal.styled';
import OwnerRegistration from '../../../Register/Owner/OwnerRegistration';
import { IoIosClose } from "react-icons/io";

// eslint-disable-next-line react/prop-types
function RegistrationModal({ closeModal, onRegistrationSubmit }) {
  return (
    <RegistrationModalBackdrop>
      <div className='ModalContainer'>
        <div className="modalHeader">
          <h1>Property Owner Registration</h1>
          <button onClick={closeModal}><IoIosClose className='closeBtn'/></button>
        </div>
        <OwnerRegistration onSubmit={onRegistrationSubmit}/>
      </div>
    </RegistrationModalBackdrop>
  )
}

export default RegistrationModal;
