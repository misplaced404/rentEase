/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import {AdminUserManagementContainer} from './AdminUserManagement.styled'
import { Link } from 'react-router-dom'
import logo from '../../../assets/Logo/RentEase Logo2.png'
import { getFirestore, collection, getDoc, getDocs,addDoc, doc, updateDoc, onSnapshot, where, query } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as Actions from "./Actions/Actions"
import Swal from 'sweetalert2'; 

function AdminUserManagement() {
    const [activeTab, setActiveTab] = useState('User Management');
    const [users, setUsers] = useState([]);
    const [applicants, setApplicants] = useState([]);
    const [properties, setProperties] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    
    useEffect(() => {
        const db = getFirestore();
        const usersRef = collection(db, "users");

        // Listen for real-time updates
        const unsubscribe = onSnapshot(usersRef, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersData);

            // Filter users with a registrationStatus property
            const applicantsData = usersData.filter(user => user.registrationStatus && user.userType == "Renter");
            setApplicants(applicantsData);
        });

        // Clean up the listener when the component unmounts
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const db = getFirestore();
        const propertyRef = collection(db, "properties");
    
        // Query for documents where 'propertyVerification' matches "pending"
        const queryRef = query(propertyRef, where('propertyVerification', '==', 'pending'));
    
        // Listen for real-time updates
        const unsubscribe = onSnapshot(queryRef, (snapshot) => {
            const propertyData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProperties(propertyData);
    
            // Log the property data
            console.log(propertyData);
        });
    
        // Clean up the listener when the component unmounts
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const db = getFirestore();
        const propertyRef = collection(db, "subscription payments");
        const userRef = collection(db, "users"); // Assuming 'users' is your user collection
        const propertiesRef = collection(db, "properties"); // Assuming 'properties' is your properties collection
    
        // Fetch all users
        getDocs(userRef).then((userSnapshot) => {
            const allUsers = userSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
    
            // Query for documents where 'subscriptionStatus' matches "pending"
            const queryRef = query(propertyRef, where('subscriptionStatus', '==', 'pending'));
    
            // Listen for real-time updates
            const unsubscribe = onSnapshot(queryRef, async (snapshot) => { // Make this function async
                const subscriptionData = await Promise.all(snapshot.docs.map(async doc => {
                    const data = doc.data();
    
                    // Find the user data using userId
                    const userData = allUsers.find(user => user.id === data.userId); // Assuming 'userId' is the field containing the user ID
    
                    // Query for properties where 'userId' matches the user's ID
                    const propertyQueryRef = query(propertiesRef, where('userId', '==', data.userId));
                    const propertySnapshot = await getDocs(propertyQueryRef);
                    const userProperties = propertySnapshot.docs.length; // Get the number of properties
    
                    return {
                        id: doc.id,
                        ...data,
                        user: userData, // Add user data to the subscription data
                        properties: userProperties // Add the number of properties to the subscription data
                    };
                }));
    
                setSubscriptions(subscriptionData);
    
                // Log the property data
                console.log("Subscription", subscriptionData);
            });
    
            // Clean up the listener when the component unmounts
            return () => unsubscribe();
        });
    }, []);
    
    
    
    
  return (
    <AdminUserManagementContainer>
        <div className="navBar">
            <div className="logo">
                <img src={logo} alt="" />
                <span>RentEase</span>
            </div>
            <Link to={"../admin"} className='logout'>Logout</Link>
        </div>
        <div className="body">
            <div className="header">
                <div className={`tab ${activeTab === 'User Management' ? 'active' : ''}`} onClick={() => setActiveTab('User Management')}>
                    <h1>User Management</h1>
                </div>
                <div className={`tab ${activeTab === 'Owner Verification' ? 'active' : ''}`} onClick={() => setActiveTab('Owner Verification')}>
                    <h1>Owner Verification</h1>
                </div>
                <div className={`tab ${activeTab === 'Subscription Payments' ? 'active' : ''}`} onClick={() => setActiveTab('Subscription Payments')}>
                    <h1>Subscription Payments</h1>
                </div>
                <div className={`tab ${activeTab === 'Property Verification' ? 'active' : ''}`} onClick={() => setActiveTab('Property Verification')}>
                    <h1>Property Verification</h1>
                </div>
            </div>
            {activeTab === 'User Management' && (
                <div className="table">
                    <div className="tableHeader">
                        <div className="headerRow">
                            <div className="headerData">
                                User Id
                            </div>
                            <div className="headerData">
                                Display Name
                            </div>
                            <div className="headerData">
                                User Type
                            </div>
                            <div className="headerData">
                                Subscription
                            </div>
                            <div className="headerData">
                                Actions
                            </div>
                        </div>
                    </div>
                    <div className="tableBody">
                        {users.map(user => (
                            <div className="bodyRow" key={user.id}>
                                <div className="tableData">
                                    {user.id.substring(0, 5)}
                                </div>
                                <div className="tableData">
                                    {user.firstName + " " + user.lastName}
                                </div>
                                <div className="tableData">
                                    {user.userType}
                                </div>
                                <div className="tableData">
                                    {user.subscription? user.subscription : "none"}
                                </div>
                                <div className="tableData">
                                    <div className="actionBtns">
                                        <button className='view' onClick={() =>Actions.handleViewUser(user.id)}>View</button>
                                        <button className='edit' onClick={() =>Actions.handleEditUser(user.id)}>Edit</button>
                                        <button className='delete' onClick={() =>Actions.handleDelete(user.id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {activeTab === 'Owner Verification' && (
                <div className="table">
                <div className="tableHeader">
                    <div className="headerRow">
                        <div className="headerData">
                            Applicant's Id
                        </div>
                        <div className="headerData">
                            Applicant's Name
                        </div>
                        <div className="headerData">
                            Registration Status
                        </div>
                        <div className="headerData">
                            Actions
                        </div>
                    </div>
                </div>
                <div className="tableBody">
                    {applicants.map(applicant => (
                        <div className="bodyRow" key={applicant.id}>
                             <div className="tableData">
                                {applicant.id.substring(0, 5)}
                            </div>
                            <div className="tableData">
                                {applicant.firstName + " " + applicant.lastName}
                            </div>
                            <div className="tableData">
                                {applicant.registrationStatus}
                            </div>
                            <div className="tableData">
                                <div className="actionBtns">
                                    <button className='view' onClick={() => Actions.handleViewApplication(applicant.id)}>View</button>
                                    <button className='approve' onClick={() =>Actions.handleApproveOwner(applicant.id)}>Approve</button>
                                    <button className='reject' onClick={() => Actions.handleRejectOwner(applicant.id)}>Reject</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            )}
            {activeTab === 'Subscription Payments' && (
                <div className="table">
                    <div className="tableHeader">
                        <div className="headerRow">
                            <div className="headerData">
                                Payment Id
                            </div>
                            <div className="headerData">
                                User Id
                            </div>
                            <div className="headerData">
                                User Name
                            </div>
                            <div className="headerData">
                                No. of Properties
                            </div>
                            <div className="headerData">
                                Selected Subscription
                            </div>
                            <div className="headerData">
                                Actions
                            </div>
                        </div>
                    </div>
                    <div className="tableBody">
                        {subscriptions.map(subscription => (
                            <div className="bodyRow" key={subscription.id}>
                                <div className="tableData">
                                    {subscription.id.substring(0,5)} 
                                </div>
                                <div className="tableData">
                                    {subscription.userId.substring(0,5)} 
                                </div>
                                <div className="tableData">
                                    {subscription.user.firstName} {subscription.user.lastName} 
                                </div>
                                <div className="tableData">
                                    {subscription.properties}
                                </div>
                                <div className="tableData">
                                    {subscription.subscriptionType}
                                </div>
                                <div className="tableData">
                                    <div className="actionBtns">
                                        <button className='view' onClick={() => Actions.handleViewSubscription(subscription.id)}>View</button>
                                        <button className='approve' onClick={() =>Actions.handleApproveSubscription(subscription.id)}>Approve</button>
                                        <button className='reject' onClick={() => Actions.handleRejectSubscription(subscription.id)}>Reject</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'Property Verification' && (
                <div className="table">
                    <div className="tableHeader">
                        <div className="headerRow">
                            <div className="headerData">Property Id</div>
                            <div className="headerData">Owner Name</div>
                            <div className="headerData">Property Name</div>
                            <div className="headerData">Property Address</div>
                            <div className="headerData">Property Status</div>
                            <div className="headerData">Actions</div>
                        </div>
                    </div>
                    <div className="tableBody">
                        {properties.map(property => (
                            <div className="bodyRow" key={property.id}>
                                <div className="tableData">{property.id.substring(0, 5)}</div>
                                <div className="tableData">{property.propertyOwner}</div>
                                <div className="tableData">{property.propertyName}</div>
                                <div className="tableData">{property.propertyLocation}</div>
                                <div className="tableData">{property.propertyVerification}</div>
                                <div className="tableData">
                                    <div className="actionBtns">
                                        <button className='view' onClick={() => Actions.handleViewProperty(property.id)}>View</button>
                                        <button className='approve' onClick={() => Actions.handleApproveProperty(property.id)}>Approve</button>
                                        <button className='reject' onClick={() => Actions.handleRejectProperty(property.id)}>Reject</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

    </AdminUserManagementContainer>
  )
}

export default AdminUserManagement