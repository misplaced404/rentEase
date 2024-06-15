/* eslint-disable no-async-promise-executor */
/* eslint-disable no-unused-vars */
import {useState, useEffect} from 'react';
import Sidemenu from '../SideMenu/SideMenu';
import {RentManagementContainer, PropertyCard} from "./RentManagement.styled";
import { AiFillMessage } from "react-icons/ai";
import { LuCalendarClock } from "react-icons/lu";
import { FaCoins, FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import Swal from 'sweetalert2'; 
import withReactContent from 'sweetalert2-react-content';
import PaymentHistoryTable from './PaymentHistoryTable/PaymentHistoryTable';
import { doc, getDoc, getDocs, getFirestore, collection, addDoc, serverTimestamp, query, where, updateDoc, onSnapshot, deleteDoc, setDoc  } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { addMonths, addYears, addWeeks, addDays, format } from 'date-fns';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import RatingModal from "./RatingModal/RatingModal"
import { Link } from 'react-router-dom';



function RentManagement() {

  const [propertyData, setPropertyData] = useState(null);
  const [propertyToRate, setPropertyToRate] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [rentRequests, setRentRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('liked');
  const [isHeartActive, setIsHeartActive] = useState(false);
  const [isHeartHovered, setIsHeartHovered] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [rentedPropertyData, setRentedPropertyData] = useState(null);


  const db = getFirestore();
  const auth = getAuth();


  useEffect(() => {
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, 'favorites'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setFavorites(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.data().propertyId, isLiked: true })));
      });
      console.log('FAVORITES', favorites);
      // Clean up the subscription on unmount
      return () => unsubscribe();
    }
  }, []);
  
  

  useEffect(() => {
    const fetchUserRentRequests = async () => {
        const db = getFirestore();
        const auth = getAuth();
        const userId = auth.currentUser.uid;


        // Fetch renters data where the current user is the renter
        const rentersRef = collection(db, "renters");
        const q = query(rentersRef, where("userId", "==", userId));
        const rentersSnapshot = await getDocs(q);
        const rentersData = rentersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        console.log("Renters Data:", rentersData);

        // Fetch properties and users data for each renter
        const combinedRentRequests = await Promise.all(rentersData.map(async renter => {
            if (renter.propertyId && renter.applicationStatus === "Completed") { 
                const propertySnapshot = await getDoc(doc(db, "properties", renter.propertyId));
                const propertyData = propertySnapshot.data();
                console.log("Property data for renter:", propertyData);
                setRentedPropertyData(propertyData);

                const ownerSnapshot = await getDoc(doc(db, "users", propertyData.userId));
                const ownerData = ownerSnapshot.data();
                console.log("User data for renter:", ownerData);

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
                console.log(nextPaymentDueDate);

                return {
                    ...renter,
                    propName: propertyData.propertyName,
                    propertyLocation: propertyData.propertyLocation,
                    propertyAvailability: propertyData.propertyAvailability,
                    ownerName: ownerData.firstName,
                    ownerLastName: ownerData.lastName,
                    ownerAddress: propertyData.CurrentAddress,
                    ownerNum: propertyData.contactNum,
                    ownerEmail: propertyData.email,
                    propertyImage: propertyData && propertyData.propertyImages && propertyData.propertyImages.length > 0 ? propertyData.propertyImages[0] : null,
                    propertyType: propertyData.propertyType,
                    propertyRate: propertyData.propertyRate,
                    rateType: propertyData.rateType,
                    ownerId: propertyData.userId,
                    qrcodes: propertyData.qrCodes,
                    durationNum: renter.duration.number,
                    durationUnit: renter.duration.unit,
                    startDate: renter.startDate,
                    lastPaymentMade: renter.lastPaymentMade,
                    nextPaymentDue: nextPaymentDueDate ? format(nextPaymentDueDate, 'MM/dd/yyyy') : null,
                    
                };
            }
        }));

        // Filter out null values (which were renters for properties not owned by the current user)
        const filteredRentRequests = combinedRentRequests.filter(data => data !== undefined);
        setRentRequests(filteredRentRequests);

        console.log ("filtered rent reqs", filteredRentRequests );
    };
    fetchUserRentRequests();
  }, []);

 
  //payment History
  const handleHistory = () => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "Payment History",
      html: <PaymentHistoryTable />,
      showCloseButton: true,
      confirmButtonColor: "#0e7490",
      width: '800px', // Adjust this value as needed
    });
  }


 // Message Button
