/* eslint-disable no-unused-vars */
import Swal from 'sweetalert2';
import { getFirestore, collection, getDoc, getDocs,addDoc, doc, updateDoc, deleteDoc, serverTimestamp} from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { sendEmail } from '../../../Transaction/Actions/Notifications';




export const handleViewUser = async (userId) => {
    // Get the Firestore instance
    const db = getFirestore();
    // Get the current user document
    const userDoc = doc(db, "users", userId);
    // Fetch the current user data
    const userRef = await getDoc(userDoc);
    const userData = userRef.data();

    Swal.fire({
        title: "User Details",
        confirmButtonColor: '#0e7490',
        showCloseButton: true,
        width: "auto",
        html:
        `
            <style> 
                .container{
                    min-width: 500px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }

                .BasicInfo{
                    width: 100%;
                    margin: 5px 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                }

                .infoField{
                    width:100%;
                    display: flex;
                    align-items: flex-start;
                    text-align: left;
                    flex-wrap: wrap;

                    .label{
                        color:#0e7490;
                    }
                    
                    span{
                        text-align: left;
                        min-width: 170px;
                    }
                }

            </style>

            <div class="container">
                <div class="BasicInfo">
                    <div class="infoField">
                        <span class="label">User Name:</span>
                        <span>${userData.firstName+ " " + userData.lastName}</span>
                    </div>
                    <div class="infoField">
                        <span class="label">Contact Number:</span>
                        <span>${userData.contactNum}</span>
                    </div>
                    <div class="infoField">
                        <span class="label">Email Address:</span>
                        <span>${userData.email}</span>
                    </div>
                    <div class="infoField">
                        <span class="label">Current Address:</span>
                        <span>${userData.CurrentAddress}</span>
                    </div>
                    <div class="infoField">
                        <span class="label">Permanent Address:</span>
                        <span>${userData.PermanentAddress}</span>
                    </div>
                </div>
            </div>
           
        `,
    });
      
}

export const handleEditUser = async (userId) => {
    // Get the Firestore instance
    const db = getFirestore();

    // Get the current user document
    const userDoc = doc(db, "users", userId);

    // Fetch the current user data
    const userRef = await getDoc(userDoc);
    const userData = userRef.data();

     // Function to open a new tab with the file URL
     const viewFile = (url) => {
        window.open(url, '_blank');
    };

    Swal.fire({
        title: "Edit User Details",
        confirmButtonColor: '#0e7490',
        confirmButtonText: "Edit",
        showCancelButton: true,
        showCloseButton: true,
        width: "auto",
        html:
        `
            <style> 
                .container{
                    min-width: 500px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }

                .BasicInfo{
                    width: 100%;
                    margin: 5px 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                }

                .infoField{
                    width:100%;
                    display: flex;
                    align-items: flex-start;
                    text-align: left;
                    flex-wrap: wrap;
                    gap: 5px;

                    .label{
                        color:#0e7490;
                    }
                    
                    input{
                        width:100%;
                        padding: 5px 10px;
                        border: 1px solid #0e7490;
                        border-radius: 8px;
                    }

                    span{
                        text-align: left;
                        min-width: 170px;
                    }
                }

            </style>

            <div class="container">
                <div class="BasicInfo">
                    <div class="infoField">
                        <label class="label">First Name:</label>
                        <input value=${userData.firstName} ></input>
                    </div>
                    <div class="infoField">
                        <label class="label">Last Name:</label>
                        <input value=${userData.lastName} ></input>
                    </div>
                    <div class="infoField">
                        <label class="label">Contact Number:</label>
                        <input value=${userData.contactNum} ></input>
                    </div>
                    <div class="infoField">
                        <label class="label">Email Address:</label>
                        <input value=${userData.email} ></input>
                    </div>
                    <div class="infoField">
                        <label class="label">Current Address:</label>
                        <input value=${userData.CurrentAddress} ></input>
                    </div>
                    <div class="infoField">
                        <label class="label">Permanent Address:</label>
                        <input value=${userData.PermanentAddress} ></input>
                    </div>
                </div>
            </div>
           
        `,
    });
      
}


