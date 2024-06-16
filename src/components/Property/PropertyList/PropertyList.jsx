/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React from 'react';
import {useState, useEffect } from 'react';
import SideMenu from '../../SideMenu/SideMenu';
import {PropertyListContainer , PropertyCard} from './Property.styled';
import { LuCalendarClock } from "react-icons/lu";
import { Link } from 'react-router-dom';
import RegistrationModal from './RegistrationModal/RegistrationModal';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, deleteDoc, where, query, updateDoc } from "firebase/firestore";
import Swal from 'sweetalert2'; 
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { IoFilter, IoCloseCircle   } from "react-icons/io5";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import Pagination from "@mui/material/Pagination"

const itemsPerPage = 20;

function PropertyList() {

  const [value, setValue] = useState('')
  const [showModal, setShowModal] = useState(false);
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [isHeartHovered, setIsHeartHovered] = useState(false);
  const [page, setPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('0');
  const [renderCount, setRenderCount] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [userType, setUserType] = useState(null);



  const db = getFirestore();
  const auth = getAuth();

  const fetchProperties = async () => {
    const db = getFirestore();
    const auth = getAuth();
  
    // Query the 'properties' collection for documents where 'propertyVerification' matches "accepted"
    const propertiesQuery = query(collection(db, 'properties'), where('propertyVerification', '==', 'accepted'));
    const data = await getDocs(propertiesQuery);
    let properties = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  
    if (auth.currentUser) {
      // Fetch the user document for each property to get the userType
      for (let property of properties) {
        const userDoc = await getDoc(doc(db, 'users', property.userId));
        const userData = userDoc.data();
        property.userType = userData.userType; // Add the userType to the property
      }
  
      // If the user is an 'Owner (Free Trial)', limit the properties to the first three
      properties = properties.filter((property, index) => property.userType !== 'Owner (Free Trial)' || index < 3);
  
      // Query the 'favorites' collection for documents where 'userId' matches the current user's ID
      const favoritesQuery = query(collection(db, 'favorites'), where('userId', '==', auth.currentUser.uid));
      const favoritesSnapshot = await getDocs(favoritesQuery);
  
      // Create a set of favorited property IDs for easy lookup
      const favoritedPropertyIds = new Set(favoritesSnapshot.docs.map(doc => doc.data().propertyId));
  
      // Mark the properties that are favorited
      properties = properties.map(property => ({
        ...property,
        isFavorited: favoritedPropertyIds.has(property.id),
      }));
      console.log('Favorited properties:', properties.filter(property => property.isFavorited));
  
      properties = properties.sort((a, b) => a.addedAt.toDate() - b.addedAt.toDate());
      setProperties(properties);
      setFilteredProperties(properties);
    }
  };
  
  
  
  // Call fetchProperties when the component mounts and whenever auth.currentUser changes
  useEffect(() => {
    fetchProperties();
  }, [auth.currentUser]);
  

  // Increment renderCount every time the component renders
  useEffect(() => {
    setRenderCount(renderCount + 1);
  }, []);

  // Load favorites from Firestore on component mount and update
  useEffect(() => {
    const loadFavorites = async () => {
      if (auth.currentUser && properties && properties.id) {
        console.log('Current user:', auth.currentUser); // Log the current user
        console.log('Property ID:', properties.id); // Log the property ID

        const favoritesQuery = query(
          collection(db, 'users', auth.currentUser.uid, 'favorites'),
          where('propertyId', '==', properties.id)
        );
        const favoritesSnapshot = await getDocs(favoritesQuery);
        properties.isFavorited = !favoritesSnapshot.empty;

        // Log the properties in favorites collection
        favoritesSnapshot.forEach((doc) => {
          console.log('Favorite property:', doc.data());
        });
      }
    };

    loadFavorites();
  }, [auth.currentUser, properties, renderCount]); // Add renderCount as a dependency
  

  const handleRegistrationSubmit = () => {
    setRegistrationStatus('review');
    setShowModal(false);
  };

  
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(getFirestore(), 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRegistrationStatus(docSnap.data().registrationStatus);
          setUserType(docSnap.data().userType);
        }
      }
    });
  }, []);
  
  
  useEffect(() => {
    if (value) {
      setFilteredProperties(properties.filter(property => property.propertyType === value));
    } else {
      setFilteredProperties(properties);
    }
  }, [properties, value]);

  // Filter properties based on search term
  useEffect(() => {
    if (searchTerm) {
      setFilteredProperties(properties.filter(property => property.propertyName.toLowerCase().includes(searchTerm.toLowerCase())));
    } else {
      setFilteredProperties(properties);
    }
  }, [properties, searchTerm]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    let sortedProperties;
    switch(event.target.value) {
      case '0':
        sortedProperties = [...properties].sort((a, b) => a.addedAt.toDate() - b.addedAt.toDate());
        break;
      case '1':
        sortedProperties = [...properties].sort((a, b) => b.addedAt.toDate() - a.addedAt.toDate());
        break;
      case '2':
        sortedProperties = [...properties].sort((a, b) => b.popularity - a.popularity);
        break;
      case '3':
        sortedProperties = [...properties].sort((a, b) => parseFloat(a.propertyRate) - parseFloat(b.propertyRate));
        break;
      case '4':
        sortedProperties = [...properties].sort((a, b) => parseFloat(b.propertyRate) - parseFloat(a.propertyRate));
        break;
      default:
        sortedProperties = properties;
    }
    setFilteredProperties(sortedProperties);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Calculate the index of the first and last items on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // Slice the array of all properties to get only the items for the current page
    const currentItems = properties.slice(indexOfFirstItem, indexOfLastItem);
  
    setFilteredProperties(currentItems);
  }, [properties, currentPage]);
  
  const handlePagination = (event, value) => {
    setCurrentPage(value);
  };
  

  const [filterSelections, setFilterSelections] = useState({
    propertyType: 'Any',
    location: 'Any',
    rate: 'Any',
    bedroom: 'Any'
  });

  const handleFilter = async() => {
    const propertyType = [ "Any", "Boarding House", "Apartment", "Condominium"];

    const location = [
      'Any', 'Adlaon', 'Agsungot', 'Apas', 'Bacayan', 'Banilad', 'Binaliw', 'Budla-an', 'Buhisan', 
      'Bulacao', 'Busay', 'Calamba', 'Cambinocot', 'Capitol Site', 'Carreta', 'Cogon Pardo', 
      'Cogon Ramos', 'Day-as', 'Duljo', 'Ermita', 'Guba', 'Guadalupe', 'Hipodromo', 'Inayawan', 
      'Kalubihan', 'Kalunasan', 'Kamagayan', 'Kamputhaw', 'Kasambagan', 'Kinasang-an', 'Labangon', 
      'Lahug', 'Lorega San Miguel', 'Lusaran', 'Mabini', 'Mabolo', 'Malubog', 'Mambaling', 'Pahina Central', 
      'Pahina San Nicolas', 'Pamutan', 'Pardo', 'Parian', 'Paril', 'Pasil', 'Pit-os', 'Poblacion Pardo', 
      'Pulangbato', 'Pung-ol Sibugay', 'Punta Princesa', 'Quiot', 'Sambag 1', 'Sambag 2', 'San Antonio', 
      'San Jose', 'San Nicolas Proper', 'San Roque', 'Santa Cruz', 'Santo Niño', 'Sawang Calero', 'Sinsin', 
      'Sirao', 'Suba', 'Sudlon 1', 'Sudlon 2', 'Tabunan', 'Tagbao', 'Talamban', 'Taptap', 'Tejero', 'Tinago', 
      'Tisa', 'To-ong', 'Zapatera'
    ];

    const rate = ["Any", "Less than 5k", "5k - 10k", "10k - 15k", "15k - 20k", "20k - 25k", "25k - 30k", "More than 30k",];
    const bedroom = [ "Any", "1", "2", "3", "4","5",];
    const { value: accept } = await Swal.fire({
      title: "Filter Properties",
      width: 600,
      showCloseButton: true,
      html: `
        <style>
          .container{
            display: flex;
            justify-content: center;
          }

          .checkboxField{
            display: flex;
            flex-wrap: wrap;
            gap:20px;
          }

          .checkboxSection{
            width: 250px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            gap: 5px;
          }

          select{
            height: 30px;
            width: 250px;
            padding: 0 0 0 10px;
            border: 1px solid #0e7490; 
            border-radius: 5px;
            max-height: 30px !important; /* Adjust this value as needed */
            overflow-y: auto;
          }

        </style>

        <div class="container">
          <div class="checkboxField">

            <div class="checkboxSection">
              <label htmlFor="propertyType">Type</label>
              <select name="propertyType" class="filterDropdown">
                ${propertyType.map((p, index) => (
                  `<option key=${index} value=${index}>${p}</option>`
                )).join('')}
             
              </select>
            </div>

            <div class="checkboxSection">
              <label htmlFor="location">Location</label>
              <select name="location" class=""> 
                ${location.map((l, index) => (
                  `<option key=${index} value=${index}>${l}</option>`
                )).join('')}
              </select>
            </div>

            <div class="checkboxSection">
              <label htmlFor="propertyRate">Rate</label>
              <select name="rate" class="">
              ${rate.map((p, index) => (
                `<option key=${index} value=${index}>${p}</option>`
              )).join('')}
              </select>
            </div>

            <div class="checkboxSection">
              <label htmlFor="bedrooms">Bedrooms</label>
              <select name="bedroom" class="">
              ${bedroom.map((b, index) => (
                `<option key=${index} value=${index}>${b}</option>`
              )).join('')}
              </select>
            </div>
            
          </div>
        
        </div>
      `,
      confirmButtonText: `Filter`,
      confirmButtonColor: "#0e7490",
    });
    if (accept) {
      // Get selected options
      const propertyTypeValue = document.querySelector('select[name="propertyType"]').value;
      const locationValue = document.querySelector('select[name="location"]').value;
      const rateValue = document.querySelector('select[name="rate"]').value;
      const bedroomValue = document.querySelector('select[name="bedroom"]').value;
    
      // Convert selected options to actual values
      const selectedPropertyType = propertyType[propertyTypeValue];
      const selectedLocation = location[locationValue];
      const selectedRate = rate[rateValue];
      const selectedBedroom = bedroom[bedroomValue];
    
      // Set filter selections
      setFilterSelections({
        propertyType: selectedPropertyType,
        location: selectedLocation,
        rate: selectedRate,
        bedroom: selectedBedroom
      });

      // Set applied filters
      setAppliedFilters([
        { category: 'Type', value: selectedPropertyType },
        { category: 'Location', value: selectedLocation },
        { category: 'Rate', value: selectedRate },
        { category: 'Bedroom', value: selectedBedroom }
      ]);
    
      // Filter properties
      const filtered = properties.filter(property => 
        (selectedPropertyType === 'Any' || property.propertyType === selectedPropertyType) &&
        (selectedLocation === 'Any' || property.propertyLocation === selectedLocation) &&
        (selectedRate === 'Any' || property.propertyRate === selectedRate) &&
        (selectedBedroom === 'Any' || property.bedroom === selectedBedroom)
      );
    
      // Update filteredProperties state
      setFilteredProperties(filtered);
    }
  }

  const removeFilter = (index) => {
    // Remove filter
    const newAppliedFilters = appliedFilters.filter((_, i) => i !== index);
    setAppliedFilters(newAppliedFilters);
  
    // Update filter selections based on remaining filters
    let newFilterSelections = { propertyType: 'Any', location: 'Any', rate: 'Any', bedroom: 'Any' };
    newAppliedFilters.forEach(filter => {
      newFilterSelections[filter.category.toLowerCase()] = filter.value;
    });
    setFilterSelections(newFilterSelections);
  
    // Update filtered properties
    const filtered = properties.filter(property =>
      (newFilterSelections.propertyType === 'Any' || property.propertyType === newFilterSelections.propertyType) &&
      (newFilterSelections.location === 'Any' || property.propertyLocation === newFilterSelections.location) &&
      (newFilterSelections.rate === 'Any' || property.propertyRate === newFilterSelections.rate) &&
      (newFilterSelections.bedroom === 'Any' || property.bedroom === newFilterSelections.bedroom)
    );
    setFilteredProperties(filtered);
  };

  const handleHeartClick = async (property) => {
    console.log('Current user:', auth.currentUser); // Log the current user
    console.log('Property ID:', property.id); // Log the property ID

    // Toggle the favorite status of the property
    property.isFavorited = !property.isFavorited;
  
    // Update local state
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.map((fav) =>
        fav.id === property.id ? { ...fav, isFavorited: property.isFavorited } : fav
      );
      return updatedFavorites;
    });
  
    // Update Firestore document
    const favoritesDocRef = doc(db, 'favorites', `${auth.currentUser.uid}_${property.id}`);
    if (property.isFavorited) {
      await setDoc(favoritesDocRef, {
        userId: auth.currentUser.uid,
        propertyId: property.id,
        property: property,
      }).catch((error) => console.error('Error adding document: ', error));
    } else {
      await deleteDoc(favoritesDocRef).catch((error) => console.error('Error removing document: ', error));
    }
  };


  return (
    <>
      <SideMenu />
      <PropertyListContainer>
        <div className="header">
          <h1>Property Listings</h1>
          {userType === 'Renter' ? (
            <div className="typewriterContainer">
              <span className='typewriterSpan'>
                Want to enlist your own property?
              </span>
              <div className="typewriter">
                <p className='text' onClick={() => {
                    setShowModal(true);
                }}>Click here</p>
              </div>
            </div>
          ) : (
            registrationStatus !== 'hide' && registrationStatus !== 'confirmed'  && (
              <div className="typewriterContainer">
                <span className='typewriterSpan'>
                  {(registrationStatus === 'review' || registrationStatus === 'rejected' || registrationStatus === 'pending') ? 'Check registration status' : 'Want to enlist your own property?'}
                </span>
                <div className="typewriter">
                  <p className='text' onClick={() => {
                    if (registrationStatus === 'review' || registrationStatus === 'pending') {
                      Swal.fire({
                        icon: "info",
                        title: "Registration under review",
                        text: "Your registration is currently being reviewed. Please check back later.",
                      });
                    } else if (registrationStatus === 'confirmed') {
                      Swal.fire({
                        icon: "success",
                        title: "Registration confirmed",
                        text: "Your registration has been confirmed. Thank you for your patience.",
                      }).then(() => {
                        setRegistrationStatus('hide');
                      });
                    } else if (registrationStatus === 'rejected') {
                      const auth = getAuth();
                      const userId = auth.currentUser.uid;
                  
                      // Fetch the user data from Firestore
                      const fetchRejectedUser = async () => {
                        const db = getFirestore();
                        const userDoc = await getDoc(doc(db, "users", userId));
                        const userData = userDoc.data();
  
                        Swal.fire({
                            icon: "error",
                            title: "Registration rejected",
                            text: userData.rejectReason,
                            confirmButtonColor: "#0e7490",
                            confirmButtonText: "Reapply",
                            showCancelButton: true,
                        }).then(async (result) => {
                            if(result.isConfirmed){
                              await updateDoc(doc(db, "users", userId), {
                                registrationStatus: "pending"
                              });
                              Swal.fire({
                                icon: "info",
                                title: "You can now reapply",
                                confirmButtonColor: "#0e7490",
                              })
                            }
                        });
                      }
                      fetchRejectedUser();
                    } else {
                        setShowModal(true);
                    }
                  }}>Click here</p>
                </div>
              </div>
            )
          )}
          {showModal && <RegistrationModal closeModal={() => setShowModal(false)} onRegistrationSubmit={handleRegistrationSubmit} />}
        </div>
        
        <div className='searchSection'>
  
          <form onSubmit={handleSearchSubmit}><input type='text' placeholder='Search by property name'value={searchTerm}onChange={handleSearchChange}/>
            <button type="submit">Search</button>
          </form>
  
            <div className='filterSearch'>
              <button className='filterBtn'  onClick={handleFilter}><IoFilter  className='icon'/>Filter</button>
            </div>
  
            <div className='sortSearch'>
              <label htmlFor="sortBy">Sort By:</label>
              <select name="sortBy" onChange={handleSortChange}>
                <option value="0">Date New to Old</option>
                <option value="1">Date Old to New</option>
                <option value="2">Popularity</option>
                <option value="3">Price Low to High</option>
                <option value="4">Price High to Low</option>
              </select>
            </div>
  
            <div className='paginationSearch'>
              <Pagination count={Math.ceil(properties.length / itemsPerPage)} color='primary' onChange={handlePagination}>
              </Pagination>
            </div>
  
          </div>
  
          <div className="filterResultSection">
            {appliedFilters.map((filter, index) => (
              <div className="filterResult" key={index}>
                <span>{filter.category}: {filter.value}</span>
                <span className='closeBtn' onClick={() => removeFilter(index)}><IoCloseCircle/></span>
              </div>
            ))}
          </div>
  
  
          <div className='cardSection'>
            {filteredProperties.map((property, index) => {
              return(
                <PropertyCard key={index}>
                  <div className='propImage'>  
                    <img src={property.propertyImages[0]}></img>
                    <span className='propRate'>{property.propertyRate}/{property.rateType}</span>
                    <span className='starRate'><FaStar/><p>5 / 5</p></span>
                    <span 
                      className= 'heartBtn'
                      onClick={() => handleHeartClick(property)}
                      onMouseEnter={() => setIsHeartHovered(true)}
                      onMouseLeave={() => setIsHeartHovered(false)}
                    >
                      {property.isFavorited ? <FaHeart className='active'/> : <FaRegHeart/>}
                    </span>
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
                  <hr/>
  
                  <div className="propFooter">
                    <div className='footerDate'>
                      <span className='dateIcon'><LuCalendarClock /> </span>
                      <span>{property.addedAt && property.addedAt.toDate ? property.addedAt.toDate().toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <Link to={`./detail/${property.id}`}>See more</Link>
                  </div>
                </PropertyCard>
              )
            })}
          </div>
  
          <div className='bottomPaginationSearch'>
            <Pagination count={Math.ceil(properties.length / itemsPerPage)} color='primary' onChange={handlePagination}>
            </Pagination>
          </div>
  
        </PropertyListContainer>
      </>
    );
  }
  
  export default PropertyList;
  