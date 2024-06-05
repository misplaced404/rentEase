/* eslint-disable no-unused-vars */
import { PaymentHistoryTableContainer } from './PaymentHistoryTable.styled'
import { BiSolidDownload } from "react-icons/bi";
import { useEffect, useState} from 'react';
import { doc, getDoc, getDocs, getFirestore, collection, query, where  } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { addMonths, addYears, format } from 'date-fns';
import React from 'react';

function PaymentHistoryTable() {

    const [rentRequests, setRentRequests] = useState([]);
    const [property, setProperty] = useState([]);

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
  
          // Fetch properties and users data for each renter
          const combinedRentRequests = await Promise.all(rentersData.map(async renter => {
              if (renter.propertyId && renter.applicationStatus === "Completed") { 
                  const propertySnapshot = await getDoc(doc(db, "properties", renter.propertyId));
                  const propertyRef = propertySnapshot.data();
                  setProperty(propertyRef)

                  const propertyData = propertyRef.filter(property => property.lastPaymentMade);
                  console.log("propertyData",propertyData);
  
                  let nextPaymentDueDate = null;
                  const lastPaymentMade = renter.lastPaymentMade ? new Date(renter.lastPaymentMade) : null;
  
                  if (lastPaymentMade) {
                      switch (propertyData.rateType) {
                          case 'Yearly':
                              nextPaymentDueDate = addYears(lastPaymentMade, 1);
                              break;
                          case 'Monthly':
                              nextPaymentDueDate = addMonths(lastPaymentMade, 1);
                              break;
                          default:
                              console.log('Invalid rate type');
                      }
                  }
                  return {
                      ...renter,
                      startDate: renter.startDate,
                      lastPaymentMade: renter.lastPaymentMade,
                      nextPaymentDue: nextPaymentDueDate ? format(nextPaymentDueDate, 'MM/dd/yyyy') : null,
                  };
              }
          }));
  
          // Filter out null values (which were renters for properties not owned by the current user)
          const filteredRentRequests = combinedRentRequests.filter(data => data !== undefined);
          setRentRequests(filteredRentRequests);
      };
      fetchUserRentRequests();
  }, []);
  

      return (
        <PaymentHistoryTableContainer>
          <div className='paymentTableHeader'>
            <div className='paymentTableRow'>
              <div className='tableHead'>Due Date</div>
              <div className='tableHead'>Date of Payment</div>
              <div className='tableHead'>Proof of Payment</div>
            </div>
          </div>
          <div className='paymentTableBody'>
          {rentRequests.map((request, index) => {
            const { nextPaymentDue, lastPaymentMade, paymentProof } = request;
            return (Array.isArray(paymentProof) ? paymentProof : [paymentProof]).map((proof, proofIndex) => (
              <div className="paymentTableRow" key={`${index}-${proofIndex}`}>
                <div className='tableData'>{nextPaymentDue}</div>
                <div className='tableData'>{lastPaymentMade}</div>
                <div className='tableData'>
                  <button className='download' onClick={() => window.open(proof)}><BiSolidDownload/></button>
                </div>
              </div>
            ));
          })}


          </div> {/* end of tableBody */}
        </PaymentHistoryTableContainer>
      );
      
      
}

export default PaymentHistoryTable