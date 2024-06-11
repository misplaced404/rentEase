/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from 'react';
import SideMenu from '../../SideMenu/SideMenu';
import {PropertyManagementContainer, PropertyCard} from './PropertyManagement.styled';
import { FaPlus } from "react-icons/fa";
import { LuCalendarClock } from "react-icons/lu";
import AddPropertyModal from './Actions/AddPropertyModal';
import ManagePropertyModal from './Actions/ManagePropertyModal'
import EditPropertyModal from './Actions/EditPropertyModal'
import { getAuth } from "firebase/auth";
import React from 'react';
import RegistrationContext from '../../../context/RegistrationContext';
import { getFirestore, collection, getDocs, doc, where, query, deleteDoc, getDoc } from "firebase/firestore";
import Swal from 'sweetalert2';
import pic from '../../../assets/property dummy/apartment.jpg';


function PropertyManagement( ) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showManageModal, setShowManageModal] = useState(false);
    const [properties, setProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const handleShowAdd = () => setShowAddModal(true);
    const handleShowEdit = () => setShowEditModal(true);
    const handleShowManage = () => setShowManageModal(true);
    const { isRegistered } = useContext(RegistrationContext);
    const [userType, setUserType] = useState(null); // Add this line

    useEffect(() => {
      if (isRegistered) {
        const fetchPropertiesAndUserType = async () => {
          const db = getFirestore();
          const auth = getAuth();
          const user = auth.currentUser;
          // Check if the user is logged in
          if (user) {
            const userId = user.uid; // Get the user ID
    
            // Fetch the user document to get the userType
            const userDoc = await getDoc(doc(db, 'users', userId));
            const userData = userDoc.data();
            setUserType(userData.userType); // Set the userType state
    
            // Fetch the properties
            const data = await getDocs(query(collection(db, "properties"), where("userId", "==", userId)));
            const properties = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setProperties(properties);
            
            // Log the properties to the console
            console.log(properties);
          }
        };
        fetchPropertiesAndUserType();
      }
    }, [isRegistered]);
    
    

      const handleRemove = async(property) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Delete the property document from Firestore
                const db = getFirestore();
                const auth = getAuth();
                const user = auth.currentUser;

                if (user) {
                    const userId = user.uid; // Get the user ID
                    await deleteDoc(doc(db, "properties", property.id));
    
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
    
                    // Refresh the properties
                    const data = await getDocs(query(collection(db, "properties"), where("userId", "==", userId)));
                    setProperties(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
                }
            }
        });
    };

    // Determine if the Add Property button should be disabled
      const shouldDisableAddButton = () => {
          switch (userType) {
              case 'Premium (Regular)':
                  return properties.length > 0;
              case 'Premium (B3 Months)':
              case 'Premium (B6 Months)':
              case 'Premium (B12 Months)':
              case 'Owner (Free Trial)':
                  return properties.length > 2;
              default:
                  return false;
          }
      };
    
    return (
      <>
        <SideMenu/>
        { showAddModal && <AddPropertyModal closeModal={setShowAddModal}/> }
        { showManageModal && <ManagePropertyModal closeModal={setShowManageModal} propertyId={selectedProperty}/> }
        { showEditModal && <EditPropertyModal closeModal={setShowEditModal} propertyId={selectedProperty}/> }
        <PropertyManagementContainer>
          <h1>Property Management</h1>
          <div className='cardContainer'>
          <button className='addButton' onClick={handleShowAdd} disabled={shouldDisableAddButton()}>
              <div className='addButtonCard'>
                <div className='addProperty'>
                  <FaPlus className='addPropertyIcon' /> 
                  <span>Click To Add Property</span>
                </div>
              </div>
            </button>
            {properties.map((property, index) => {
              return (
                <PropertyCard key={property.id}>
                  {userType === 'Owner (Free Trial)' && index > 2 ? (
                    <div className='greyed'>
                      <h1>Upgrade to Premium</h1>
                    </div>
                  ) : null}
                  <div className='propImage'>  
                    <img src={property.propertyImages[0]}></img>
                    <span className='propRate'>{property.propertyRate}/{property.rateType}</span>
                  </div>

                  <div className='propInfo'>
                    <div className='propertyName'>{property.propertyName}</div>
                    <div className='location'>{property.propertyLocation}</div>
                    <div className='type'>{property.propertyType}</div>
                    <div className='amenities'>
                      {property.amenities.map((amenity, index) => (
                          <React.Fragment key={index}>
                          <span>{amenity.name}</span>
                          {index < property.amenities.length - 1 && <span> | </span>}
                          </React.Fragment>
                      ))}
                    </div>
                  </div>
                  <hr />
                  <div className="propFooter">
                    <div className='footerDate'>
                      <span className='dateIcon'><LuCalendarClock /> </span>
                      <span>{property.addedAt && property.addedAt.toDate ? property.addedAt.toDate().toLocaleDateString() : 'N/A'}</span>
                    </div>

                    <div className='footerAction' >
                      <button className="manageBtn" onClick={() => {
                        setSelectedProperty(property.id);
                        handleShowManage();
                      }}>
                        Manage
                      </button>
                      <span>|</span>
                      <button className="editBtn" onClick={() => { 
                        setSelectedProperty(property.id);
                        handleShowEdit();
                      }}>
                       Edit
                       </button>
                      <span>|</span>
                      <button onClick={() => handleRemove(property)}>Delete</button>
                    </div>
                  </div>
                </PropertyCard>
              );
            })}
            {/* ... rest of your code ... */}
          </div>
        </PropertyManagementContainer>
      </>
    )
    }
export default PropertyManagement;