export const handleDelete = (userId) => {
    Swal.fire({
        title: "Delete User?",
        text: "You won't be able to revert this!",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "red",
        confirmButtonText: "Delete"
    }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "User Deleted!",
            icon: "success",
            confirmButtonColor: "#00b050",
          });
        }
    });
      
}

export const handleViewApplication = async (userId) => {
    // Get the Firestore instance
    const db = getFirestore();

    // Get the current user document
    const userDoc = doc(db, "users", userId);

    // Fetch the current user data
    const userRef = await getDoc(userDoc);
    const userData = userRef.data();

    // Function to open a new tab with the file URL
    const viewFile = (url) => {
        window.open(url, '_blank');
    };

    // Show the Swal alert
    Swal.fire({
        title: "Owner Applicant Details",
        confirmButtonColor: '#0e7490',
        showCloseButton: true,
        width: "auto",
        html:
        `
            <style> 
                .container{
                    min-width: 500px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;

                    h1{
                        margin-top: 10px;
                        color:#0e7490;
                        font-weight: bold;
                    }
                }

                .otherInfo{
                    width: 100%;
                    margin: 5px 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 12px;
                }

                .infoField{
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    flex-wrap: wrap;

                    .label{
                        color:#0e7490;
                    }
                    
                    span{
                        text-align: left;
                        min-width: 170px;
                    }
                }

                .uploads{
                    width: 100%;
                    margin: 5px 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 10px;
                }

                .uploadSection{
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;

                    button{
                        background-color: #0e7490;
                        color: white;
                        padding: 8px 20px;
                        border-radius: 12px;
                    }
                }

            </style>

            <div class="container">
                <h1>Basic Information</h1>
                <div class="otherInfo">
                    <div class="infoField">
                        <span class="label">User Name:</span>
                        <span>${userData.firstName+ " " + userData.lastName}</span>
                    </div>
                    <div class="infoField">
                        <span class="label">Contact Number:</span>
                        <span>${userData.contactNum}</span>
                    </div>
                    <div class="infoField">
                        <span class="label">Email Address:</span>
                        <span>${userData.email}</span>
                    </div>
                    <div class="infoField">
                        <span class="label">Current Address:</span>
                        <span>${userData.CurrentAddress}</span>
                    </div>
                    <div class="infoField">
                        <span class="label">Permanent Address:</span>
                        <span>${userData.PermanentAddress}</span>
                    </div>
                </div>
                <h1>Uploaded Documents</h1>
                <div class="uploads">
                    <div class="uploadSection">
                        <span class="label">2x2 ID</span>
                        <button id="view2x2">View</button>
                    </div>
                    <div class="uploadSection">
                        <span class="label">Valid ID</span>
                        <button id="viewValidId">View</button>
                    </div>
                    <div class="uploadSection">
                        <span class="label">Business Permit</span>
                        <button id="viewBusinessPermit">View</button>
                    </div>
                    <div class="uploadSection">
                        <span class="label">Occupancy Permit</span>
                        <button id="viewOccupancyPermit">View</button>
                    </div>
                </div>
            </div>
           
        `,
        didOpen: () => {
            document.getElementById('view2x2').addEventListener('click', () => viewFile(userData.user2x2));
            document.getElementById('viewValidId').addEventListener('click', () => viewFile(userData.userValidId));
            document.getElementById('viewBusinessPermit').addEventListener('click', () => viewFile(userData.userBusinessPermit));
            document.getElementById('viewOccupancyPermit').addEventListener('click', () => viewFile(userData.userOccupancyPermit));
        }
    });

    // Check if the registrationStatus is 'pending'
    if (userData.registrationStatus === "pending") {
        // Update the registrationStatus to 'review'
        await updateDoc(userDoc, {
            registrationStatus: "review"
        });

         // Send an email to notify the user that their application is being reviewed
         sendEmail(
            userData.email,
            "Your Application is Being Reviewed",
            "Dear " + userData.firstName + ",\n\nYour application is currently being reviewed. We will notify you once the review process is complete."
        );
    }
}