const handleMessage = (message = '') => {
  if (!rentedPropertyData) { // Change this line
    console.log("Rented property data is not available");
    return;
  }
  console.log("message props ", rentedPropertyData); // And this line
  let textareaValue = '';
  Swal.fire({
      input: "textarea",
      inputValue: message,
      inputLabel: rentedPropertyData ? `Send a Message to ${rentedPropertyData.propertyOwner}` : '', // Change this line
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
          let firstName = "";
          let lastName = "";

          // Fetch the recipientName using the rentedPropertyData.userId
          const db = getFirestore();
          const userRef = doc(db, 'users', rentedPropertyData.userId); // Change this line
          const userSnap = await getDoc(userRef); // Now you can use await here
          if (userSnap.exists()) {
              firstName = (userSnap.data().firstName);
              lastName = (userSnap.data().lastName);
          } else {
              console.log('No such user!');
          }
          const recipientName = firstName + " " + lastName;

          if (text) {
              return new Promise( async (resolve) => {
                  // Prepare the data to be stored in Firestore
                  const messageData = {
                      senderId: userId, // assuming you have the user's ID
                      senderName: userName,
                      recipientId: rentedPropertyData.userId, // Change this line
                      recipientName: recipientName, // pass the recipientName to the database
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
                      handleMessage();
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
                      handleMessage(textareaValue);
                  }
              })
          }
      }
  });
}

const handlePayment = async (request) => {
  const storage = getStorage();
  console.log("request", request.qrcodes);
  
  Swal.fire({
      title: "<h5 style='color:#0e7490'>" + "Pay using any of the QR Codes" + "</h5>",
      inputLabel: "Upload Proof of Payment Below",
      input: "file",
      html: `
      <div style="display: flex; justify-content: space-around; background-color: #efefef;">
          <img src="${request.qrcodes.onlineBankTransfer}" alt="Online Bank Transfer" style="flex: 1; height: 580px; width: auto; margin: 10px; ">
          <img src="${request.qrcodes.gcash}" alt="GCash" style="flex: 1; height: 580px; width: auto; margin: 10px; ">
      </div>
      `,
      imageWidth: 400,
      imageHeight: 500,
      imageAlt: "Custom image",
      confirmButtonText: 'Pay',
      confirmButtonColor: '#00b050',
      showCloseButton: true,
      showCancelButton: true,
      allowOutsideClick: false,
      inputAttributes: {
          "accept": "image/*",
          "aria-label": "Upload your profile picture"
      }
  }).then((result) => {
      if (result.value) {
          const file = result.value;
          const reader = new FileReader();
          reader.onload = (e) => {
              Swal.fire({
                  title: "Your uploaded picture",
                  imageUrl: e.target.result,
                  imageAlt: "The uploaded picture",
                  confirmButtonText: 'OK',
                  confirmButtonColor: '#0e7490',
                  showCancelButton: true,
              }).then(async(result) => {
                  if (result.isConfirmed) {
                      // Create a storage reference
                      const storageRef = ref(storage, 'payments/' + file.name);

                      // Upload the file to Firebase Storage
                      const uploadTask = uploadBytesResumable(storageRef, file);

                      // Listen for state changes, errors, and completion of the upload.
                      uploadTask.on('state_changed',
                          (snapshot) => {
                              // Get task progress by calling snapshot.bytesTransferred / snapshot.totalBytes
                          },
                          (error) => {
                              // Handle unsuccessful uploads
                              console.log(error);
                          },
                          () => {
                              // Handle successful uploads on complete
                              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                  console.log('File available at', downloadURL);

                                  // Update the status of the renter in Firestore
                                  const db = getFirestore();
                                  const docRef = doc(db, "renters", request.id);
                                  getDoc(docRef).then((docSnapshot) => {
                                      let paymentProofs = docSnapshot.data().paymentProof;
                                      let newPaymentProofs;

                                      // Check if paymentProofs is an array
                                      if (Array.isArray(paymentProofs)) {
                                          // If it is, add the new download URL to it
                                          newPaymentProofs = [...paymentProofs, downloadURL];
                                      } else if (typeof paymentProofs === 'string') {
                                          // If it's a string, this means it's the URL of the first image
                                          // So, convert it into an array containing the first and second image URLs
                                          newPaymentProofs = [paymentProofs, downloadURL];
                                      } else {
                                          // If it's not present, this means it's the first time the user is uploading an image
                                          // So, store the download URL directly
                                          newPaymentProofs = downloadURL;
                                      }

                                      updateDoc(docRef, {
                                          paymentProof: newPaymentProofs
                                      });

                                      // Create a new payment document in Firestore
                                      const paymentData = {
                                          renterId: request.userId,
                                          ownerId: request.ownerId,
                                          propertyId: request.propertyId,
                                          proof: downloadURL,
                                          timestamp: serverTimestamp()
                                      };
                                      addDoc(collection(db, "payments"), paymentData);
                                  });

                                  Swal.fire({
                                      icon: 'success',
                                      title: 'Upload Success!',
                                      confirmButtonText: 'OK',
                                      confirmButtonColor: '#0e7490',
                                  });
                              });
                          }
                      );
                  } else {
                      handlePayment(request); // Call the function again with the same request
                  }
              });
          };
          reader.readAsDataURL(file);
      }
  });
};

