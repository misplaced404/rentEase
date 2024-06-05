import { useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import SideMenu from '../../SideMenu/SideMenu';
import {OwnerRegistrationContainer} from './OwnerRegistration.styled';
import { FaFileUpload } from "react-icons/fa";
import { IoTrash } from "react-icons/io5";
import { FaExclamationTriangle } from "react-icons/fa";
import Swal from 'sweetalert2';
import RegistrationContext from "../../../context/RegistrationContext";
import { useNavigate } from 'react-router-dom';



function OwnerRegistration() {
    const { showBackdrop, setShowBackdrop, applicationStatus, setApplicationStatus } = useContext(RegistrationContext);
    const { isRegistered, setIsRegistered } = useContext(RegistrationContext);
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contactNum: '',
        CurrentAddress: '',
        PermanentAddress: '',
    });
    
    const [loading, setLoading] = useState(true);
    const [selectedFilePic, setSelectedFilePic] = useState(null);
    const [fileNamePic, setFileNamePic] = useState('');
    const [selectedFileID, setSelectedFileID] = useState(null);
    const [fileNameID, setFileNameID] = useState('');
    const [selectedFilePermit, setSelectedFilePermit] = useState(null);
    const [fileNamePermit, setFileNamePermit] = useState('');
    const [selectedFileBusiness, setSelectedFileBusiness] = useState(null);
    const [fileNameBusiness, setFileNameBusiness] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const docRef = doc(getFirestore(), 'users', firebaseUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUser(docSnap.data());
                    if (docSnap.data().registrationStatus === 'confirm') {
                        setIsRegistered(true);
                    }
                }
            }
            setLoading(false);
        });
    }, [setIsRegistered]);
    

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileUploadPic = (event) => {
        setSelectedFilePic(event.target.files[0]);
        setFileNamePic(event.target.files[0].name);
    };
    const handleFileUploadID = (event) => {
        setSelectedFileID(event.target.files[0]);
        setFileNameID(event.target.files[0].name);
    };
    const handleFileUploadPermit = (event) => {
        setSelectedFilePermit(event.target.files[0]);
        setFileNamePermit(event.target.files[0].name);
    };
    const handleFileUploadBusiness = (event) => {
        setSelectedFileBusiness(event.target.files[0]);
        setFileNameBusiness(event.target.files[0].name);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        const firebaseUser = auth.currentUser;

        if (!user.firstName || !user.lastName || !user.email || !user.contactNum || !user.CurrentAddress || !user.PermanentAddress || !selectedFilePic || !selectedFileID || !selectedFilePermit || !selectedFileBusiness) {
            Swal.fire({
                title: "Notice!",
                text: "Please fill up all the fields",
                icon: "warning",
                confirmButtonColor: '#0e7490',
            });
            return;
        }

        if (firebaseUser) {
            const userData = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email, // Changed from user.emailAddress
                contactNum: user.contactNum,
                CurrentAddress: user.CurrentAddress,
                PermanentAddress: user.PermanentAddress,
                registrationStatus: 'review',  // Add this line
            };
            const docRef = doc(getFirestore(), 'users', firebaseUser.uid);
            await setDoc(docRef, userData);
    
            const storage = getStorage();
            const uploadFile = async (file, path) => {
                if (file) {
                    const storageRef = ref(storage, path + file.name);
                    const uploadTask = uploadBytesResumable(storageRef, file);
    
                    uploadTask.on('state_changed', 
                        // eslint-disable-next-line no-unused-vars
                        (snapshot) => {
                            // You can use this function to monitor the upload progress
                        }, 
                        (error) => {
                            // Handle unsuccessful uploads
                            console.log(error);
                        }, 
                        () => {
                            // Handle successful uploads on complete
                            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                console.log('File available at', downloadURL);
                            });
                        }
                    );
                }
            };
    
            // Upload each file
            await uploadFile(selectedFilePic, 'Owner Registration/2x2/');
            await uploadFile(selectedFileID, 'Owner Registration/Valid id/');
            await uploadFile(selectedFilePermit, 'Owner Registration/Occupancy permit/');
            await uploadFile(selectedFileBusiness, 'Owner Registration/Business permit/');
        }
        setSelectedFilePic(null);
        setFileNamePic('');
        setSelectedFileID(null);
        setFileNameID('');
        setSelectedFilePermit(null);
        setFileNamePermit('');
        setSelectedFileBusiness(null);
        setFileNameBusiness('');
        Swal.fire({
            title: "Success!",
            text: "Registration Completed!",
            icon: "success",
            confirmButtonColor: '#0e7490',
        }).then(() => {
            setApplicationStatus('review'); // Set applicationStatus to 'review' when OK is clicked
            setShowBackdrop(true); // Show the backdrop
        });
        
    };

    const resetForm = () => {
        // Reset form fields
        setSelectedFilePic(null);
        setFileNamePic('');
        setSelectedFileID(null);
        setFileNameID('');
        setSelectedFilePermit(null);
        setFileNamePermit('');
        setSelectedFileBusiness(null);
        setFileNameBusiness('');
      
        // Reset application status
        setApplicationStatus(null);

        // Hide the pop-up message
        setShowBackdrop(false);
      };
      
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <SideMenu />
            {!isRegistered && (
            <OwnerRegistrationContainer>
            <h1>Property Owner Registration</h1>
            <div className={`backdrop ${showBackdrop ? '' : 'hidden'}`}>
                <div className="message">
                    <h2><FaExclamationTriangle/>Notice</h2>
                    <hr></hr>
                    {applicationStatus === 'review' && (
                        <div className="review">
                            <p>
                                Your application has been successfully submitted <br/>
                                Please give us at least 2-3 business days to review and update.
                            </p>
                        </div>
                    )}
                    {applicationStatus === 'confirm' && (
                        <div className="confirm">
                            <p>
                                Your Application has been Verified, <br/>
                                Click Okay to Proceed
                            </p>
                            <button className="noticeButton" onClick={() => {
                                setIsRegistered(true); // Set isRegistered to true
                                navigate('/propertyManagement'); // Redirect to Property Management component
                            }}>Okay</button>
                        </div>
                    )}
                    {applicationStatus === 'reject' && (
                        <div className="reject">
                            <p>
                                Your Application has been Denied<br/>
                                {/* comment from admin */}
                            </p>
                            <button className="noticeButton" onClick={resetForm}>Re-Register</button>
                        </div>
                    )}
                </div>

            </div>
                <div className='show'>
                <div className="content">
                    <div className="section">
                        <div className="basicInfoSection">
                            <h2>Basic Information</h2>
                            <div className="basicInfo">
                                <div className="inputField">
                                    <label htmlFor="firstName">First Name</label>
                                    <input type="text" name="firstName" id="firstName" value={user.firstName} readOnly />
                                </div>
                                <div className="inputField">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input type="text" name="lastName" id="lastName" value={user.lastName} readOnly />
                                </div>
                                <div className="inputField">
                                    <label htmlFor="email">Email Address</label>
                                    <input type="text" name="email" id="email" value={user.email} readOnly />
                                </div>
                                <div className="inputField">
                                    <label htmlFor="contactNum">Contact Number</label>
                                    <input type="text" id="contactNum" name="contactNum" value={user.contactNum} readOnly/>
                                </div>
                                <div className="inputField">
                                    <label htmlFor="CurrentAddress">Current Address</label>
                                    <input type="text" className="address" id="CurrentAddress" name="CurrentAddress" value={user.CurrentAddress} readOnly />
                                </div>
                                <div className="inputField">
                                    <label htmlFor="PermanentAddress">Permanent Address</label>
                                    <input type="text" className="address" id="PermanentAddress" name="PermanentAddress" value={user.PermanentAddress} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                        <div className="validationSection">
                            <h2>Validation</h2>
                            <div className="UploadInfo">
                                <div className="uploads">
                                    <div className="uploadField">
                                    <div className='uploadSection'>
                                        <span>Upload 2x2 Picture</span>
                                        <input type="file" id="fileUploadPic" hidden onChange={handleFileUploadPic} />
                                        <button onClick={() => document.getElementById('fileUploadPic').click()}><FaFileUpload />Upload</button>
                                    </div>
                                    {fileNamePic && 
                                        <div className='fileNameSectionContainer'>
                                            <div className='fileNameSection'>{fileNamePic} </div>
                                            <button onClick={() => {setSelectedFilePic(null); setFileNamePic('');}}>
                                                <IoTrash className='deleteIcon'/>
                                            </button>
                                        </div>
                                    }
                                    </div>
                                    <div className="uploadField">
                                    <div className='uploadSection'>
                                        <span>Upload Valid ID</span>
                                        <input type="file" id="fileUploadID" hidden onChange={handleFileUploadID} />
                                        <button onClick={() => document.getElementById('fileUploadID').click()}><FaFileUpload />Upload</button>
                                    </div>
                                    {fileNameID && 
                                        <div className='fileNameSectionContainer'>
                                            <div className='fileNameSection'>{fileNameID} </div>
                                            <button onClick={() => {setSelectedFileID(null); setFileNameID('');}}>
                                                <IoTrash className='deleteIcon'/>
                                            </button>
                                        </div>
                                    }
                                    </div>
                                    <div className="uploadField">
                                    <div className='uploadSection'>
                                        <span>Upload Occupancy Permit</span>
                                        <input type="file" id="fileUploadPermit" hidden onChange={handleFileUploadPermit} />
                                        <button onClick={() => document.getElementById('fileUploadPermit').click()}><FaFileUpload />Upload</button>
                                    </div>
                                    {fileNamePermit && 
                                        <div className='fileNameSectionContainer'>
                                            <div className='fileNameSection'>{fileNamePermit} </div>
                                            <button onClick={() => {setSelectedFilePermit(null); setFileNamePermit('');}}>
                                                <IoTrash className='deleteIcon'/>
                                            </button>
                                        </div>
                                    }
                                    </div>
                                    <div className="uploadField">
                                    <div className='uploadSection'>
                                        <span>Upload Business Permit</span>
                                        <input type="file" id="fileUploadBusiness" hidden onChange={handleFileUploadBusiness} />
                                        <button onClick={() => document.getElementById('fileUploadBusiness').click()}><FaFileUpload />Upload</button>
                                    </div>
                                    {fileNameBusiness && 
                                        <div className='fileNameSectionContainer'>
                                            <div className='fileNameSection'>{fileNameBusiness} </div>
                                            <button onClick={() => {setSelectedFileBusiness(null); setFileNameBusiness('');}}>
                                                <IoTrash className='deleteIcon'/>
                                            </button>
                                        </div>
                                    }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="register" onClick={handleSubmit}>Register</button>
                    </div>
                </div>
            </div>
            </OwnerRegistrationContainer>
            )}
        </>
    );
}

export default OwnerRegistration;
