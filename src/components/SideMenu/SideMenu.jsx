/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import * as FaIcons from 'react-icons/fa';
import * as GrIcons from "react-icons/gr";
import * as BsIcons from "react-icons/bs";
import { AiFillMessage } from "react-icons/ai";
import {Link} from 'react-router-dom';
import {SideMenuContainer, Tabs, TabName, Icon} from "./SideMenu.styled";
import Swal from 'sweetalert2'; 
import {getFirestore, doc, getDoc, addDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate, useLocation  } from 'react-router-dom';
import GcashQRCode from "../../assets/property dummy/Gcash_images.png"



function SideMenu() {
    const [showDropup, setShowDropup] = useState(false);
    const [userName, setUserName] = useState('');
    const [userType, setUserType] = useState('');
    const [subscriptionData, setSubscriptionData] = useState('');
    const auth = getAuth();
    const toggleDropUp = () => setShowDropup(!showDropup);
    const [loadingUserType, setLoadingUserType] = useState(true);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [activeTab, setActiveTab] = useState('');
    const location = useLocation();

    const selectedSubscriptionRef = useRef(null);

    let navigate = useNavigate();


    //solution
    const menuRef = useRef();
    const iconRef = useRef();

    useEffect(() => {
        setActiveTab(location.pathname);
    }, [location]);

    useEffect(() => {
        const db = getFirestore();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserName(user.displayName);
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserType(docSnap.data().userType);
                } else {
                    console.log("No such document!");
                }
            } else {
                setUserName('');
                setUserType('');
            }
            setLoadingUserType(false);
        });
        return () => unsubscribe();
    }, [auth]);

    useEffect(() => {
        const db = getFirestore();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Listen for changes in the "subscription payments" collection where "payerId" is the user's uid
                const unsubscribeSnapshot = onSnapshot(query(collection(db, "subscription payments"), where("payerId", "==", user.uid)), 
                    (snapshot) => {
                        snapshot.docChanges().forEach((change) => {
                            if (change.type === "added" || change.type === "modified") {
                                console.log(change.doc.id, " => ", change.doc.data());
                                setSubscriptionData(change.doc.data());
                            }
                        });
                    },
                    (error) => {
                        console.log("Error in snapshot listener: ", error);
                    }
                );
    
                // Return a cleanup function to unsubscribe from the snapshot listener when the component unmounts
                return () => unsubscribeSnapshot();
            }
        });
    
        // Return a cleanup function to unsubscribe from the auth state listener when the component unmounts
        return () => unsubscribe();
    }, [subscriptionData.subscriptionStatus]);
    
    if (loadingUserType) {
        return <div className="spinner"></div>;
    } 

    // Define the details of each subscription plan
    const subscriptionDetails = {
        regular: {
            duration: "1 Month",
            monthlyRate: "Php 149.00",
            benefits:  ["1 Property Listings"]
        },
        bundle1: {
            duration: "3 Months",
            totalRate: "Php 899.00",
            monthlyRate: "Php 299.67",
            benefits: ["List Upto 3 Properties", "Save Up To Php 442"]
        },
        bundle2: {
            duration: "6 Months",
            totalRate: "Php 1,799.00",
            monthlyRate: "Php 299.83",
            benefits: ["List Upto 3 Properties","Save Up To Php 883"]
        },
        bundle3: {
            duration: "12 Months",
            totalRate: "Php 3,599.00",
            monthlyRate: "Php 299.92",
            benefits: ["List Upto 3 Properties", "Save Up To Php 1,765"]
        },
        ultimate: {
            duration: "1 Month",
            monthlyRate: "Php 129.00",
            benefits: ["Unlimited Property Listings"]
        },
    };

    const updateSelectedSubscription = (selected) => {
        let selectedSub;
        [regular, bundle1, bundle2, bundle3, ultimate].forEach(subscription => {
            if (subscription === selected) {
                subscription.classList.add('selected');
                // Use the id of the subscription div as the subscription name
                selectedSub = subscription.id;
            } else {
                subscription.classList.remove('selected');
            }
        });
        setSelectedSubscription(selectedSub);
        selectedSubscriptionRef.current = selectedSub; // Update the ref
        console.log("selected subscription: ",selectedSubscriptionRef.current)
    };
    
    

    const handleSubscription = (event) => {
        event.preventDefault();      

        Swal.fire({
            title: "Choose a Subscription Plan",
            width: '1300px',
            confirmButtonText: "Proceed to Payment",
            confirmButtonColor: "#0e7490",
            showCancelButton: true,
            showCloseButton: true,
            preConfirm: () => {
                return new Promise((resolve, reject) => {
                    if (!selectedSubscriptionRef.current) {
                        Swal.showValidationMessage("Please select a subscription plan before proceeding.");
                        reject();
                    } else {
                        resolve(selectedSubscriptionRef.current);
                    }
                });
            },
            html: 
            `
                <style>
                    .subscriptionContainer{
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        margin: 5px;

                        h2{
                            color: #0e7490;
                            font-weight: bold;
                            font-size: 20px;
                        }

                        .column1{
                            width: 100%;
                            display: flex; 
                            flex-direction: column;
                            flex: 0;
                            margin-right: 20px;
                            gap: 5px;

                            .body{
                                width: 100%;
                                display: flex; 
                                justify-content: center;
                                
                            }
                        }

                        .column2{
                            width: 100%;
                            display: flex; 
                            flex-direction: column;
                            flex:0;
                            gap: 5px;

                            .bundle {
                                display: flex;
                                width: 100%;
                                gap: 20px;
                                margin: 0 10px 0px 10px;
                            }
                        }

                        .column3{
                            width: 100%;
                            display: flex; 
                            flex-direction: column;
                            flex: 0;
                            margin-left: 20px;
                            gap: 5px;

                            .body{
                                width: 100%;
                                display: flex; 
                                justify-content: center;
                                
                            }
                        }

                    }

                    .subscriptionOption{
                        display: flex;
                        flex-direction: column;
                        gap: 5px;
                        align-items: center;
                        height: 250px;
                        width: 220px;
                        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                        border-radius: 10px;
                        cursor: pointer;

                        &:hover{
                            border: 2px solid #0e7490;
                            background-color: #e7f1f4;
                        }

                        h3{
                            margin-top: 10px;
                            color: white;
                            font-weight: bold;
                            font-size: 25px;
                        }

                        .header0{
                            width: 100%;
                            border-radius: 10px 10px 0 0;
                            background-color:  #b7d5de;
                            padding-bottom: 10px;
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

                        .header4{
                            width: 100%;
                            border-radius: 10px 10px 0 0;
                            background-color: #0e5a76;
                            padding-bottom: 10px;
                        }


                        .cardBody{
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            margin-top: 10px;
                            height: 100%;

                            .price{
                                display: flex;
                                flex-direction: column;
                                gap: 5px;
                                align-items: center;
                                height: 70px;

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

                            }

                            .benefit{
                                display: flex;
                                flex-direction: column;
                                gap: 5px;
                                align-items: center;
                                flex:1;

                                .benefits{
                                    font-size: 13px;
                                }
            
                                .checkMark{
                                    color: #00b050;
                                    font-size: 15px;
                                }
                            }
        
                           
                        }
                    }
                    .selected{
                        border: 2px solid #0e7490;
                        background-color: #e7f1f4;
                    }
                </style>

                <div class="subscriptionContainer">
                    <div class="column1">
                        <h2>Regular Subscription</h2><hr />
                        <div class="body">
                            <div id="regular" class="subscriptionOption ${selectedSubscription === 'Regular' ? 'selected' : ''}">
                                <div class="header0">
                                    <h3>1 Month</h3>
                                </div>
                                <div class="cardBody">
                                    <div class="price">
                                        <span class="monthlyRate">Php 149.00<span class="subRate"> /month</span></span>
                                    </div>
                                    <div class="benefit">
                                        <span>Benefits</span>
                                        <span class="benefits"><span class="checkMark">&#10003; </span>1 Property Listing</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="column2">
                        <h2>Rent - Easy Bundle</h2><hr />
                        <div class="bundle">
                            <div id="bundle1" class="subscriptionOption ${selectedSubscription === 'Bundle 1' ? 'selected' : ''}">
                                <div class="header1">
                                    <h3>3 Months</h3>
                                </div>
                                <div class="cardBody">
                                    <div class="price">
                                        <span class="monthlyRate">Php 299.67<span class="subRate"> / month</span></span>
                                        <span class="totalRate">Php 899.00<span class="subRate"> / 3 months</span></span>
                                    </div>
                                    <div class="benefit">
                                        <span>Benefits</span>
                                        <span class="benefits"><span class="checkMark">&#10003; </span>3 Property Listings</span>
                                        <span class="benefits"><span class="checkMark">&#10003; </span>Save Up To Php 442</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div id="bundle2" class="subscriptionOption ${selectedSubscription === 'Bundle 2' ? 'selected' : ''}">
                                <div class="header2">
                                    <h3>6 Months</h3>
                                </div>
                                <div class="cardBody">
                                    <div class="price">
                                        <span class="monthlyRate">Php 299.83<span class="subRate"> / month</span></span>
                                        <span class="totalRate">Php 1,799.00<span class="subRate"> / 6 months</span></span>
                                    </div>
                                    <div class="benefit">
                                        <span>Benefits</span>
                                        <span class="benefits"><span class="checkMark">&#10003; </span>3 Property Listing</span>
                                        <span class="benefits"><span class="checkMark">&#10003; </span>Save Up To Php 883</span>
                                    </div>
                                </div>
                            </div>

                            <div id="bundle3" class="subscriptionOption ${selectedSubscription === 'Bundle 3' ? 'selected' : ''}">
                                <div class="header3">
                                    <h3>12 Months</h3>
                                </div>
                                <div class="cardBody">
                                    <div class="price">
                                        <span class="monthlyRate">Php 299.92<span class="subRate"> / month</span></span>
                                        <span class="totalRate">Php 3,599.00<span class="subRate"> / 12 months</span></span>
                                    </div>
                                    <div class="benefit">
                                        <span>Benefits</span>
                                        <span class="benefits"><span class="checkMark">&#10003; </span>3 Property Listing</span>
                                        <span class="benefits"><span class="checkMark">&#10003; </span>Save Up To Php 1,765</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="column3">
                        <h2>Ultimate Subscription</h2><hr />
                        <div class="body">
                            <div id="ultimate" class="subscriptionOption ${selectedSubscription === 'Ultimate' ? 'selected' : ''}">
                                <div class="header4">
                                    <h3>1 Month</h3>
                                </div>
                                <div class="cardBody">
                                    <div class="price">
                                        <span class="monthlyRate">Php 149.00<span class="subRate"> /month</span></span>
                                    </div>
                                    <div class="benefit">
                                        <span>Benefits</span>
                                        <span class="benefits"><span class="checkMark">&#10003; </span>Unlimited Property Listing</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
                
            `,
            didOpen: () => {
                const addEventListeners = () => {
                    const regular = document.getElementById('regular');
                    const bundle1 = document.getElementById('bundle1');
                    const bundle2 = document.getElementById('bundle2');
                    const bundle3 = document.getElementById('bundle3');
                    const ultimate = document.getElementById('ultimate');
    
                    regular.addEventListener('click', () => updateSelectedSubscription(regular));
                    bundle1.addEventListener('click', () => updateSelectedSubscription(bundle1));
                    bundle2.addEventListener('click', () => updateSelectedSubscription(bundle2));
                    bundle3.addEventListener('click', () => updateSelectedSubscription(bundle3));
                    ultimate.addEventListener('click', () => updateSelectedSubscription(ultimate));
                };
    
                addEventListeners();
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({ 
                    width: "auto",
                    input:"file",
                    inputLabel: "Upload Proof of Payment Below",
                    confirmButtonText: "Pay Now",
                    confirmButtonColor: "#0e7490",
                    showCancelButton: true,
                    showCloseButton: true,
                    preConfirm: () => {
                        let file = Swal.getInput().files[0];    
                        if (!file) {
                            Swal.showValidationMessage("Please upload your proof of payment.");
                            return;
                        }
                    },
                    html: 
                    `
                    <div>
                        <img src="${GcashQRCode}" alt="GCash" style="flex: 1; height: 580px; width: auto; margin: 10px; ">
                    </div>
                    `,
                }).then((result) => {
                    if (result.isConfirmed) {
                        const file = result.value;
                        const reader = new FileReader();
                        const storage = getStorage();
                        reader.onload = (e) => {
                            Swal.fire({
                                title: "Your uploaded picture",
                                imageUrl: e.target.result,
                                imageAlt: "The uploaded picture",
                                confirmButtonText: 'Send',
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
                
                                                // Get the Firestore instance
                                                const db = getFirestore();
                                                const auth = getAuth();
                                                const userId = auth.currentUser.uid;
                                                const paymentDate = new Date();

                                                // Retrieve the details of the selected subscription
                                                const selectedSubscriptionDetails = subscriptionDetails[selectedSubscriptionRef.current];
                
                                                // Add the new payment proof to the "subscription payments" collection
                                                const docRef = addDoc(collection(db, "subscription payments"), {
                                                    subscriptionType: selectedSubscriptionRef.current,
                                                    subscriptionDetails: selectedSubscriptionDetails,
                                                    userId: userId,
                                                    paymentDate: paymentDate,
                                                    proofOfPayment: downloadURL,
                                                    subscriptionStatus: "pending",

                                                    // Add any other fields you need here
                                                });
                
                                                Swal.fire({
                                                    title: "Payment Sent!",
                                                    text: "Your Payment is now being reviewed by the Admin, you will be notified once your payment has been verified",
                                                    icon: "success",
                                                    confirmButtonText: 'OK',
                                                    confirmButtonColor: '#0e7490',
                                                    allowOutsideClick: false,
                                                });
                                            });
                                        }
                                    );
                                } else if (result.isDismissed) {
                                    handleSubscription(event);
                                }
                            });
                        };
                        reader.readAsDataURL(file); 
                    } else if (result.isDenied) {
                        Swal.fire({
                            title: "Failed!",
                            text: "There seems to be a problem, please try again later",
                            icon: "error",
                            confirmButtonColor:"#0e7490",
                        });
                    } else if (result.isDismissed) {
                        handleSubscription(event);
                    }
                });
                
            }
        });
    }

    const handlePendingSubscription = (event) => {
        event.preventDefault();  
        Swal.fire({
            title: "Subscription Status",
            icon: "info",
            text: "Your Payment is still being reviewed by the Admin. Please come back later.",
            confirmButtonColor:"#0e7490",
            confirmButtonText:"OK",
          });
    }

    const handleRejectedSubscription = (event) => {
        event.preventDefault();  
        Swal.fire({
            title: "Subscription Rejected",
            icon: "error",
            text: `Reason for Rejecting: ${subscriptionData ? subscriptionData.reason : ''}`,
            confirmButtonColor:"#0e7490",
            confirmButtonText:"Reapply",
            showCancelButton: true,
        }).then(async (result) => {
            if(result.isConfirmed && subscriptionData){
                // Update the local state
                setSubscriptionData(prevState => ({
                    ...prevState,
                    subscriptionStatus: ""
                }));
        
                // Get a reference to the document
                const db = getFirestore();
                const docRef = doc(db, "subscription payments", subscriptionData.id);
        
                // Update the subscriptionStatus in the database
                await updateDoc(docRef, {
                    subscriptionStatus: ""
                });
            }
        });
    }
    
    
    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log('User signed out');
            navigate('/home');
        } catch (error) {
            console.error('Error signing out', error);
        }
    }

    window.addEventListener('click', (e)=>{
        if(e.target !== menuRef.current && e.target !== iconRef.current){
            setShowDropup(false);
        }
    })

    const Menus = [
        {
            name: "Profile",
            path: "/profile",
            function: toggleDropUp,
        },
        {
            name: "Settings",
            path: "/settings",
            function: toggleDropUp,
        },
        {
            name: "Logout",
            path: "",
            function: handleLogout,
        }
    ];

    function getSideBarData(userType) {
        let SideBarData = [
            {
                title: 'Property Listings',
                path: '/propertyList',
                icon: <BsIcons.BsFillHouseCheckFill />,
                cName:  'nav-text'
            },
            ...(userType !== 'Renter' ? [{
                title: 'Property Management',
                path: '/propertyManagement',
                icon: <BsIcons.BsFillHouseGearFill />,
                cName:  'nav-text'
            }] : []),
            {
                title: 'Rent Management',
                path: '/rentManagement',
                icon: <FaIcons.FaHouseUser/> ,
                cName:  'nav-text'
            },
            {
                title: 'Transaction Management',
                path: '/transaction',
                icon: <GrIcons.GrTransaction />,
                cName:  'nav-text'
            },
            {
                title: 'Payment History',
                path: '/paymentHistory',
                icon: <FaIcons.FaCoins/>,
                cName:  'nav-text'
            },
            {
                title: 'Inbox',
                path: '/inbox',
                icon: <AiFillMessage />,
                cName:  'nav-text'
            },
        ];
        return SideBarData;
    }
    

    return (
        <>
            <SideMenuContainer>
                <div className='upperMenu'>
                    <a className='logo' href="#">
                        <img className='' src='https://firebasestorage.googleapis.com/v0/b/rentease-73c75.appspot.com/o/RentEase%20Logo2_inv.png?alt=media&token=c72a248e-8721-4f8a-819c-895dfafdbf02'></img>
                        <span className='logoName'>RentEase</span>
                    </a>

                    <hr/>
                    <ul className="tabItems">
                        {getSideBarData(userType).map((items, index) => {
                            return(
                                <Link to={items.path} key={index} className={items.path === activeTab ? items.cName + ' active' : items.cName}>
                                    <Tabs>
                                        <li key={index} id="tabList">
                                            <TabName><Icon>{items.icon}</Icon>{items.title} </TabName>
                                        </li>
                                    </Tabs>
                                </Link>
                            )
                        })}
                    </ul>
                </div>
                <div className='lowerMenu'>
                {userType === 'Owner (Free Trial)' && (!subscriptionData || !subscriptionData.subscriptionStatus) &&(
                    <div className='premiumLink'>
                        Your Account is in Free Trial<br/>
                        <a href="" onClick={handleSubscription}>Upgrade to <span className='premium'>Premium?</span></a> 
                    </div>
                )}
                {subscriptionData.subscriptionStatus === "pending" &&(
                    <div className='premiumLink'>
                        Premium Subscription
                        <a href="" onClick={handlePendingSubscription}> <span className='premium'>Status</span></a> 
                    </div>
                )}
                {subscriptionData.subscriptionStatus === "rejected" &&(
                    <div className='premiumLink'>
                        Premium Subscription
                        <a href="" onClick={handleRejectedSubscription}> <span className='danger'>Status</span></a> 
                    </div>
                )}

                    <div className='accountInfo'>
                        <div>
                            <button className='userIcon' onClick={(e) => {e.stopPropagation(); toggleDropUp();}} ref={iconRef}>
                                <FaIcons.FaUserAlt />
                            </button>
                        </div>
                        {showDropup && (
                            <div className="dropupContent" ref={menuRef}>
                                <ul>
                                    {
                                        Menus.map((menu, index)=> ( // Add 'index' here
                                        <Link to={menu.path} onClick={menu.function} key={index} >
                                                <li key={index} > {/* Use 'index' as key here */}
                                                    {menu.name}
                                                </li>
                                            </Link>
                                        ))
                                    }
                                </ul>
                            </div>
                        )}
                        <div className='userInfo'>
                            <div className="dropup">
                                <a className='userName'>{userName}</a>
                            </div>
                            <p className='userType'>{userType}</p>
                        </div>
                            
                    </div>
                </div>
            </SideMenuContainer>
        </>
    )
}

export default SideMenu;