export const handleApproveOwner = async (userId) => {
    Swal.fire({
        title: "Approve Owner Application?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#00b050",
        confirmButtonText: "Approve"
    }).then( async (result) => {
        if (result.isConfirmed) {
            // Update the registrationStatus in Firestore
            const db = getFirestore();
            const userDoc = doc(db, "users", userId);
            const userRef = await getDoc(userDoc);
            const userData = userRef.data();

            await updateDoc(userDoc, {
                registrationStatus: "confirmed",
                userType: "Owner (Free Trial)" 
            });

            // Send an email to notify the user that their application has been approved
            sendEmail(
                userData.email,
                "Your Application Has Been Approved",
                "Dear " + userData.firstName + ",\n\nCongratulations! Your application has been approved."
            );

            Swal.fire({
                title: "Application Approved!",
                icon: "success",
                confirmButtonColor: "#00b050",
            });
        }
    });
}


export const handleRejectOwner = async (userId) => {
    Swal.fire({
        title: "Reject This Application?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "red",
        confirmButtonText: "Reject",
        showCloseButton: true,
        }).then(async (result) => {
        if (result.isConfirmed) {
            Swal.fire({
                input: "textarea",
                icon: "info",
                confirmButtonColor: "green",
                inputLabel: "Add Reason for Rejecting",
                inputPlaceholder: "Type your message here...",
                inputAttributes: {
                    "aria-label": "Type your message here"
                },
                showCancelButton: true
            }).then(async (result) =>{
                if (result.isConfirmed) {
                    const db = getFirestore();
                    const userDoc = doc(db, "users", userId);
                    const userRef = await getDoc(userDoc);
                    const userData = userRef.data();

                    await updateDoc(userDoc, {
                        rejectReason: result.value,
                        registrationStatus: "rejected",
                        userType: "Renter" 
                    });

                    // Send an email to notify the user that their application has been rejected
                    sendEmail(
                        userData.email,
                        "Your Application Has Been Rejected",
                        "Dear " + userData.firstName + ",\n\nWe regret to inform you that your application has been rejected. Reason: " + result.value
                    );

                    Swal.fire({
                        title: "Rejected!",
                        text: "Rent Application has been Rejected.",
                        icon: "success",
                        confirmButtonColor: '#0e7490',
                    });
                }
                else{
                    Swal.fire({
                        title: "Reject Cancelled",
                        text: "Reject Application has been Cancelled.",
                        icon: "error",
                        confirmButtonColor: '#0e7490',
                    });
                }

            })
        }
    });
}


export const handleViewSubscription = async (subscriptionId) => {
    const db = getFirestore();
    const docRef = doc(db, "subscription payments", subscriptionId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        const subscriptionType = data.subscriptionType;
        const proofOfPayment = data.proofOfPayment;
        const benefits = data.subscriptionDetails.benefits;
        const duration = data.subscriptionDetails.duration;
        const monthlyRate = data.subscriptionDetails.monthlyRate;
        const totalRate = data.subscriptionDetails.totalRate;
        let totalRateHtml = totalRate ? `<span class="totalRate">${totalRate}<span class="subRate"> /${duration}</span></span>` : '';


        Swal.fire({
            title: "Subscription Details",
            confirmButtonColor: '#0e7490',
            width: "800px",
            html: 
            `
                <style>
                    .container{
                    display:flex;

                    h1{
                        font-weight: bold;
                    }

                    h2{
                        color: #0e7490;
                        font-weight: bold;
                        font-size: 20px;
                    }
                }

                .subscription{
                    display: flex;
                    flex-direction: column;
                    padding: 20px;
                }

                .subscriptionOption{
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    align-items: center;
                    height: 250px;
                    width: 220px;
                    margin: 10px auto;
                    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                    border-radius: 10px;
                    cursor: pointer;

                    h3{
                        margin-top: 10px;
                        color: white;
                        font-weight: bold;
                        font-size: 25px;
                    }

                    .header1{
                        width: 100%;
                        border-radius: 10px 10px 0 0;
                        background-color:#87bac8;
                        padding-bottom: 10px;
                    }

                    .header2{
                        width: 100%;
                        border-radius: 10px 10px 0 0;
                        background-color:#3e90a6;
                        padding-bottom: 10px;
                    }

                    .header3{
                        width: 100%;
                        border-radius: 10px 10px 0 0;
                        background-color:#0e7490;
                        padding-bottom: 10px;
                    }

                    .body{
                        display: flex;
                        flex-direction: column;
                        gap: 5px;
                        align-items: center;
                        margin-top: 10px;

                        .totalRate{
                            color: #0e7490;
                        }
    
                        .monthlyRate{
                            font-size: 20px;
                            font-weight: bold;
                            color: #0e7490;
                        }
    
                        .subRate{
                            color: #0e7490;
                            font-size: 12px;
                        }
    
                        .benefits{
                            font-size: 13px;
                        }
    
                        .checkMark{
                            color: #00b050;
                            font-size: 15px;
                        }
                    }

                }

                .imageContainer{
                    display: flex; 
                    flex-direction: column;
                    padding: 20px;

                    img{
                        flex: 1; 
                        height: 580px; 
                        width: auto; 
                        padding: 10px;
                    }
                }
                </style>
            
                <div class="container">
                    <div class="subscription">
                        <h1>Selected Subscription</h1>
                        <h2>${subscriptionType}</h2>
                        <div class="subscriptionOption">
                            <div class="header2">
                                <h3>${duration}</h3>
                            </div>
                            <div class="body">
                                <span class="monthlyRate">${monthlyRate}<span class="subRate"> /month</span></span>
                                ${totalRateHtml}
                                <span>Benefits</span>
                                <span class="benefits"><span class="checkMark">✓ </span>${benefits}</span>
                            </div>
                        </div>
                    </div>

                    <div class="imageContainer">
                        <h1>Proof of Payment</h1>
                        <img src="${proofOfPayment}">
                    </div>

                </div>
            `,
        });
    } else {
        console.log("No such document!");
    }
}

