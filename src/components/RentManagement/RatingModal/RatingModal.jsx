/* eslint-disable no-unused-vars */
import {useState, useEffect} from 'react'
import ReactStars from "react-rating-stars-component";
import { FaStar, FaStarHalfAlt, FaRegStar  } from "react-icons/fa";
import {RatingModalContainer} from "./RatingModal.styled"
import Swal from 'sweetalert2'; 
import { doc, getDoc, getDocs, getFirestore, collection, addDoc, query, where, Timestamp  } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


function RatingModal({ closeModal, propertyId  }) {

  console.log("THE PROPERTY ID BEING PASSED:", propertyId);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [rentRequests, setRentRequests] = useState([]);



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
                let propertyData = null;
                if (renter.propertyId && renter.applicationStatus === "Completed") { 
                    const propertySnapshot = await getDoc(doc(db, "properties", renter.propertyId));
                    propertyData = propertySnapshot.data();
                    console.log("Property data for renter:", propertyData);
    
                    const ownerSnapshot = await getDoc(doc(db, "users", propertyData.userId));
                    const ownerData = ownerSnapshot.data();
                    console.log("User data for renter:", ownerData);
                }
                return {
                    ...renter,
                    propName: propertyData ? propertyData.propertyName : null,
                };
            }));
    
            // Filter out null values (which were renters for properties not owned by the current user)
            const filteredRentRequests = combinedRentRequests.filter(data => data !== undefined);
            setRentRequests(filteredRentRequests);
    
            console.log ("filtered rent reqs", filteredRentRequests );
        };
        fetchUserRentRequests();
    }, []);

    const ratingChanged = (newValue) => {
        setRating(newValue);
        console.log(rating);
    };
    
    const propertyRating = {
        count: 5 ,
        size: 54,
        isHalf: true,
        emptyIcon: <FaRegStar />,
        halfIcon: <FaStarHalfAlt/>,
        fullIcon: <FaStar/>,
        activeColor:"#ffd700",
        onChange: ratingChanged
    }
    
    const handleRate = async () => {
        const db = getFirestore();
        const auth = getAuth();
        const user = auth.currentUser;
      
        if (comment === "") {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill in the comment to proceed!',
            confirmButtonColor: " #0e7490",
          });
        } else {
          // Add the rating and comment to the 'ratings' collection
          const ratingsCollectionRef = collection(db, 'ratings');
          await addDoc(ratingsCollectionRef, {
            rating: rating,
            comment: comment,
            propertyId: propertyId, // Use the propertyId from the button click
            userId: user.uid, // Add the user ID

            date: Timestamp.now(), // Add the current date and time
            // Add any other fields you need here
          }).catch((error) => console.error('Error adding document: ', error));
      
          Swal.fire({
            title: "Success!",
            icon: "success",
            confirmButtonColor: " #0e7490",
            text: "Thank you for rating! :)",
          }).then(result => {
            closeModal();
          });
        }
      };
      

      return (
        <RatingModalContainer onClick={closeModal}>
          <div className="modalContainer" onClick={(e) => e.stopPropagation()}>
            <div className='header'>
              <h3>Please Rate Your Experience</h3>
              <p>How was your experience</p> 
            </div>
            <div className='starRating'>
              <ReactStars {...propertyRating} />
            </div>
            <div>
              <textarea name="comments" className="comments" id="" cols="70" rows="5" placeholder='Enter your comments here' onChange={e => setComment(e.target.value)}></textarea>
            </div>  
            <div className='actions'>
              <button className='rate' onClick={() => handleRate(propertyId)}>Rate</button>
              <button className='cancel' onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </RatingModalContainer>
      )
}

export default RatingModal
