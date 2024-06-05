/* eslint-disable no-unused-vars */
import React from 'react'
import SideMenu from '../SideMenu/SideMenu';
import { TransactionContainer } from './TransactionManagement.styled';
import { IoMdSearch,IoIosTrash, IoIosRefresh  } from "react-icons/io";
import { FaCoins, FaCheck  } from "react-icons/fa";
import { FaUserCheck,FaUserXmark  } from "react-icons/fa6";
import { AiFillMessage } from "react-icons/ai";
import { BsFillPersonVcardFill } from "react-icons/bs";
import * as Action from './Actions/Actions';
import { getFirestore, collection, getDocs, getDoc, doc, where, query, onSnapshot  } from "firebase/firestore";
import { useState, useEffect } from 'react';
import { getAuth  } from 'firebase/auth';
import { Link } from 'react-router-dom';

function Transaction() {

    const [combinedData, setCombinedData] = useState([]);
    const [rentRequests, setRentRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('renter');

    useEffect(() => {
        const fetchTransactions = () => {
            console.log("fetchTransactions called");
            const db = getFirestore();
            const auth = getAuth();
            const userId = auth.currentUser.uid;
    
            // Fetch renters data
            const rentersRef = collection(db, "renters");
            const unsubscribeRenters = onSnapshot(rentersRef, async (rentersSnapshot) => {
                const rentersData = rentersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
    
                // Fetch properties and users data for each renter
                const combinedData = await Promise.all(rentersData.map(async renter => {
                    try {
                        if (renter.propertyId) { 
                            const propertyRef = doc(db, "properties", renter.propertyId);
                            const propertySnapshot = await getDoc(propertyRef);
                            const propertyData = propertySnapshot.data();
    
                            // If the current user is not the owner of the property, skip this renter
                            if (propertyData.userId !== userId) {
                                return null;
                            }
    
                            const userRef = doc(db, "users", renter.userId);
                            const userSnapshot = await getDoc(userRef);
                            const userData = userSnapshot.data();
    
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
                            };
                        }
                    } catch (error) {
                        console.error("Error processing renter", renter, ":", error);
                        return null;  // Return null if there was an error
                    }
                }));
    
                // Filter out null values (which were renters for properties not owned by the current user)
                const filteredCombinedData = combinedData.filter(data => data !== null);
                setCombinedData(filteredCombinedData);
                console.log ("Combined rent reqs", filteredCombinedData );
            });
    
            // Return a function that removes the listener
            return () => unsubscribeRenters();
        };
    
        fetchTransactions();
    }, []);
    
    
    useEffect(() => {
        const fetchUserRentRequests = () => {
            console.log("fetchUserRentRequests called");
            const db = getFirestore();
            const auth = getAuth();
            const userId = auth.currentUser.uid;
    
            // Fetch renters data where the current user is the renter
            const rentersRef = collection(db, "renters");
            const q = query(rentersRef, where("userId", "==", userId));
            const unsubscribeRenters = onSnapshot(q, async (rentersSnapshot) => {
                const rentersData = rentersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));    
    
                // Fetch properties and users data for each renter
                const combinedRentRequests = await Promise.all(rentersData.map(async renter => {
                    try {
                        if (renter.propertyId) { 
                            const propertyRef = doc(db, "properties", renter.propertyId);
                            const propertySnapshot = await getDoc(propertyRef);
                            const propertyData = propertySnapshot.data();
    
                            const ownerRef = doc(db, "users", propertyData.userId);
                            const ownerSnapshot = await getDoc(ownerRef);
                            const ownerData = ownerSnapshot.data();
    
                            return {
                                ...renter,
                                propName: propertyData.propertyName,
                                propertyLocation: propertyData.propertyLocation,
                                propertyAvailability: propertyData.propertyAvailability,
                                ownerName: ownerData.firstName,
                                ownerLastName: ownerData.lastName,
                                ownerAddress: ownerData.CurrentAddress,
                                ownerNum: ownerData.contactNum,
                                ownerEmail: ownerData.email,
                                propertyImage: propertyData.propertyImages[0],
                                propertyType: propertyData.propertyType,
                                propertyRate: propertyData.propertyRate,
                                rateType: propertyData.rateType,
                                ownerId: propertyData.userId,
                                qrcodes: propertyData.qrCodes,
                            };
                        }
                    } catch (error) {
                        console.error("Error processing renter", renter, ":", error);
                        return null;  // Return null if there was an error
                    }
                }));
    
                // Filter out null values (which were renters for properties not owned by the current user)
                const filteredRentRequests = combinedRentRequests.filter(data => data !== null);
                setRentRequests(filteredRentRequests);
            });
    
            // Return a function that removes the listener
            return () => unsubscribeRenters();
        };
    
        fetchUserRentRequests();
    }, []);
    
  return (
    <>
        <SideMenu/>
        <TransactionContainer>
            <div className="header">
                <h1>Transaction</h1>
            </div>
            <div className="body">
                <div className="tabContainer">
                    <div className={`tab ${activeTab === 'owner' ? 'active' : ''}`} onClick={() => setActiveTab('owner')}>Owned Property</div>
                    <div className={`tab ${activeTab === 'renter' ? 'active' : ''}`} onClick={() => setActiveTab('renter')}>Rented Property</div>
                </div>
                {activeTab === 'owner' && (
                    <div className="ownerContent">
                        <h2>Renter Applicants</h2>
                        <div className='table'>
                            <div className='tableHeader'>
                                <div className='tableRow'>
                                    <div className='tableHead first'> 
                                        <img className='' src='../src/assets/Logo/RentEase Logo2_inv.png'></img>
                                        <span className='logoName'>RentEase</span>
                                    </div>
                                    <div className='tableHead'>Property Name</div>
                                    <div className='tableHead'>Property Location</div>
                                    <div className='tableHead'>Renter Name</div>
                                    <div className='tableHead'>Duration of Stay</div>
                                    <div className='tableHead'>Availability</div>
                                    <div className='tableHead'>Application Status</div>
                                    <div className='tableHead last'>Actions</div>
                                </div>
                            </div>
                            <div className='tableBody'>
                                {combinedData.map((renter, index) => {
                                    return (
                                    <div key={index} className='tableRow'>
                                        <div className='tableData image'>
                                        <div className="imgContainer">
                                            <img src={renter.renterImage} />
                                        </div>
                                        </div>
                                        <div className='tableData'>{renter.propertyName}</div>
                                        <div className='tableData'>{renter.propertyLocation}</div>
                                        <div className='tableData'>{renter.renterName} {renter.renterLastName}</div>
                                        <div className='tableData'>{renter.duration.number} {renter.duration.unit}</div>
                                        <div className='tableData'>{renter.propertyAvailability}</div>
                                        <div className='tableData'>
                                            {renter.applicationStatus !== 'Rejected' && <span className=''>{renter.applicationStatus}</span>}
                                            {renter.applicationStatus == 'Rejected' && <><span className='danger'>{renter.applicationStatus}</span> 
                                            <a onClick={() => Action.handleReason(renter)}>Click here to see reason</a> </>}
                                        </div>
                                            <div className='tableData actionBtn'>
                                                <button className='info' onClick={() => Action.handleViewRenter(renter)}><BsFillPersonVcardFill className='icon'/>Info</button>
                                                <button className='message' onClick={() => Action.handleMessage('', renter)} disabled={!renter}><AiFillMessage className='icon'/>Message</button>
                                                {renter.applicationStatus === 'Pending' && (
                                                    <>
                                                        <button className='accept' onClick={() => Action.handleAccept(renter)}><FaUserCheck className='icon'/>Accept</button>
                                                        <button className='reject' onClick={() => Action.handleReject(renter)}><FaUserXmark className='icon'/>Reject</button>
                                                    </>
                                                )}
                                                {renter.applicationStatus === 'Waiting for Payment' && null}
                                                {renter.applicationStatus === 'Waiting Acknowledgement' && (
                                                    <button className='payment' onClick={() => Action.handlePaymentReview(renter)}><FaCoins className='icon'/>Payment</button>
                                                )}
                                                {renter.applicationStatus === 'Rejected' && (
                                                    <button className='remove' onClick={() => Action.handleRemove(renter)}><IoIosTrash className='icon'/>Remove</button>
                                                )}
                                                {renter.applicationStatus === 'Completed' && null}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'renter' && (
                    <div className="renterContent">
                        <h2>Applied Properties</h2>
                        <div className='table'>
                            <div className='tableHeader'>
                                <div className='tableRow'>
                                    <div className='tableHead first'> 
                                        <img className='' src='../src/assets/Logo/RentEase Logo2_inv.png'></img>
                                        <span className='logoName'>RentEase</span>
                                    </div>
                                    <div className='tableHead'>Property Name</div>
                                    <div className='tableHead'>Property Type</div>
                                    <div className='tableHead'>Location</div>
                                    <div className='tableHead'>Rate</div>
                                    <div className='tableHead'>Availability</div>
                                    <div className='tableHead'>Application Status</div>
                                    <div className='tableHead last'>Actions</div>
                                </div>
                            </div>
                            <div className='tableBody'>
                                    {rentRequests.map((request, index) => (
                                        <div className='tableRow' key={index}>
                                            <div className='tableData'>
                                                <div className="imgContainer">
                                                    <img src={request.propertyImage} />
                                                </div>
                                            </div>
                                            <div className='tableData'>{request.propName}</div>
                                            <div className='tableData'>{request.propertyType}</div>
                                            <div className='tableData'>{request.propertyLocation}</div>
                                            <div className='tableData'>{request.propertyRate} {request.rateType}</div>
                                            <div className='tableData'>{request.propertyAvailability}</div>
                                            <div className='tableData'>{request.applicationStatus}</div>
                                            <div className='tableData actionBtn'>
                                                {request.applicationStatus === 'Pending' && (
                                                <>
                                                    <Link to={`./detail/${request.propertyId}`} style={{ textDecoration: 'none' }}><button className='view'><IoMdSearch className='icon'/>View</button></Link>
                                                    <button className='remove' onClick={() => Action.handleRemove(request)}><IoIosTrash className='icon'/>Remove</button>                                            </>
                                                )}
                                                {request.applicationStatus === 'Waiting for Payment' && (
                                                    <>
                                                        <button className='payment'  onClick={() => Action.handlePayment(request)}><FaCoins className='icon'/>Pay</button> 
                                                        <Link to={`./detail/${request.propertyId}`} style={{ textDecoration: 'none' }}><button className='view'><IoMdSearch className='icon'/>View</button></Link>
                                                        <button className='remove'><IoIosTrash className='icon'/>Remove</button>
                                                    </>
                                                )}
                                                {request.applicationStatus === 'Waiting Acknowledgement' && (
                                                    <>
                                                        {/* <button className='payment'  onClick={() => Action.handlePayment(request)}><FaCoins className='icon'/>Pay</button>  */}
                                                        <Link to={`./detail/${request.propertyId}`} style={{ textDecoration: 'none' }}><button className='view'><IoMdSearch className='icon'/>View</button></Link>
                                                        <button className='remove' onClick={() => Action.handleRemove(request)}><IoIosTrash className='icon'/>Remove</button>
                                                    </>
                                                )}
                                                {request.applicationStatus === 'Completed' && (
                                                    <>
                                                        <Link to={`./detail/${request.propertyId}`} style={{ textDecoration: 'none' }}><button className='view'><IoMdSearch className='icon'/>View</button></Link>
                                                        <button className='remove' onClick={() => Action.handleRemove(request)}><IoIosTrash className='icon'/>Remove</button>
                                                    </>
                                                )}
                                                {request.applicationStatus === 'Rejected' && (
                                                    <>
                                                        <button className='refresh' onClick={() =>Action.handleReapply(request)}><IoIosRefresh className='icon'/>Reapply</button>
                                                        <Link to={`./detail/${request.propertyId}`} style={{ textDecoration: 'none' }}><button className='view'><IoMdSearch className='icon'/>View</button></Link>
                                                        <button className='remove' onClick={() => Action.handleRemove(request)}><IoIosTrash className='icon'/>Remove</button>
                                                    </>
                                                )}
                                                {request.applicationStatus === 'Requested to resend payment' && (
                                                    <>
                                                        <button className='payment'  onClick={() => Action.handlePayment(request)}><FaCoins className='icon'/>Pay</button> 
                                                        <Link to={`./detail/${request.propertyId}`} style={{ textDecoration: 'none' }}><button className='view'><IoMdSearch className='icon'/>View</button></Link>
                                                        <button className='remove' onClick={() => Action.handleRemove(request)}><IoIosTrash className='icon'/>Remove</button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                            </div>
                        </div>
                    </div>
                )}
            </div>
        </TransactionContainer>
    </>
  )
}


export default Transaction;