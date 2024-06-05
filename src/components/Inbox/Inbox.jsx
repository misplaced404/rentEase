import {useState, useEffect} from 'react'
import SideMenu from '../SideMenu/SideMenu'
import { InboxContainer } from './Inbox.styled'
import { IoSend } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import logo from "../../assets/Logo/RentEase Logo2.png"
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { addDoc, getDocs, getFirestore, collection,query, where, orderBy, serverTimestamp,onSnapshot  } from 'firebase/firestore';



export default function Inbox() {
  const [messages, setMessages] = useState([])
  const [user, setUser] = useState(null);
  const [interlocutor, setInterlocutor] = useState(null);
  const [interlocutorId, setInterlocutorId] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [inputMessage, setInputMessage] = useState('');


  useEffect(() => {
    const auth = getAuth();
    
    onAuthStateChanged(auth, async (user) => {
      const db = getFirestore();
      if (user) {
        const currentUserId = user.uid;
        setUser(user.displayName);
        if (currentUserId) {
          const initialContacts = await getInitialContacts(db, currentUserId);
          setContacts(initialContacts);
          if (initialContacts.length > 0) {
            handleContact(initialContacts[0]);
          }
          listenForContactUpdates(db, currentUserId, setContacts);
        } else {
          console.log('User ID is undefined.');
        }
      } else {
        console.log('No user is currently signed in.');
      }
    });
  }, []);


  async function getInitialContacts(db, currentUserId) {
    const messagesRef = collection(db, "messages");
  
    // Create two separate queries for senderId and recipientId
    const senderQuery = query(
      messagesRef,
      where("senderId", "==", currentUserId),
      orderBy("sentTime", "desc")
    );
    const recipientQuery = query(
      messagesRef,
      where("recipientId", "==", currentUserId),
      orderBy("sentTime", "desc")
    );
  
    // Fetch the initial contacts
    let contacts = [];
    const senderSnapshot = await getDocs(senderQuery);
    senderSnapshot.forEach((doc) => {
      let data = doc.data();
      contacts.push({
        name: data.recipientName,
        smallMessage: data.message,
        sentTime: data.sentTime,
        id: data.recipientId
      });
    });
  
    const recipientSnapshot = await getDocs(recipientQuery);
    recipientSnapshot.forEach((doc) => {
      let data = doc.data();
      contacts.push({
        name: data.senderName,
        smallMessage: data.message,
        sentTime: data.sentTime,
        id: data.senderId
      });
    });
  
    // Remove duplicates and keep the contact with the most recent message
    contacts = Object.values(
      contacts.reduce((acc, { name, smallMessage, sentTime, id }) => {
        acc[name] = acc[name]
        ? acc[name].sentTime && sentTime && acc[name].sentTime.toDate() > sentTime.toDate()
          ? acc[name]
          : { name, smallMessage, sentTime, id }
        : { name, smallMessage, sentTime, id };
        return acc;
      }, {})
    );
  
    // Sort contact by sentTime in ascending order
    contacts.sort(
      (a, b) => new Date(b.sentTime).getTime() - new Date(a.sentTime).getTime()
    );
  
    return contacts;
  }

  function listenForContactUpdates(db, currentUserId, setContacts) {
    const messagesRef = collection(db, "messages");

  // Create two separate queries for senderId and recipientId
  const senderQuery = query(
    messagesRef,
    where("senderId", "==", currentUserId),
    orderBy("sentTime", "desc")
  );
  const recipientQuery = query(
    messagesRef,
    where("recipientId", "==", currentUserId),
    orderBy("sentTime", "desc")
  );

  // Listen for real-time updates on senderQuery and recipientQuery
  const unsubscribe1 = onSnapshot(senderQuery, (querySnapshot) => {
    let contacts = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      contacts.push({
        name: data.recipientName,
        smallMessage: data.message,
        sentTime: data.sentTime,
        id: data.recipientId
      });
    });

    onSnapshot(recipientQuery, (querySnapshot2) => {
      querySnapshot2.forEach((doc) => {
        let data = doc.data();
        contacts.push({
          name: data.senderName,
          smallMessage: data.message,
          sentTime: data.sentTime,
          id: data.senderId
        });
      });

      // Remove duplicates and keep the contact with the most recent message
      contacts = Object.values(
        contacts.reduce((acc, { name, smallMessage, sentTime, id }) => {
          acc[name] = acc[name]
          ? acc[name].sentTime && sentTime && acc[name].sentTime.toDate() > sentTime.toDate()
            ? acc[name]
            : { name, smallMessage, sentTime, id }
          : { name, smallMessage, sentTime, id };
          return acc;
        }, {})
      );

      // Sort contact by sentTime in ascending order
      contacts.sort(
        (a, b) => new Date(b.sentTime).getTime() - new Date(a.sentTime).getTime()
      );

      setContacts(contacts);
    });

    // Return a cleanup function to unsubscribe from the listeners when the component unmounts
    return () => {
      unsubscribe1();
    };
  });
  }
 

  const handleSendMessage = async(event, recipientId) => {
    const auth = getAuth();
    const user = auth.currentUser
    const userId = user.uid;
    const userName = user.displayName;
    const db = getFirestore();

      // Check if the event is from a key press
    if (event.type === 'keydown') {
      if (event.key === 'Enter') {
        if (event.shiftKey) {
          // Allow new line when Shift + Enter is pressed
          return;
        } else {
          // Prevent new line
          event.preventDefault();
        }
      } else {
        // If the key pressed is not 'Enter', do nothing
        return;
      }
    }

    // Send data here
    const messageData = {
      senderId: userId, // assuming you have the user's ID
      senderName: userName,
      recipientId: recipientId, 
      recipientName: interlocutor, 
      message: inputMessage, // the message text
      sentTime: serverTimestamp()
    };
    console.log(messageData);
    await addDoc(collection(db, "messages"), messageData);
    // Clear the textarea
    setInputMessage('');


  }

  const handleContact = (contact) => {
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;
    const userId = user.uid;
  
    setInterlocutor(contact.name);
    setInterlocutorId(contact.id);
  
    if (userId && contact.id) {
      // Create a reference to the messages collection
      const messagesRef = collection(db, "messages");
  
      // Create two queries against the collection for messages involving the current user and the selected contact
      const q1 = query(
        messagesRef,
        where("senderId", "==", userId),
        where("recipientId", "==", contact.id),
        orderBy("sentTime")
      );
  
      const q2 = query(
        messagesRef,
        where("senderId", "==", contact.id),
        where("recipientId", "==", userId),
        orderBy("sentTime")
      );
  
      // Listen for real-time updates on q1 and q2
      const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
        let messages = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          messages.push({name: data.senderName , message: data.message, sentTime: data.sentTime});
        });
  
        onSnapshot(q2, (querySnapshot2) => {
          querySnapshot2.forEach((doc) => {
            let data = doc.data();
            messages.push({name: data.senderName , message: data.message, sentTime: data.sentTime});
          });
  
          // Sort messages by sentTime
          messages.sort((a, b) => b.sentTime - a.sentTime);
  
          setMessages(messages);
        });
      });
  
      // Return a cleanup function to unsubscribe from the listeners when the component unmounts
      return () => {
        unsubscribe1();
      };
    } else {
      console.log('displayName or contact.name is undefined');
    }
  };

  return (
    <>
        <SideMenu/>
        <InboxContainer>
          

            <div className="header">
              <h1>Inbox</h1>
            </div>
            <div className="body">
              <div className="inboxArea">
                <div className="contactsContainer">
                  <div className="searchField">
                    <span><FaSearch className='icon'/></span>
                    <input type="text" name="search" className="search" placeholder='Search User Here' />
                  </div>
                  <div className='contactList'>
                      <div className="emptyContacts">
                    
                    </div>
                    {contacts.map((contact, index) => (
                      <div className="contact" key={index} onClick={() => handleContact(contact)}>
                      <div className='imgContainer'>
                      <img src={logo} alt="" />
                      </div>
                      <div className='contactDetails'>
                          <span className='userName'>{contact.name}</span>
                          <span className='smallMessage'>{contact.smallMessage}</span>
                        </div>
                        </div>
                    ))}
                  </div>
                </div>
                  <div className="conversationContainer">
                    <div className="conversationHeader">
                      <div className='imgContainer'>
                        <img src={logo} alt="" />
                        </div>
                      <span className='userName'>{interlocutor}</span>
                    </div>
                    <div className="conversationArea">
                      {messages && messages.map((message, index) => (
                        message.name === user ? (
                          <div className="sent" key={index}>
                          <span className='time'>
                          {message.sentTime ? new Date(message.sentTime.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                          <div className="content">
                          <p>{message.message}</p>
                          <div className='imgContainer'>
                          <img src={logo} alt="" />
                          </div>  
                          </div>
                          </div>
                        ) : (
                          <div className="received" key={index}>
                            <div className="content">
                            <div className='imgContainer'>
                            <img src={logo} alt="" />
                            </div>
                            <p>{message.message}</p>
                            </div>
                            <span className='time'>
                            {message.sentTime ? new Date(message.sentTime.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                            </div>
                          )
                      ))}
                    </div>
                    <div className="inputAreaSection">
                      <textarea
                        className="inputArea"
                        value={inputMessage}
                        onChange={(event) => setInputMessage(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' && !event.shiftKey) {
                            event.preventDefault();
                            handleSendMessage(event, interlocutorId);
                          }
                        }}
                        placeholder='Place message here'
                        />
                      <button onClick={(event) => handleSendMessage(event, interlocutorId)}><IoSend className='icon'/></button>
                    </div>
                </div>
              </div>
            </div>
        </InboxContainer>
    </>
  )
}