export const handleApproveSubscription = async (subscriptionId) => {
    Swal.fire({
        title: "Approve Subscription Payment?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#00b050",
        confirmButtonText: "Approve"
    }).then( async (result) => {
        if (result.isConfirmed) {

            const db = getFirestore();
            const subscriptionDoc = await getDoc(doc(db, "subscription payments", subscriptionId));
            const userId = subscriptionDoc.data().userId;
            const subscriptionType = subscriptionDoc.data().subscriptionType;

            const userDoc = await getDoc(doc(db, "users", userId));
            const userEmail = userDoc.data().email; // Assuming the email is stored in the 'email' field

            let userType = null;
            console.log(`subscriptionType: ${subscriptionType}`); 
            switch(subscriptionType){
                case 'regular': userType = "Premium (Regular)"; break;
                case 'bundle1': userType = "Premium (B3 Months)"; break;
                case 'bundle2': userType = "Premium (B6 Months)"; break;
                case 'bundle3': userType = "Premium (B12 Months)"; break;
                case 'ultimate': userType = "Premium (Ultimate)"; break;
                default: /* Your code here */ break;
            }

            await updateDoc(doc(db, "subscription payments", subscriptionId), {
                subscriptionStatus: "approved",
            });
            await updateDoc(doc(db, "users", userId), {
                userType : userType
            });

            // Send an email to the user
            const subject = "Subscription Approved";
            const message = `Your subscription has been approved! `;
            sendEmail(userEmail, subject, message);

            Swal.fire({
                title: "Application Approved!",
                icon: "success",
                confirmButtonColor: "#00b050",
            });
        }
    });
}

export const handleRejectSubscription = async (subscriptionId) => {
    Swal.fire({
      title: "Reject This Application?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "red",
      confirmButtonText: "Reject",
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          input: "textarea",
          icon: "info",
          confirmButtonColor: "green",
          inputLabel: "Add Reason for Rejecting",
          inputPlaceholder: "Type your message here...",
          inputAttributes: {
            "aria-label": "Type your message here"
          },
          showCancelButton: true
        }).then(async (result) => {
          if (result.isConfirmed) {
            const db = getFirestore();
            const subscriptionDoc = await getDoc(doc(db, "subscription payments", subscriptionId));
            const userId = subscriptionDoc.data().userId;
  
            await updateDoc(doc(db, "subscription payments", subscriptionId), {
              subscriptionStatus: "rejected",
            });
  
            await updateDoc(doc(db, "users", userId), {
              rejectReason: result.value,
              userType: "Owner (Free Trial)" 
            });
  
            // Fetch the user data from Firestore
            const userDoc = await getDoc(doc(db, "users", userId));
            const userEmail = userDoc.data().email; // Assuming the email is stored in the 'email' field
  
            // Send an email to the user
            const subject = "Subscription Rejected";
            const message = `Your subscription has been rejected for the following reason: ${result.value}`;
            sendEmail(userEmail, subject, message);
  
            Swal.fire({
              title: "Rejected!",
              text: "Rent Application has been Rejected.",
              icon: "success",
              confirmButtonColor: '#0e7490',
            });
          }
          else{
            Swal.fire({
              title: "Reject Cancelled",
              text: "Reject Application has been Cancelled.",
              icon: "error",
              confirmButtonColor: '#0e7490',
            });
          }
        })
      }
    });
  }
  
