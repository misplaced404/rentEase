/* eslint-disable no-unused-vars */
import Swal from 'sweetalert2';
import apartment from '../../../assets/property dummy/Gcash_images.png';
import { getFirestore, collection, getDoc, getDocs,addDoc, doc, updateDoc, deleteDoc, serverTimestamp} from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { sendRejectionEmail, sendAcceptanceEmail, sendEmail } from './Notifications';




// View Button{
export const handleViewRenter = (renter) => {
    Swal.fire({
        title: "Additional Renter Information",
        icon: "info",
        width: 500,
        confirmButtonColor:"#0e7490",
        showCloseButton: true,
        html:
        `
            <style>
                .infoContainer{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }
                .infoSection{
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    flex-wrap: wrap;
                    text-align: left;

                    span{
                        text-align: left;
                        color:#0e7490;
                    }
                }

            </style>


            <div class="infoContainer">
                <div class="infoSection">
                    <span>Renter Name:</span>
                    <p>${renter.renterName} ${renter.renterLastName}</p>
                </div>
                <div class="infoSection">
                    <span>Renter Address:</span>
                    <p>${renter.renterAddress}</p>
                </div>
                <div class="infoSection">
                    <span>Contact Number:</span>
                    <p>${renter.renterNum}</p>
                </div>
                <div class="infoSection">
                    <span>Email Address:</span>
                    <p>${renter.renterEmail}</p>
                </div>
                <div class="infoSection">
                    <span>Occupation:</span>
                    <p>${renter.occupation}</p>
                </div>
                <div class="infoSection">
                    <span>Duration of Stay:</span>
                    <p>${renter.duration.number} ${renter.duration.unit}</p>
                </div>
            </div>
        `
    });
}  

