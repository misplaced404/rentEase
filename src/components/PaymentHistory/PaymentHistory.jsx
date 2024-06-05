import {useState, useEffect} from 'react';
import SideMenu from '../SideMenu/SideMenu'
import { PaymentsContainer } from './PaymentHistory.styled'
import { FaFileCircleQuestion } from "react-icons/fa6";
import { doc, getDoc, getDocs, getFirestore, collection, onSnapshot  } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { addMonths, addYears, addWeeks, addDays, format } from 'date-fns';




function PaymentHistory() {

  const [combinedData, setCombinedData] = useState([]);

  useEffect(() => {
    const db = getFirestore();
    const auth = getAuth();
    const userId = auth.currentUser.uid;

    // Store the previous paymentProof lengths
    let prevPaymentProofLengths = {};

    const fetchTransactions = async () => {
        // Fetch renters data
        const rentersSnapshot = await getDocs(collection(db, "renters"));
        const rentersData = rentersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Update the previous paymentProof lengths
        rentersData.forEach(renter => {
            prevPaymentProofLengths[renter.id] = renter.paymentProof ? renter.paymentProof.length : 0;
        });

        // Fetch properties and users data for each renter
        const combinedData = await Promise.all(rentersData.map(async renter => {
            if (renter.propertyId) { 
                const propertySnapshot = await getDoc(doc(db, "properties", renter.propertyId));
                const propertyData = propertySnapshot.data();
                console.log('Properties', propertyData);

                // If the current user is not the owner of the property and not the renter, skip this renter
                if (propertyData.userId !== userId && renter.userId !== userId) {
                    return null;
                }

                const userSnapshot = await getDoc(doc(db, "users", renter.userId));
                const userData = userSnapshot.data();
                const isPaymentMade = renter.paymentProof && renter.paymentProof.length > prevPaymentProofLengths[renter.id];
                const isPaymentReceived = !isPaymentMade;

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

                return {
                    ...renter,
                    id: renter.id.substring(0, 5),
                    propertyName: propertyData.propertyName,
                    propertyLocation: propertyData.propertyLocation,
                    propertyAvailability: propertyData.propertyAvailability,
                    renterName: userData.firstName,
                    renterLastName: userData.lastName,
                    propOwner: propertyData.propertyOwner,
                    renterAddress: userData.CurrentAddress,
                    startDate: renter.startDate,
                    lastPaymentMade: renter.lastPaymentMade,
                    nextPaymentDue: nextPaymentDueDate ? format(nextPaymentDueDate, 'MM/dd/yyyy') : null,
                    isPaymentMade, 
                    isPaymentReceived,
                };
            }
        }));

        // Filter out null values (which were renters for properties not owned by the current user and not rented by the current user)
        const filteredCombinedData = combinedData.filter(data => data !== null);

        setCombinedData(filteredCombinedData);
        console.log("COMBINED", filteredCombinedData);
    };

    // Call fetchTransactions initially
    fetchTransactions();

    // Set up a listener for the "renters" collection
    const rentersUnsub = onSnapshot(collection(db, "renters"), (snapshot) => {
        let paymentProofUpdated = false;

        snapshot.docChanges().forEach((change) => {
            if (change.type === "modified") {
                const newPaymentProofLength = change.doc.data().paymentProof ? change.doc.data().paymentProof.length : 0;
                const prevPaymentProofLength = prevPaymentProofLengths[change.doc.id];

                if (newPaymentProofLength > prevPaymentProofLength) {
                    paymentProofUpdated = true;
                    prevPaymentProofLengths[change.doc.id] = newPaymentProofLength;
                }
            }
        });

        if (paymentProofUpdated) {
            fetchTransactions();
        }
    });

    // Clean up the listener when the component unmounts
    return () => {
        rentersUnsub();
    };
}, []);

return (
  <>
    <SideMenu/>
    <PaymentsContainer>
      <div className="header">
        <h1>Payment History Logs</h1>
      </div>
      <div className="body">
        <div className="ownerHistory">
          <div className='paymentTableContainer'>
            <div className='paymentTableHeader'>
              <div className='paymentTableRow'>
                <div className='tableHead'>Transaction ID</div>
                <div className='tableHead'>Payment Date</div>
                <div className='tableHead'>Due Date</div>
                <div className='tableHead'>Payment Role</div>
                <div className='tableHead person'>Payment from/to</div>
                <div className='tableHead propertyName'>Property Name</div>
              </div>
            </div>
            <div className='paymentTableBody'>
              {combinedData.length > 0 ? combinedData.map((data, index) => (
                <div className="paymentTableRow" key={index}>
                  <div className='tableData'>{data.id}</div>
                  <div className='tableData'>{data.lastPaymentMade}</div>
                  <div className='tableData'>{data.nextPaymentDue}</div>
                  <div className='tableData'>{data.isPaymentMade ? 'Paid' : data.isPaymentReceived ? 'Received' : 'Unknown'} {/* Display payment status */}</div>
                  <div className='tableData person'>{data.isPaymentMade ? data.propOwner : data.isPaymentReceived ? `${data.renterName} ${data.renterLastName}` : 'Unknown'}
                      {/* Display owner name if payment made, or renter name if payment received */}</div>
                  <div className='tableData propertyName'>{data.propertyName}</div>
                </div>
              )) : (
                <div className="emptyTable">
                  <FaFileCircleQuestion className='icon'/>
                  <span className='emptyText'>You have not made or received any payments yet.</span>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </PaymentsContainer>
    </>
  );
}

export default PaymentHistory;