const handleRate = (propertyId) => {
  setPropertyToRate(propertyId);
  setIsRatingModalOpen(true);
};


  const closeModal = () => {
    setIsRatingModalOpen(false);
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  
  const handleHeartClick = async (propertyId) => {
    const db = getFirestore();
    const auth = getAuth();
  
    if (auth.currentUser && propertyId) {
      // Update local state
      setFavorites((prevFavorites) => {
        const updatedFavorites = prevFavorites.filter((fav) => fav.id !== propertyId);
        return updatedFavorites;
      });
  
      // Update Firestore document
      const favoritesDocRef = doc(db, 'favorites', `${auth.currentUser.uid}_${propertyId}`);
      await deleteDoc(favoritesDocRef).catch((error) => console.error('Error removing document: ', error));
    } else {
      console.error('Error: User is not authenticated or propertyId is undefined');
    }
  };
  
  
  

  return (
    <>
      {isRatingModalOpen && (
        <RatingModal closeModal={closeModal} propertyId={propertyToRate} />
      )}
      <Sidemenu/>
      <RentManagementContainer>
        <div className="header">
          <h1>Rent Management</h1>
        </div>
        <div className="body">
          <div className="tabContainer">
            <div className={`tab ${activeTab === 'liked' ? 'active' : ''}`} onClick={() => setActiveTab('liked')}>Liked Property</div>
            <div className={`tab ${activeTab === 'rented' ? 'active' : ''}`} onClick={() => setActiveTab('rented')}>Rented Property</div>
          </div>
          {activeTab === 'liked' && (
            <div className="likedCardsContainer">
              {favorites.map((favorite, index) => (
                <PropertyCard key={index}>
                    <div className='propImage'>  
                      <img src={favorite.property.propertyImages[0]}></img>
                      <span className='propRate'>{favorite.property.propertyRate}/Month</span>
                      <span className='starRate'><FaStar/><p>5 / 5</p></span>
                      <span 
                        className= 'heartBtn'
                        onMouseEnter={() => setIsHeartHovered(true)}
                        onMouseLeave={() => setIsHeartHovered(false)}
                        onClick={() => handleHeartClick(favorite.id)}
                      >
                        {favorite.isLiked ? <FaHeart className='active'/> : <FaRegHeart/>}
                      </span>
                    </div>
                    <div className='propInfo'>
                      <div className='propertyName'>{favorite.property.propertyName}</div>
                      <div className='location'>{favorite.property.propertyLocation}</div>
                      <div className='type'>{favorite.property.propertyType}</div>
                      <div className='amenities'>
                      {favorite.property.amenities.filter(amenity => amenity.checked).map((amenity, index, arr) => (
                        <span key={index}>
                          {amenity.name}
                          {index < arr.length - 1 && <span> | </span>}
                        </span>
                        ))}
                      </div>
                    </div>
                    <hr />
                    <div className="propFooter">
                      <div className='footerDate'>
                        <span className='dateIcon'><LuCalendarClock /> </span>
                        <span>{new Date(favorite.property.addedAt.seconds * 1000).toLocaleDateString()}</span>
                      </div>
                      <Link to={`../propertyList/detail/${favorite.id}`}>See more</Link> {/* Use favorite.id */}
                    </div>
                  </PropertyCard>
              ))}
            </div>
          )}
          <div className="rentedCardsContainer">
            {activeTab === 'rented' && rentRequests.map((request, index) => (
           
              <div className="rentCard" key={index}>
                <div className="rentCardBody">
                  <div className="col1">
                    <div className="imageContainer">
                      <img src={request.propertyImage} alt={request.propName}/>
                    </div>
                    <h2>{request.propName}</h2>
                    <h3>{request.propertyLocation}</h3>
                    <span>{request.propertyType}</span>
                  </div>
                  <div className="col2">
                    <h2>Property Owner Information</h2>
                    <div className="infoSection">
                      <span>Property Owner:</span>
                      <p>{request.ownerName} {request.ownerLastName}</p>
                    </div> 
                    <div className="infoSection">
                      <span>Contact Number:</span>
                      <p>{request.ownerNum}</p>
                    </div>   
                    <div className="infoSection">
                      <span>Email Address:</span>
                      <p>{request.ownerEmail}</p>
                    </div>  
                    <h2>My Information</h2>
                    <div className="infoSection">
                      <span>Duration of Stay:</span>
                      <p>{request.durationNum} {request.durationUnit}</p>
                    </div>  
                    <div className="infoSection">
                      <span>Rent Start Date:</span>
                      <p>{request.startDate}</p>
                    </div>  
                    <div className="infoSection">
                      <span>Payment Due:</span>
                      <p>{request.nextPaymentDue}</p>
                    </div> 
                    <div className="infoSection">
                      <span>Last Payment Made:</span>
                      <p>{request.lastPaymentMade}</p>
                    </div>
                    <a className='history' onClick={handleHistory}>Click here to see Payment History</a>
                  </div>
                </div>
                <div className="rentCardFooter">
                  <div className="actionBtn">
                    <button className='message' onClick={handleMessage}><AiFillMessage className='icon'/>Message</button>
                    <button className='pay' onClick={() => handlePayment(request)}><FaCoins className='icon'/>Pay Rent</button>
                    <button className='rate' onClick={() => handleRate(request.propertyId)}><FaStar className='icon'/>Rate</button>
                  </div>
                </div>
              </div>
            
            ))}
          </div>
        </div>
      </RentManagementContainer>
    </>
);

}


export default RentManagement;