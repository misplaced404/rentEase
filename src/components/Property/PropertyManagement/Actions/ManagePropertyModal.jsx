/* eslint-disable no-async-promise-executor */
import {useRef, useEffect, useState} from 'react'
import { ManagePropertyContainer } from './ManageProperty.styled';
import { IoIosClose } from "react-icons/io";
import { RiIndeterminateCircleFill } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { BiSolidDownload } from "react-icons/bi";
import { FaChevronRight, FaChevronDown  } from "react-icons/fa"
import { getFirestore, collection, getDoc, getDocs, doc, where, query, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Swal from 'sweetalert2'; 
import { addMonths, addYears, addWeeks, addDays, format } from 'date-fns';


// eslint-disable-next-line react/prop-types
function ManagePropertyModal({closeModal, propertyId}) {
  console.log('ID', propertyId);
  const modalRef = useRef(); // Create a ref
  const [combinedData, setCombinedData] = useState([]);
  const [visibleRenterId, setVisibleRenterId] = useState(null);


  const handleClickOutside = (event) => {
    // Get the SweetAlert2 popup
    const swalPopup = Swal.getPopup();
  
    // Check if the click is outside the modal and not within the SweetAlert2 popup
    if (modalRef.current && !modalRef.current.contains(event.target) && (!swalPopup || !swalPopup.contains(event.target))) {
      closeModal(false); // Close the modal if clicked outside
    }
  };
  
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  

  const handleViewDetailsClick = (renterId) => {
    if (visibleRenterId === renterId) {
      setVisibleRenterId(null); // If the renter's details are currently visible, hide them
    } else {
      setVisibleRenterId(renterId); // Otherwise, show them
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
        const db = getFirestore();
        const auth = getAuth();
        const userId = auth.currentUser.uid;
    
        // Fetch renters data for the specific property
        const rentersSnapshot = await getDocs(query(collection(db, "renters"), where("applicationStatus", "==", "Completed"), where("propertyId", "==", propertyId)));
        const rentersData = rentersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("RENTERS DATA:", rentersData);
    
        // Fetch properties and users data for each renter
        const combinedData = await Promise.all(rentersData.map(async renter => {
            if (renter.propertyId) { 
                const propertySnapshot = await getDoc(doc(db, "properties", renter.propertyId));
                const propertyData = propertySnapshot.data();
            
            console.log("PROPERTY DATA FOR RENTER:", propertyData);
    
                // If the current user is not the owner of the property, skip this renter
                if (propertyData.userId !== userId) {
                    return null;
                }
    
                const userSnapshot = await getDoc(doc(db, "users", renter.userId));
                const userData = userSnapshot.data();
                console.log("USER DATA FOR USER:", userData);

                let nextPaymentDueDate;
                const lastPaymentMadeDate = new Date(renter.lastPaymentMade);

                switch (propertyData.rateType) {
                  case 'Yearly':
                    nextPaymentDueDate = addYears(lastPaymentMadeDate, 1);
                    break;
                  case 'Monthly':
                    nextPaymentDueDate = addMonths(lastPaymentMadeDate, 1);
                    break;
                  case 'Weekly':
                    nextPaymentDueDate = addWeeks(lastPaymentMadeDate, 1);
                    break;
                  case 'Daily':
                    nextPaymentDueDate = addDays(lastPaymentMadeDate, 1);
                    break;
                  default:
                    console.log('Invalid rate type');
                }

    
                return {
                    ...renter,
                    propertyName: propertyData.propertyName,
                    propertyLocation: propertyData.propertyLocation,
                    propertyAvailability: propertyData.propertyAvailability,
                    renterName: userData.firstName,
                    renterLastName: userData.lastName,
                    renterAddress: userData.CurrentAddress,
                    renterNum: userData.contactNum,
                    renterEmail: userData.email,
                    renterImage: propertyData.propertyImages[0],
                    propertyType: propertyData.propertyType,
                    propertyRate: propertyData.propertyRate,
                    rateType: propertyData.rateType,
                    durationNum: renter.duration.number,
                    durationUnit: renter.duration.unit,
                    occupation: renter.occupation,
                    startDate: renter.startDate,
                    lastPaymentMade: renter.lastPaymentMade,
                    nextPaymentDue: nextPaymentDueDate ? format(nextPaymentDueDate, 'MM/dd/yyyy') : null,
                    
                };
            }
        }));
    
        // Filter out null values (which were renters for properties not owned by the current user)
        const filteredCombinedData = combinedData.filter(data => data !== null);
    
        setCombinedData(filteredCombinedData);

        console.log("FILTERED COMBINED",filteredCombinedData)
    };
    
    fetchTransactions();
}, [propertyId]);


const handleNotice = () => {
  event.stopPropagation();
  Swal.fire({
    title: "Are you sure?",
    text: "The notice of eviction will be sent to the specific renter!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, sent it!"
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Success!",
        text: "The notice has been sent.",
        icon: "success"
      });
    }
  });
}