// Message Button
export  const handleMessage = (message = '', renter) => {
    let textareaValue = '';
    let firstName = renter ? renter.renterName : '';
    let lastName = renter ? renter.renterLastName : '';
    const recipientFullName = firstName + " " + lastName;
    
    Swal.fire({
        input: "textarea",
        inputValue: message,
        inputLabel: `Send a Message to ${recipientFullName}`,
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
                return new Promise(async (resolve) => {
                    // Prepare the data to be stored in Firestore
                    const messageData = {
                        senderId: userId, // assuming you have the user's ID
                        senderName: userName,
                        recipientId: renter.userId, 
                        recipientName: recipientFullName, // pass the recipientName to the database
                        message: text, // the message text
                        sentTime: serverTimestamp()
                    };

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
                        console.log(e);
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

export const handleAccept = async (renter) => {
    const result = await Swal.fire({
        title: "Accept Rent Application?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#00b050",
        confirmButtonText: "Sent Payment Request",
        showCloseButton: true,
    });

    if (result.isConfirmed) {
        // Update the status of the renter in Firestore
        const db = getFirestore();
        await updateDoc(doc(db, "renters", renter.id), {
            applicationStatus: "Waiting for Payment"
        });
        // Send acceptance email
        sendAcceptanceEmail(renter.email);
        Swal.fire({
            title: "Payment Request Sent!",
            text: "Renter will now be able to Pay.",
            icon: "success",
            confirmButtonColor: "#00b050",
        });
    }
}

//reject
export const handleReject = async (renter) => {
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
            // Update the status of the renter in Firestore
            const db = getFirestore();
            await updateDoc(doc(db, "renters", renter.id), {
                applicationStatus: "Rejected" 
            });
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
                    await updateDoc(doc(db, "renters", renter.id), {
                        rejectReason: result.value 
                    });

                    // Send rejection email
                    console.log('Recipient', renter.email);
                    sendRejectionEmail(renter.email, result.value);
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

//reason 
export const handleReason = async (renter) => {
    // Fetch the data from Firestore
    const db = getFirestore();
    const docRef = doc(db, "renters", renter.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        const rejectReason = data.rejectReason;

        Swal.fire({
            title: "Owner's Reason for Rejecting",
            text: rejectReason,
            icon: "info",
            confirmButtonColor:"#0e7490",
            showCloseButton: true,
        });
    } else {
        console.log("No such document!");
    }
}

export const handleRemove = async(renter) => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
        if (result.isConfirmed) {
            // Delete the renter document from Firestore
            const db = getFirestore();
            await deleteDoc(doc(db, "renters", renter.id));

            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
        }
    });
}

// payment details
export const handlePaymentReview = async(renter) => {
    Swal.fire({
        title: "Proof of Payment",
        imageUrl: apartment,
        imageWidth: 450,
        imageHeight: 550,
        confirmButtonText: "Acknowledge Payment",
        confirmButtonColor: "#00b050",
        showDenyButton: true,
        denyButtonText: "Resend Payment Request",
        showCloseButton: true,
        
        }).then(async(result) =>{
            if(result.isConfirmed){
                // Update the status of the renter in Firestore
                const db = getFirestore();
                const date = new Date();
                const formattedDate = date.toISOString().split('T')[0];
                await updateDoc(doc(db, "renters", renter.id), {
                    applicationStatus: "Completed",
                    lastPaymentMade: formattedDate,
                });
                sendEmail(renter.email, 'Payment Acknowledged', 'Your payment has been acknowledged. Your application status is now Completed.');
                Swal.fire({
                    title: "Payment Acknowledge!",
                    text: "Application Status Completed.",
                    icon: "success",
                    confirmButtonColor: "#00b050",
                });
            }
        else if(result.isDenied){
            sendEmail(renter.email, 'Payment Request', `We are requesting for your payment due to the following reason: ${result.value}`);
            Swal.fire({
                title: "Resending Payment Message",
                text: "Add reason for Requesting Payment",
                input: "text",
                icon: "question",
                confirmButtonColor: "#00b050",
                confirmButtonText: "Send",
                showCancelButton: true,
            }).then(async(result) =>{
                if(result.isConfirmed){
                // Update the status of the renter in Firestore
                const db = getFirestore();
                await updateDoc(doc(db, "renters", renter.id), {    
                    requestReason: result.value,
                    applicationStatus: "Requested to resend payment",
                });
                    Swal.fire({
                        title: "Payment Request Resent!",
                        text: "Renter will now be able to Pay.",
                        icon: "success",
                        confirmButtonColor: "#00b050",
                    })
                }
                else{
                    Swal.fire({
                        title: "Resend Cancelled",
                        text: "Resend Payment has been Cancelled.",
                        icon: "error",
                        confirmButtonColor: '#0e7490',
                    });
                }
            });
        }
        });
}

// payment button
export const handlePayment = async (renter) => {
    const storage = getStorage();
    console.log("renter", renter.qrcodes);
    
    Swal.fire({
        title: "<h5 style='color:#0e7490'>" + "Pay using any of the QR Codes" + "</h5>",
        inputLabel: "Upload Proof of Payment Below",
        input: "file",
        html: `
        <div style="display: flex; justify-content: space-around; background-color: #efefef;">
            <img src="${renter.qrcodes.onlineBankTransfer}" alt="Online Bank Transfer" style="flex: 1; height: 580px; width: auto; margin: 10px; ">
            <img src="${renter.qrcodes.gcash}" alt="GCash" style="flex: 1; height: 580px; width: auto; margin: 10px; ">
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
                                    const docRef = doc(db, "renters", renter.id);
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
                                            applicationStatus: "Waiting Acknowledgement",
                                            paymentProof: newPaymentProofs
                                        }).then(() => {
                                            // Send an email acknowledging the payment
                                            sendEmail(renter.email, 'Payment Received', 'We have received your payment. Your application status is now Waiting Acknowledgement.');
                                    
                                            Swal.fire({
                                                icon: 'success',
                                                title: 'Upload Success!',
                                                confirmButtonText: 'OK',
                                                confirmButtonColor: '#0e7490',
                                            });
                                        });
                                    });
                                });
                            }
                        );
                    } else {
                        handlePayment(); // Call the function again
                    }
                });
            };
            reader.readAsDataURL(file);
        }
    });
};

// reapply
export const handleReapply = async (renter) => {
    const swalWithCondition = Swal.mixin({
        confirmButtonColor: "#0e7490",
        });
    
        swalWithCondition.fire({
        title: "Reapply Application?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#00b050",
        confirmButtonText: "Reapply",
        showCloseButton: true,
        focusConfirm: false,
        cancelButtonText: 'Cancel',
        reverseButtons: true
    }).then(async(result) => {
        if (result.isConfirmed) {
            // Update the status of the renter in Firestore
            const db = getFirestore();
            await updateDoc(doc(db, "renters", renter.id), {
                applicationStatus: "Pending",
            });

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

}