export const handleViewProperty = async (propertyId) => {
    console.log("handleViewProperty", propertyId);
    if (!propertyId) {
        console.error('Undefined propertyId');
        return;
    }
    // Get the Firestore instance
    const db = getFirestore();
    // Get the property document
    const propertyDoc = doc(db, "properties", propertyId);
    console.log("propertyDoc", propertyDoc);
    // Fetch the property data
    const propertyRef = await getDoc(propertyDoc);
    const propertyData = propertyRef.data();
    console.log("propertyData", propertyData);
    // Get the owner document
    const ownerDoc = doc(db, "users", propertyData.userId);
    // Fetch the owner data
    const ownerRef = await getDoc(ownerDoc);
    const ownerData = ownerRef.data();
    console.log("ownerData", ownerData);
    // Show the Swal alert
    Swal.fire({
        title: "Property Details",
        confirmButtonColor: '#0e7490',
        showCloseButton: true,
        width: "800px",
        html:
        `
            <style> 
                .container{
                    display:flex;
                    flex-direction: column;
                    gap: 20px;
                    padding: 0 20px;
                }
                .images{
                    display:flex;
                    overflow-x: auto;

                    img{
                        display:flex;
                        height: 450px;
                        width: auto;
                        margin: 10px;
                        object-fit: contain;
                    }
                }
                .infoArea{
                    display:flex;
                    gap: 20px;

                    h1{
                        color:#0e7490;
                        margin: 10px 0;
                        font-weight: bold;
                    }
                }

                .left{
                    width: 50%;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;

                    .infoSection{
                        display:flex;
                        flex-direction: column;
                        align-items: flex-start;

                        span{
                            color:#0e7490;
                        }

                        .description{
                            max-height: 100px;
                            overflow-y: auto;
                            text-align: left;
                        }
                    }
                }

                .right{
                    width: 50%;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;

                    .infoSection{
                        display:flex;
                        flex-direction: column;
                        align-items: flex-start;

                        span{
                            color:#0e7490;
                        }
                    }

                    .paymentInfoSection{
                        display:flex;
                        align-items: flex-start;
                        gap: 20px;
                        span{
                            color:#0e7490;
                        }
                    }

                    ul.amenities{
                        max-height: 180px;
                        overflow-y: auto;
                        text-align: left;
                        list-style-type: circle !important;
                    }
                }
            </style>
            <div class="container">
                <div class="images">
                    ${propertyData.propertyImages.map(imageUrl => `<img src="${imageUrl}" alt="Property Image">`).join("")}
                </div>
        
                <div class="infoArea">
                    <div class="left">
                        <h1>Basic Information</h1>
                        <div class="infoSection">
                            <span>Property Owner:</span>
                            <p>${ownerData.firstName + " " + ownerData.lastName}</p>
                        </div>
                        <div class="infoSection">
                            <span>Property Name:</span>
                            <p>${propertyData.propertyName}</p>
                        </div>
                        <div class="infoSection">
                            <span>Property Type:</span>
                            <p>${propertyData.propertyType}</p>
                        </div>
                        <div class="infoSection">
                            <span>Location:</span>
                            <p>${propertyData.propertyLocation}</p>
                        </div>
                        <div class="infoSection">
                            <span>Property Rate:</span>
                            <p>${propertyData.propertyRate}</p>
                        </div>
                        <div class="infoSection">
                            <span>Availability:</span>
                            <p>${propertyData.propertyAvailability}</p>
                        </div>
                        <div class="infoSection">
                            <span>Description:</span>
                            <p class='description'>${propertyData.propertyDescription}</p>
                        </div>
                    </div>
                    <div class="right">
                        <h1>Contact Information</h1>
                        <div class="infoSection">
                            <span>Email Address:</span>
                            <p>${ownerData.email}</p>
                        </div>
                        <div class="infoSection">
                            <span>Mobile Number:</span>
                            <p>${ownerData.contactNum}</p>
                        </div>
                        <h1>Payment Method</h1>
                        <div class="paymentInfoSection">
                            <span>Online Bank Transfer:</span>
                            <p>${propertyData.qrCodes.onlineBankTransfer ? "✓" : ""}</p>
                        </div>
                        <div class="paymentInfoSection">
                            <span>Gcash:</span>
                            <p>${propertyData.qrCodes.gcash ? "✓" : ""}</p>
                        </div>
                        <h1>Amenities</h1>
                        <ul class="amenities">
                            ${propertyData.amenities.map(amenity => amenity.checked ? `<li><span>✓ </span>${amenity.name}</li>` : '').join("")}
                        </ul>

                    </div>
                </div>
            </div>
        `,
    });
}