// Message Button
const handleMessage = (renter, message = '') => {
  let textareaValue = '';
  Swal.fire({
    input: "textarea",
    inputValue: message,
    inputLabel: `Send a Message to ${renter.renterName} ${renter.renterLastName}`,
    inputPlaceholder: "Type your message here...",
    confirmButtonText: 'Send',
    confirmButtonColor: '#006AFF',
    inputAttributes: {
      "aria-label": "Type your message here"
    },
    showCloseButton: true,
    showCancelButton: true,
    allowOutsideClick: false,
    willClose: () => {
      textareaValue = Swal.getInput().value;
    },
    preConfirm: async (text) => { // Make this function async
      const auth = getAuth();
      const user = auth.currentUser
      const userId = user.uid;
      const userName = user.displayName;

      if (text) {
        return new Promise( async () => {
          // Prepare the data to be stored in Firestore
          const messageData = {
            senderId: userId, // assuming you have the user's ID
            senderName: userName,
            recipientId: renter.userId, 
            recipientName: `${renter.renterName} ${renter.renterLastName}`, // pass the recipientName to the database
            message: text, // the message text
            sentTime: serverTimestamp()
          };
          console.log(messageData);

          // Get a reference to the Firestore database
          const db = getFirestore();

          // Store the message data in Firestore
          try {
            await addDoc(collection(db, "messages"), messageData);
            Swal.fire({
              title: 'Success!',
              text: 'Your message has been sent.',
              icon: 'success',
              confirmButtonText: 'Okay',
              confirmButtonColor: '#0e7490',
            })
          } catch (e) {
            Swal.fire({
              title: 'Failed!',
              text: 'Sending failed, please try again later',
              icon: 'error',
              confirmButtonText: 'Okay',
              confirmButtonColor: '#0e7490',
            })
          }
      
        });
      }
      else {
        return new Promise((resolve) => {
          Swal.fire('Notice!', 'Message is empty.', 'warning').then(() => {
            resolve(text);
          }).then(() => {
            handleMessage(renter);
          });
        });
      }
    },
    didClose: () => {
      if (textareaValue) {
        Swal.fire({
          title: 'Are you sure?',
          text: "Your message will not be saved.",
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText: "Go back",
          confirmButtonColor: '#d33',
          confirmButtonText: 'Yes, discard it!'
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: 'Cancelled!',
              text: 'Your message has been discarded.',
              icon: 'error',
              confirmButtonText: 'Okay',
              confirmButtonColor: '#0e7490',
            })
          }
          else{
            handleMessage(renter, textareaValue);
          }
        })
      }
    }
  });
}


  return (
    <ManagePropertyContainer >
      <div className="modalContainer" ref={modalRef}>
        <div className="modalHeader">
          <h1>Manage Renters</h1>
          <button onClick={() => closeModal(false)}><IoIosClose className='closeBtn'/></button>
        </div>
        <div className="modalBody">
          <div className='table'>
            <div className='tableHeader'>
              <div className='tableRow'>
                <div className='tableHead first'>Renter Name</div>
                <div className='tableHead'>Contact Number</div>
                <div className='tableHead'>Email</div>
                <div className='tableHead'>Rate</div>
                <div className='tableHead'>Duration Of Stay</div>
                <div className='tableHead last'>Actions</div>
              </div>
            </div>
            <div className='tableBody'>
              {combinedData.map((renter, index) => (
                <div className="paymentContainer" key={index}>
                  <div className='tableRow'>
                  <div className='tableData'>{renter.renterName} {renter.renterLastName}</div>
                  <div className='tableData'>{renter.renterNum}</div>
                  <div className='tableData'>{renter.renterEmail}</div>
                  <div className='tableData'>{renter.propertyRate}/{renter.rateType}</div>
                  <div className='tableData'>{renter.durationNum} {renter.durationUnit}</div>
                  <div className='tableData actionBtn'>
                  {visibleRenterId !== renter.id && <button className='view' onClick={() => handleViewDetailsClick(renter.id)}>View Details<FaChevronRight className='icon'/></button>}
                  {visibleRenterId === renter.id && <button className='hideView' onClick={() => handleViewDetailsClick(renter.id)}>Hide Details<FaChevronDown  className='icon'/></button>}
                  </div>
                </div>
                {visibleRenterId === renter.id && (
                  <div className="moreInfo">
                    <div className='paymentLog'>
                      <div className='paymentTableHeader'>
                        <div className='paymentTableRow'>
                          <div className='tableHead'>Due Date</div>
                          <div className='tableHead'>Date of Payment</div>
                          <div className='tableHead'>Proof of Payment</div>
                        </div>
                      </div>
                      <div className='paymentTableBody'>
                        {(Array.isArray(renter.paymentProof) ? renter.paymentProof : [renter.paymentProof]).map((proof, proofIndex) => (
                          <div className="paymentTableRow" key={`${index}-${proofIndex}`}>
                            <div className='tableData'>{renter.nextPaymentDue}</div>
                            <div className='tableData'>{renter.lastPaymentMade}</div>
                            <div className='tableData'>
                              <button className='download' onClick={() => window.open(proof)}><BiSolidDownload/></button>
                            </div>
                          </div>
                        ))}
                      </div> {/* end of tableBody */}
                    </div>
                  <div className="renterInfo">
                    <h1>Renter Information</h1>
                    <div className='info'>
                      <span>Renter Address:</span>
                      <p>{renter.renterAddress}</p>
                    </div>
                    <div className='info'>
                      <span>Occupation:</span>
                      <p>{renter.occupation}</p>
                    </div>
                    <div className='info'>
                      <span>Rent Start Date:</span>
                      <p>{renter.startDate}</p>
                    </div>
                    <div className='info'>
                      <span>Current Rent Due Date:</span>
                      <p>{renter.nextPaymentDue}</p>
                    </div>

                    <div className="additionalBtn">
                    <button className='message' onClick={() => handleMessage(renter)}><AiFillMessage className='icon'/>Message</button>
                      <button className='notice' onClick={handleNotice}><RiIndeterminateCircleFill className='icon'/>Notice!</button>
                    </div>
                  </div>
                </div>
                )}
              </div>
              ))}
            </div>
          </div>
        </div>
    </div>

    </ManagePropertyContainer>
  )
}


export default ManagePropertyModal;