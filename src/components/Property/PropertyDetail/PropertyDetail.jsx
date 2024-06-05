/* eslint-disable no-async-promise-executor */
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import SideMenu from '../../SideMenu/SideMenu';
import {PropertyListContainer, Carousel, PropertyInfo, ReviewArea} from './PropertyDetail.styled'
import * as IoIcons from 'react-icons/io';
import { FaCheck, FaRegHeart, FaHeart, FaStar } from "react-icons/fa";
import { BsFillHouseAddFill, BsFillHouseExclamationFill } from "react-icons/bs";
import { AiFillMessage } from "react-icons/ai";
import { LiaMapMarkedAltSolid } from "react-icons/lia"
import Swal from 'sweetalert2'; 
import { useCallback } from 'react';
import { doc, getDoc, getDocs, getFirestore, collection, addDoc, serverTimestamp, query, where, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import  RegistrationContext from '../../../context/RegistrationContext';



function PropertyDetail(){

    const db = getFirestore();
    const auth = getAuth();

    const [propertyData, setPropertyData] = useState(null);
    const { id } = useParams(); 
    const [propertyId, setPropertyId] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLiked, setIsLiked]  = useState(false);
    const [reviews, setReviews] = useState([]);

    const slideShow = useRef(null);
    const slides = propertyData?.propertyImages || [];
    const prev = () => {
        setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
    };
    const next = useCallback(() => {
        setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
    }, [currentSlide, slides.length]);


    useEffect(() => {
        const fetchData = async () => {
          const db = getFirestore();
          const docRef = doc(db, "properties", id); // Use the id from the URL
          const docSnap = await getDoc(docRef);
    
          if (docSnap.exists()) {
            setPropertyData(docSnap.data());
            setPropertyId(id); 
            console.log("setPropertyData!", propertyData);
          } else {
            console.log("No such document!");
          }
        };
    
        fetchData();
    }, [id]); // Add id as a dependency
      
    useEffect(() => {
        // Set the interval
        const slideInterval = setInterval(() => {
          next(); // Call the next function every 3 seconds
        }, 3000);
      
        // Clear interval on component unmount
        return () => {
          clearInterval(slideInterval);
        };
    }, [next]);

    useEffect(() => {
    }, [propertyId]);


    const handleContract = (propertyId) =>{
        const swalContract = Swal.mixin({
            confirmButtonColor: '#0e7490',
        });
    
        swalContract.fire({
            title: 'Contract Acknowledgement',
            html: `
                Please read the Contract by clicking on the link below</br></br>
                <a href="${propertyData.propertyContract}" target="_blank" style="color: blue; text-decoration: underline;">Contract Link Here</a>
            `,
            input: "checkbox",
            inputValue: 0,
            inputPlaceholder: `
                I agree with the terms and conditions
            `,
            showCancelButton: true,
            preConfirm: (value) => {
                if (!value) {
                    Swal.showValidationMessage('You must agree with the terms and conditions');
                }
            }
    
        }).then((result) => {
            if (result.isConfirmed) {
                handleRenter(propertyId);
            }
        })
    }


    // for Renter Application
    const handleRenter = (propertyId) => {
        console.log(propertyId);
        const swalWithCondition = Swal.mixin({
          confirmButtonColor: '#0e7490',
        });
      
        swalWithCondition.fire({
          title: 'Apply As Renter?',
          icon: 'warning',
          showCloseButton:true,
          html: `
            <style>
                .container{
                    display: flex; 
                    flex-direction: column; 
                    gap: 20px;
                }
    
                .occupation{
                    display: flex; 
                    align-items: center; 
                    gap:10px;
    
                    select{
                        width: 262px;
                    }
                }
    
                .durationSection{
                    display: flex; 
                    align-items: center; 
                    gap:10px;
                }
    
                .startDate{
                    display: flex; 
                    align-items: center; 
                    gap:10px;
                }
    
                .occupationDropDown, .durationUnit{
                    padding: 5px 10px;
                    border: 2px solid #0e7490; 
                    border-radius:10px;
                }
    
                .occupation, .durationSection, .startDate{
                    label{
                        flex-basis: 160px;
                        text-align: left;
                    }
                }
    
                .date{
                    border: 2px solid #0e7490;
                    border-radius:10px;
                    margin:0px;
                    width: 262px;
                }
    
                .durationNum{
                    width: 80px;
                    height: 47.25px !important;
                    padding: 5px 10px;
                    border: 2px solid #0e7490;
                    margin:0px;
                    border-radius:10px;
                }

                .durationUnit{
                    width: 180px;
                }

            </style>
            <div class="container">
                <div class="occupation">
                    <label htmlFor='occupation'>Current Occupation</label>
                    <select id="occupation" name="occupation" class="swal2-input occupationDropDown">
                        <option value="">Please choose here</option>
                        <option value="student">Student</option>
                        <option value="employee">Employee</option>
                        <option value="self-employed">Self-Employed</option>
                    </select>
                </div>
                <div class="startDate">
                    <label htmlFor='startDate'>Rent Start Date</label>
                    <input type="date" id="startDate" class="swal2-input date"/>
                </div>
                <div class="durationSection">
                    <label htmlFor='durationNumber'> Duration of Stay</label>
                    <div>
                        <input id="durationNumber" name="durationNumber" class="swal2-input durationNum" type="number" min="1" >
                        <select id="durationUnit" name="durationUnit"  class="swal2-input durationUnit" style="padding: 5px 10px;border: 2px solid #0e7490; border-radius:10px;">
                            <option value="">Choose here</option>
                            <option value="month">Month(s)</option>
                            <option value="year">Year(s)</option>
                        </select>
                    </div>
                </div>
            </div>
          `,
          focusConfirm: false,

          preConfirm: async () => {
            const occupation = document.getElementById('occupation').value;
            const startDate = document.getElementById('startDate').value;
            const durationNumber = document.getElementById('durationNumber').value;
            const durationUnit = document.getElementById('durationUnit').value;
            
            const auth = getAuth();
            const userId = auth.currentUser.uid;
            const email = auth.currentUser.email;


            if (!occupation || !startDate || !durationNumber || !durationUnit) {
            Swal.showValidationMessage('Please fill out all fields');
            return false;
            }

            // Prepare the data to be stored in Firestore
            const data = {
                applicationStatus: 'Pending',
                email,
                userId,
                propertyId: propertyId,
                occupation,
                startDate,
                duration: {
                    number: durationNumber,
                    unit: durationUnit,
                },
            };

            // Get a reference to the Firestore database
            const db = getFirestore();

            // Check if the user is the owner of the property
            const propertyDoc = await getDoc(doc(db, "properties", propertyId));
            if (propertyDoc.exists() && propertyDoc.data().userId === userId) {
                Swal.showValidationMessage('You are the owner of this property and cannot send a rent request');
                return false;
            }

            // Check property availability
            let { propertyAvailability } = propertyDoc.data();
            if (propertyAvailability <= 0) {
                Swal.showValidationMessage('This property is not available as of the moment');
                return false;
            }

            // Check if a request already exists
            const querySnapshot = await getDocs(query(collection(db, "renters"), where("userId", "==", userId), where("propertyId", "==", propertyId)));
            if (!querySnapshot.empty) {
                Swal.showValidationMessage('You have already sent a rent request for this property');
                return false;
            }

            // Store the data in Firestore and update property availability
            try {
                const db = getFirestore();
                const rentersCollection = collection(db, "renters");
                const docRef = await addDoc(rentersCollection, data);
                console.log("Document written with ID: ", docRef.id);

                // Subtract 1 from the property availability
                const propertyDocRef = doc(db, "properties", propertyId);
                await updateDoc(propertyDocRef, { propertyAvailability: propertyAvailability - 1 });
            } catch (e) {
                console.error("Error adding document: ", e);
            }

            return true;
        },

        showCancelButton: true,
        confirmButtonText: 'Apply',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
              swalWithCondition.fire({
                title: 'Success!',
                text: 'Application Sent.',
                icon: 'success'
              });
            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
              swalWithCondition.fire({
                title: 'Cancelled',
                text: 'Application Cancelled',
                icon: 'error'
              });
            }
        });
        setTimeout(() => {
            const durationNumberInput = document.getElementById('durationNumber');
            durationNumberInput.addEventListener('input', function (e) {
              if (this.value.length > 2) {
                this.value = this.value.slice(0,2);
              }   
            });
          }, 0);
    };
    

    // Message Button
    const handleMessage = (message = '') => {
        let textareaValue = '';
        Swal.fire({
            input: "textarea",
            inputValue: message,
            inputLabel: `Send a Message to ${propertyData.propertyOwner}`,
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

                // Fetch the recipientName using the propertyData.userId
                const db = getFirestore();
                const userRef = doc(db, 'users', propertyData.userId);
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
                            recipientId: propertyData.userId, 
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

    useEffect(() => {
        const fetchReviews = async () => {
          const db = getFirestore();
    
          // Fetch reviews data where the propertyId is the same as the current property
          const reviewsRef = collection(db, "ratings");
          const q = query(reviewsRef, where("propertyId", "==", propertyId));
          const reviewsSnapshot = await getDocs(q);
          const reviewsData = reviewsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
    
          setReviews(reviewsData);
        };
    
        fetchReviews();
      }, [propertyId]);

      useEffect(() => {
        const loadPropertyDetails = async () => {
          const db = getFirestore();
          const auth = getAuth();
    
          if (auth.currentUser) {
            const docRef = doc(db, 'favorites', `${auth.currentUser.uid}_${propertyId}`);
            const docSnapshot = await getDoc(docRef);
    
            setIsLiked(docSnapshot.exists());
          }
        };
    
        loadPropertyDetails();
      }, [propertyId]);
    

      const handleLike = async () => {
        const db = getFirestore();
        const auth = getAuth();
    
        if (auth.currentUser) {
          const docRef = doc(db, 'favorites', `${auth.currentUser.uid}_${propertyId}`);
    
          if (isLiked) {
            // If the property is currently liked, remove it from favorites
            await deleteDoc(docRef);
          } else {
            // If the property is not currently liked, add it to favorites
            await setDoc(docRef, {
              userId: auth.currentUser.uid,
              propertyId: propertyId,
            });
          }
    
          // Toggle the isLiked state
          setIsLiked(!isLiked);
        }
      };



  return (
    <>  
        <SideMenu/>
        <PropertyListContainer>
            <div>
                <Link to={'/propertyList'} className='backLink'><IoIcons.IoIosArrowRoundBack className='backLinkIcon'/> Property Listings</Link>
            </div>
            <div className="header">
                <h1>Property Details</h1>
                <div className="headerButtons">
                    { propertyData?.propertyContract !== null ?
                    <button className='renter' onClick={() => handleContract(propertyId)}><BsFillHouseAddFill className='headerIcon'/>Apply as Renter</button>
                    :
                    <button className='renter' onClick={() => handleRenter(propertyId)}><BsFillHouseAddFill className='headerIcon'/>Apply as Renter</button>
                    }
                    <button className='message' onClick={handleMessage}><AiFillMessage className='headerIcon'/>Message</button>

                    <button className='like' onClick={handleLike}>
                    {isLiked ? <FaHeart className='headerIcon'/> : <FaRegHeart className='headerIcon'/>}
                    {isLiked ? 'Liked' : 'Like'}
                    </button>

                </div>
            </div>
            <div className='detailBody'>
                <div className='firstSection'>
                <Carousel>  
                    <div className='slider' ref={slideShow}>
                        {propertyData?.propertyImages.map((s, idx) => (
                            <img
                                src={s}
                                key={idx}
                                className={
                                idx === currentSlide
                                    ? "slideImage slide-visible"
                                    : idx === (currentSlide + 1) % propertyData?.propertyImages.length
                                    ? "slideImage slide-next"
                                    : "slideImage"
                                }
                            />
                        ))}
                        <span className='indicators'> 
                            {propertyData?.propertyImages.map((_, idx) => {
                                return(
                                    <button key={idx} onClick={() => setCurrentSlide(idx)} className={currentSlide==idx? "indicator" : "indicator indicator-inactive"}></button>
                                );
                            })}
                        </span>
                    </div>
                    <div className='slideBtn'>
                        <button className='slideBtnBack' onClick={prev}><IoIcons.IoIosArrowBack className='arrowBack'/></button>
                        <button className='slideBtnForward' onClick={next}><IoIcons.IoIosArrowForward className='arrowForward'/></button>
                    </div>
                </Carousel>

                <ReviewArea>
                    <div className="reviewHeader">
                        <div className="title">
                            Review Section
                        </div>
                        <div className="starRating">
                            <FaStar className='icon' />
                            <span>5 / 5</span>
                        </div>
                    </div>
                    
                    <div className="reviewBody">
                    {reviews.length === 0 ? (
                        <div className='emptyReview'>
                        <FaStar className='icon'/>
                        <span>No Reviews Yet</span>
                        </div>
                    ) : (
                        reviews.map(review => (
                        <div key={review.id} className="reviewEntry">
                            <div className='userRate'>
                            <span className='userName'>Anonymous</span>
                            <div className='rating'>
                                {[...Array(5)].map((star, i) => {
                                const ratingValue = i + 1;
                                return (
                                    <FaStar
                                    key={i}
                                    className='icon'
                                    color={ratingValue <= review.rating ? "#ffd700" : "#e4e5e9"}
                                    />
                                );
                                })}
                            </div>
                            </div>
                            <span className='message'>{review.comment}</span>
                        </div>
                        ))
                    )}
                    </div>
                </ReviewArea>


                </div>

                <div className='secondSection'>
                    <PropertyInfo>
                        <div className='propertyInfoHeader'>
                            <h2>Property Information</h2>
                        </div>
                        <div className='body'>
                            <h3>Basic Information</h3>
                            <div className="infoSection">
                                <div className="infoSectionField">
                                    <span>Owner:</span>
                                    <p>{propertyData?.propertyOwner}</p>
                                </div>
                                <div className="infoSectionField">
                                    <span>Property Name:</span>
                                    <p>{propertyData?.propertyName}</p>
                                </div>
                                <div className="infoSectionField">
                                    <span>Type:</span>
                                    <p>{propertyData?.propertyType}</p>
                                </div>
                                <div className="infoSectionField">
                                    <span>Location:</span>
                                    <p>{propertyData?.propertyLocation}</p>
                                </div>
                                <div className="infoSectionField">
                                    <span>Rate:</span>
                                    <p>{propertyData?.propertyRate}/{propertyData?.rateType}</p>
                                </div>
                                <div className="infoSectionField">
                                    <span>Availability:</span>
                                    <p>{propertyData?.propertyAvailability}</p>
                                </div>
                                <div className="infoSectionField">
                                    <span>Description:</span>
                                    <p className='description'>{propertyData?.propertyDescription}</p>
                                </div>
                            </div>
                            
                            <div className="infoSection special">
                                <div className="sub1">
                                    <h3>Contact Information</h3>
                                    <div className="infoSectionField">
                                        <span>Mobile Number:</span>
                                        <p>{propertyData?.contactNum}</p>
                                    </div>
                                    <div className="infoSectionField">
                                        <span>Email Address:</span>
                                        <p>{propertyData?.email}</p>
                                    </div>
                                </div>
                                <div className="sub2">
                                    <h3>Payment Method</h3>
                                    {propertyData?.qrCodes.onlineBankTransfer && <div className="Payment"><FaCheck />Online Bank Transfer(QR Code)</div>}
                                    {propertyData?.qrCodes.gcash && <div className="Payment"><FaCheck />Gcash</div>}
                                </div>
                            </div>

                            <div className="amenitiesSection">
                                <h3>Amenities</h3>

                                {(!propertyData || !propertyData.amenities || propertyData.amenities.length === 0) ? 
                                 <div className='noAmenities'>
                                    <BsFillHouseExclamationFill className='icon'/>
                                    <p>Property Has No Amenities</p>
                                </div>
                                :
                                <div className="amenitiesBody">
                                    {propertyData.amenities.map((a, index) => {
                                        return(
                                            <div className='amenitiyItem' key={index}>
                                                <FaCheck className='icon'/>
                                                <p>{a.name}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                                }
                            </div>

                            <div className="mapsInfoSection">
                                <button className='maps' onClick={() => {
                                    window.open(propertyData.mapLocation, '_blank');
                                }}>
                                    <LiaMapMarkedAltSolid className='mapIcon' />See Location On Google Maps
                                </button>
                            </div>
                        </div>
                    </PropertyInfo>
                </div>
            </div>
        </PropertyListContainer>
    </>
  )
}


export default  PropertyDetail;