export const handleApproveProperty = async (propertyId) => {
    Swal.fire({
        title: "Approve Property Application?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#00b050",
        confirmButtonText: "Approve"
    }).then( async (result) => {
        if (result.isConfirmed) {
            // Get the Firestore instance
            const db = getFirestore();
            // Get the property document
            const propertyDoc = doc(db, "properties", propertyId);
            // Fetch the property data
            const propertyRef = await getDoc(propertyDoc);
            const propertyData = propertyRef.data();
            // Update the propertyVerification in Firestore
            await updateDoc(propertyDoc, {
                propertyVerification: "accepted"
            });
            // Get the owner document
            const ownerDoc = doc(db, "users", propertyData.userId);
            // Fetch the owner data
            const ownerRef = await getDoc(ownerDoc);
            const ownerData = ownerRef.data()
            // Send an email to notify the user that their property application has been approved
            sendEmail(
                ownerData.email,
                "Your Property Application Has Been Approved",
                `Dear ${ownerData.firstName},\n\nCongratulations! Your property application for ${propertyData.propertyName} has been approved. Your property are now being displayed on our platform.`
            );

            Swal.fire({
                title: "Application Approved!",
                icon: "success",
                confirmButtonColor: "#00b050",
            });
        }
    });
}



export const handleRejectProperty = async (propertyId) => {
    Swal.fire({
        title: "Reject This Property Application?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "red",
        confirmButtonText: "Reject",
        showCloseButton: true,
    }).then(async (result) => {
        if (result.isConfirmed) {
            Swal.fire({
                input: "textarea",
                icon: "info",
                confirmButtonColor: "green",
                inputLabel: "Add Reason for Rejecting",
                inputPlaceholder: "Type your message here...",
                inputAttributes: {
                    "aria-label": "Type your message here"
                },
                showCancelButton: true
            }).then(async (result) =>{
                if (result.isConfirmed) {
                    // Get the Firestore instance
                    const db = getFirestore();

                    // Get the property document
                    const propertyDoc = doc(db, "properties", propertyId);

                    // Fetch the property data
                    const propertyRef = await getDoc(propertyDoc);
                    const propertyData = propertyRef.data();

                    // Update the propertyVerification in Firestore
                    await updateDoc(propertyDoc, {
                        rejectReason: result.value,
                        propertyVerification: "rejected"
                    });

                    // Get the owner document
                    const ownerDoc = doc(db, "users", propertyData.userId);

                    // Fetch the owner data
                    const ownerRef = await getDoc(ownerDoc);
                    const ownerData = ownerRef.data();

                    // Send an email to notify the user that their property application has been rejected
                    sendEmail(
                        ownerData.email,
                        "Your Property Application Has Been Rejected",
                        `Dear ${ownerData.firstName},\n\nWe regret to inform you that your property application for ${propertyData.propertyName} has been rejected. Reason: ${result.value}`
                    );

                    Swal.fire({
                        title: "Rejected!",
                        text: "Property Application has been Rejected.",
                        icon: "success",
                        confirmButtonColor: '#0e7490',
                    });
                }
                else{
                    Swal.fire({
                        title: "Reject Cancelled",
                        text: "Reject Application has been Cancelled.",
                        icon: "error",
                        confirmButtonColor: '#0e7490',
                    });
                }
            })
        }
    });
}
