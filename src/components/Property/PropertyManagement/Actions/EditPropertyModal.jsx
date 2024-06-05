/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import { IoIosClose,IoIosAddCircle,IoIosCloseCircle } from "react-icons/io";
import { IoTrash } from "react-icons/io5";
import { FaFileUpload } from "react-icons/fa";
import { HiMiniDocumentMagnifyingGlass } from "react-icons/hi2";
import {EditPropertyModalContainer} from './EditPropertyModal.styled';
import {  getFirestore, doc, getDoc, updateDoc, arrayRemove  } from 'firebase/firestore';
import { getStorage, uploadBytesResumable, deleteObject, getDownloadURL, ref } from 'firebase/storage';
import { getAuth } from "firebase/auth";

// Define this function outside of your component
const uploadFile = async (file, directoryPath) => {
  const storage = getStorage();
  const fileRef = ref(storage, directoryPath + file.name);
  const uploadTask = uploadBytesResumable(fileRef, file);
  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed', 
      (snapshot) => {
        // Handle the upload progress
      }, 
      (error) => {
        // Handle unsuccessful uploads
        reject(error);
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};


function EditPropertyModal({closeModal, propertyId}) {
  //select options
  const options = [
    {label: "Boarding House", value:0},
    {label: "Apartment", value:1},
    {label: "Hotel", value:2},
    {label: "Condominium", value:3},
    {label: "Loft", value:4},
  ]

  // for uploading images
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging ] = useState(false);
  const fileInputRef = useRef(null);
  const [showUploadButton, setShowUploadButton] = useState({ onlineBankTransfer: false, gcash: false });
  const [fileName, setFileName] = useState({ onlineBankTransfer: '', gcash: '' });

  const [propertyOwner, setPropertyOwner] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [propertyRate, setPropertyRate] = useState('');
  const [rateType, setRateType] = useState(0);
  const [propertyAvailability, setPropertyAvailability] = useState('');
  const [availabilityType, setAvailabilityType] = useState(0);
  const [propertyLocation, setPropertyLocation] = useState('');
  const [propertyDescription, setPropertyDescription] = useState('');
  const [contactNum, setContactNum] = useState('');
  const [email, setEmail] = useState('');
  const [propertyContract, setPropertyContract] = useState('');
  const [imagesToDelete, setImagesToDelete] = useState([]);

  // for additional checkboxes
  const [amenitiesCheckboxes, setAmenitiesCheckboxes] = useState([]);
  const [inputValue, setInputValue] = useState('');


  const [qrCodes, setQrCodes] = useState({
    onlineBankTransfer: '',
    gcash: '',
  });
  const [propertyImageURLs, setPropertyImageURLs] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const docRef = doc(db, "properties", propertyId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        // Update your state variables here...
        setPropertyOwner(data.propertyOwner);
        setPropertyType(data.propertyType);
        setPropertyName(data.propertyName);
        setPropertyRate(data.propertyRate);
        setRateType(data.rateType);
        setPropertyAvailability(data.propertyAvailability);
        setAvailabilityType(data.availabilityType);
        setPropertyLocation(data.propertyLocation);
        setPropertyDescription(data.propertyDescription);
        setContactNum(data.contactNum);
        setEmail(data.email);
        setQrCodes(data.qrCodes);
        setAmenitiesCheckboxes(data.amenities);
        setPropertyImageURLs(data.propertyImages);
        setPropertyContract(data.propertyContract);
      } else {
        console.log("No such document!");
      }
    };

    fetchData();
  }, [propertyId]);

  useEffect(() => {
    if (qrCodes.gcash) {
      setFileName(prevState => ({ ...prevState, gcash: getFilenameFromUrl(qrCodes.gcash) }));
    }
    if (qrCodes.onlineBankTransfer) {
      setFileName(prevState => ({ ...prevState, onlineBankTransfer: getFilenameFromUrl(qrCodes.onlineBankTransfer) }));
    }
  }, [qrCodes]);


  const handleDelete = (method) => {
    // eslint-disable-next-line no-undef
    setFileName(prevState => ({ ...prevState, [method]: someValue }));
  };

  function selectFiles () {
    fileInputRef.current.click();
  }

  async function onFilesSelect(event) {
    const files = event.target.files;
    if(files.length == 0) return;
    for (let i = 0; i < files.length; i++) {
      const fileType = files[i].type;
      if (fileType !== 'image/png' && fileType !== 'image/jpeg' && fileType !== 'image/jpg') continue;
      if(!images.some((e) => e.name === files[i].name)){
        const localURL = URL.createObjectURL(files[i]);
        setImages((prevImages) => [
          ...prevImages,
          {
            name: files[i].name,
            url: localURL,
          },
        ]);
        // Call handleFileUpload for each file
        await handleFileUpload({ target: { files: [files[i]] } }, 'propertyImage');
      }
    }
  }

  //drag & drop
  function onDragOver(event){
    event.preventDefault();
    setIsDragging(true);
    event.dataTransfer.dropEffect = "copy";
  }
  function onDragLeave(event){
    event.preventDefault();
    setIsDragging(false);
  }
  async function onDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if(files.length == 0) return;
    for (let i = 0; i < files.length; i++) {
      const fileType = files[i].type;
      if (fileType !== 'image/png' && fileType !== 'image/jpeg' && fileType !== 'image/jpg') continue;
      if(!images.some((e) => e.name === files[i].name)){
        const localURL = URL.createObjectURL(files[i]);
        setImages((prevImages) => [
          ...prevImages,
          {
            name: files[i].name,
            url: localURL,
          },
        ]);
        // Call handleFileUpload for each file
        await handleFileUpload({ target: { files: [files[i]] } }, 'propertyImage');
      }
    }
  }

  

  function deleteImage(index) {
    // Get the image URL to delete
    const imageUrlToDelete = propertyImageURLs[index];
  
    // Create a reference to the file to delete
    const storage = getStorage();
    const imageRef = ref(storage, imageUrlToDelete);
  
    // Delete the file
    deleteObject(imageRef).then(() => {
      console.log(`Image at ${imageUrlToDelete} has been deleted from Firebase Storage.`);
  
      // Remove the image URL from the propertyImageURLs state
      setPropertyImageURLs((prevImages) =>
        prevImages.filter((_, i) => i !== index)
      );
  
      // Update the Firestore document to remove the image's URL
      const db = getFirestore();
      const docRef = doc(db, "properties", propertyId);
      updateDoc(docRef, {
        propertyImages: arrayRemove(imageUrlToDelete)
      });
    }).catch((error) => {
      console.error(`Failed to delete image at ${imageUrlToDelete} from Firebase Storage.`, error);
    });
  }
  
  

// Fetch the document from Firebase
  useEffect(() => {
    const fetchQRCodes = async () => {
      const db = getFirestore();
      const docRef = doc(db, "properties", propertyId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // The document exists, get the QR codes
        const propertyData = docSnap.data();
        const qrCodes = propertyData.qrCodes;

        // Check if the QR codes exist and update the state
        if (qrCodes.gcash) {
          setShowUploadButton(prevState => ({ ...prevState, gcash: true }));
          setFileName(prevState => ({ ...prevState, gcash: qrCodes.gcash }));
        }

        if (qrCodes.onlineBankTransfer) {
          setShowUploadButton(prevState => ({ ...prevState, onlineBankTransfer: true }));
          setFileName(prevState => ({ ...prevState, onlineBankTransfer: qrCodes.onlineBankTransfer }));
        }
      } else {
        // The document does not exist
        console.log("No such document!");
      }
    };

    fetchQRCodes();
  }, []);


  const handleFileChange = (e) => {
    setPropertyContract(URL.createObjectURL(e.target.files[0]));
  };

  const handleViewContract = () => {
    if (propertyContract) {
      window.open(propertyContract, '_blank');
    }
  };

  const handleRemoveContract = async () => {
    setPropertyContract(null);
    const db = getFirestore();
    const docRef = doc(db, "properties", propertyId);
    await updateDoc(docRef, { propertyContract: null });
  };


  // adding checkbox function
  const addCheckbox = (event) => {
    event.preventDefault();
    if (inputValue.trim() !== '') { 
      setAmenitiesCheckboxes([...amenitiesCheckboxes, { name: inputValue, checked: true }]);
      setInputValue('');
    }
  };

  // deleting checkbox function
  const deleteCheckbox = index => () => {
    const newCheckboxes = [...amenitiesCheckboxes];
    newCheckboxes.splice(index, 1);
    setAmenitiesCheckboxes(newCheckboxes);
  };

  const [property, setProperty] = useState({
    propertyOwner: '',
    propertyType: '',
    propertyRate: '',
    rateType: '',
    propertyAvailability: '',
    availabilityType: '',
    propertyLocation: '',
    propertyDescription: '',
    contactNum: '',
    email: '',
  });

  const handleFileUpload = async (event, method) => {
    const file = event.target.files[0];
    setFileName(prevState => ({ ...prevState, [method]: file.name }));

    // Define the directory path
    let directoryPath = '';
    if (method === 'onlineBankTransfer' || method === 'gcash') {
      directoryPath = 'Property added/payment/';
    } else {
      directoryPath = 'Property added/image/';
    }

    const downloadURL = await uploadFile(file, directoryPath);

    if (method === 'propertyImage') {
      setPropertyImageURLs(prevPropertyImageURLs => [
        ...prevPropertyImageURLs,
        downloadURL,
      ]);
    } else {
      setQrCodes(prevQrCodes => ({
        ...prevQrCodes,
        [method]: downloadURL,
      }));
    }
  };

  const editProperty = async () => {
    const db = getFirestore();
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    // Delete the images
    imagesToDelete.forEach(deleteImage);
  
    const propertyWithFormData = {
      ...property,
      userId: userId,
      propertyOwner,
      propertyType,
      propertyName,
      propertyRate,
      rateType,
      propertyAvailability,
      availabilityType,
      propertyLocation,
      propertyDescription,
      contactNum,
      email,
      qrCodes: qrCodes,
      amenities: amenitiesCheckboxes,
      propertyImages: propertyImageURLs,
      propertyContract: propertyContract,
      addedAt: new Date(),
      propertyVerification: 'pending',
    };
  
    // Use the existing propertyId to update the document
    const docRef = doc(db, "properties", propertyId);
    await updateDoc(docRef, propertyWithFormData);
  
    console.log("Document with ID: ", propertyId, " has been updated");

    closeModal(false);
  };

  function getFilenameFromUrl(url) {
    // Create a new URL object
    const urlObj = new URL(url);
  
    // Get the pathname from the URL object
    let pathname = urlObj.pathname;
  
    // The pathname starts with a '/', so remove it
    pathname = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  
    // URL-decode the pathname
    pathname = decodeURIComponent(pathname);
  
    // Split the pathname by '/' and get the last part
    const parts = pathname.split('/');
    const filename = parts[parts.length - 1];
  
    // Return the filename
    return filename;
  }


  return (
    <EditPropertyModalContainer>
      <div className="modalContainer">
        <div className="title">
          <h1>Edit Property</h1>
          <button onClick={() => closeModal(false)} className="titleCloseIcon"><IoIosClose/></button>
        </div>
        <div className="body">
          <div className='propertyImageSection'>
            <h2>Property Image Upload</h2>
            <div className="uploadContainer">
              <div className="drag-area" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
                {isDragging ? (
                  <div className="dragText">
                    <p>Drop Images Here</p>
                  </div>
                  ) : (
                    <>
                      <div className="dragText">
                        <span><FaFileUpload/></span>
                        <p>Drag & Drop Images Here</p>
                      </div>
                      <p>or</p>
                      <button onClick={selectFiles}>Select File</button>
                    </>
                  )
                }
              </div>
            <input type="file" name="file" id="file" ref={fileInputRef} onChange={onFilesSelect} multiple/>
                
              <div className="previewSection">
                {propertyImageURLs.map((url, index) => (
                  <div className="imgPreview" key={index}>
                    <span><IoIosCloseCircle className='deleteImage' onClick={() => deleteImage(index)}/></span>
                    <img src={url} alt={`Property ${index}`} />
                  </div>
                ))}
                {/* {images.map((images, index) => (
                  <div className="imgPreview" key={index}>
                    <span><IoIosCloseCircle className='deleteImage' onClick={() => deleteImages(index)}/></span>
                    <img src={images.url} alt={images.name} />
                  </div>

                ))} */}
                
              </div>
            </div>

            <div className="contractSection">
              <h2>Contract Upload<span className="optional">(Optional)</span></h2>
              <div className='contractField'>
                <input type='file' name='contract' onChange={handleFileChange}></input> 
                <button className='viewContract' onClick={handleViewContract}><HiMiniDocumentMagnifyingGlass/></button>
                <button className='removeContract' onClick={handleRemoveContract}><IoTrash/></button>
              </div>
            </div>

            <div className="map-section">
              <h2>Google Maps</h2>
              <div className="map-container">
                {/* add map component here */}
              </div>
            </div>
          </div>


          <div className='propertyInfoSection'>
            <h2>Property Information</h2>
            <div className="propFields">
              <label htmlFor="propertyOwner">Property Owner</label>
              <input type='text' name='propertyOwner' value={propertyOwner} onChange={e => setPropertyOwner(e.target.value)}></input>              
            </div>

            <div className="propFields">
              <label htmlFor="propertyType">Property Type</label>
              <select name='propertyType' value={propertyType} onChange={e => setPropertyType(e.target.value)}>
                <option></option>
                {options.map(option => (
                  <option key={option.id} value={option.label}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="propFields">
              <label htmlFor="propertyName">Property Name</label>
              <input type='text' name='propertyName'className='propertyName' value={propertyName} onChange={e => setPropertyName(e.target.value)}></input> 
            </div>

            <div className="propFields">
              <label htmlFor="propertyRate">Property Rate</label>
              <div className="rateFields">
                <input type='number' name='propertyRate' className='propertyRateInput' placeholder='Ex. 3000' value={propertyRate} onChange={e => setPropertyRate(e.target.value)}></input>
                <select name='rateType' className='propertyRateSelect' value={rateType} onChange={e => setRateType(e.target.value)}>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="propFields">
              <label htmlFor="propertyAvailability">Property Availability</label>
              <div className="availabilityFields">
                <input type='number' name='propertyAvailability' className='propertyAvailabilityInput' placeholder='Ex. 1' value={propertyAvailability} onChange={e => setPropertyAvailability(e.target.value)}></input>
                <select name='availabilityType' className='propertyAvailabilityselect' value={availabilityType} onChange={e => setAvailabilityType(e.target.value)}>
                  <option value="Room/s">Room/s</option>
                  <option value="Unit/s">Unit/s</option>
                  <option value="House/s">House/s</option>
                </select>
              </div>
            </div>

            <div className="propFields">
              <label htmlFor="propertyLocation">Property Location</label>
              <input type='text' name='propertyLocation' placeholder='Ex. Mabolo, Cebu City' className='address' value={propertyLocation} onChange={e => setPropertyLocation(e.target.value)}></input>
            </div>

            <div className="propFields">
              <label htmlFor="propertyDescription">Property Description</label>
              <textarea name='propertyDescription' maxLength={500} placeholder="Ex. Semi-furnished, Has Kitchen, Own Bathroom" value={propertyDescription} onChange={e => setPropertyDescription(e.target.value)}></textarea>
            </div>

            <div className="propFields">
              <label htmlFor="contactNum">Contact Number</label>
              <input type='text' name='contactNum' placeholder='09123456789' value={contactNum} onChange={e => setContactNum(e.target.value)}></input>
            </div>

            <div className="propFields">
              <label htmlFor="email">Email Address</label>
              <input type='email' name='email' pattern=".+@example\.com" size="30" placeholder='juandelacruz@gmail.com' value={email} onChange={e => setEmail(e.target.value)}></input>
            </div>

            <div className='checkboxFields'>
              <div className="propFields">
                <h2>Payment Methods</h2>
                <div className="onlineBankTransfer">
                <label className="container">Online Bank Transfer (QR Code)
                  <input type="checkbox" checked={showUploadButton.onlineBankTransfer} onChange={() => setShowUploadButton(prevState => ({ ...prevState, onlineBankTransfer: !prevState.onlineBankTransfer }))} />
                  <span className="checkmark"></span>
                </label>
                  {showUploadButton.onlineBankTransfer && (
                    <div className="qrcode">
                      <input type="file" id="fileUploadOnlineBankTransfer" style={{ display: 'none' }} onChange={(event) => handleFileUpload(event, 'onlineBankTransfer')} />
                      <button className='qrcodeBtn' onClick={() => document.getElementById('fileUploadOnlineBankTransfer').click()}><span><FaFileUpload /></span>Upload Image</button>
                      {fileName.onlineBankTransfer && (
                        <div className="fileNameSection">
                          <div className="fileName">
                            {fileName.onlineBankTransfer}
                          </div>
                          <button className='fileNameBtn' onClick={() => handleDelete('onlineBankTransfer')}><IoTrash /></button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="gcash">
                <label className="container">Gcash
                  <input type="checkbox" checked={showUploadButton.gcash} onChange={() => setShowUploadButton(prevState => ({ ...prevState, gcash: !prevState.gcash }))} />
                  <span className="checkmark"></span>
                </label>
                  {showUploadButton.gcash && (
                    <div className="qrcode">
                      <input type="file" id="fileUploadGcash" style={{ display: 'none' }} onChange={(event) => handleFileUpload(event, 'gcash')} />
                      <button className='qrcodeBtn' onClick={() => document.getElementById('fileUploadGcash').click()}><span><FaFileUpload /></span>Upload Image</button>
                      {fileName.gcash && (
                        <div className="fileNameSection">
                          <div className="fileName">
                            {fileName.gcash}
                          </div>
                          <button className='fileNameBtn' onClick={() => handleDelete('gcash')}><IoTrash /></button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                </div>
                <div className="propFields">
                  <div className='amenitiesPropField'>
                    <h2>Amenities</h2>
                    {amenitiesCheckboxes.map((checkbox, index) => (
                      <div className="additionalCheckbox" key={index}>
                        <label className="container" htmlFor={`checkbox-${index}`}>
                          {checkbox.name}
                          <input
                            id={`checkbox-${index}`}
                            type="checkbox"
                            checked={checkbox.checked}
                            onChange={() => {
                              checkbox.checked = !checkbox.checked;
                              setAmenitiesCheckboxes([...amenitiesCheckboxes]);
                            }}
                          />
                          <span className="checkmark"></span>
                        </label>
                        <button onClick={deleteCheckbox(index)}><IoIosClose/></button>
                      </div>
                    ))}
                    
                  </div>  {/* end of amenitiesPropField */}
                  <form onSubmit={addCheckbox} className="amenitiesCheckbox">
                    <input
                      type="text"
                      value={inputValue}
                      placeholder='Ex. Free Wifi, Swimming Pool'
                      onChange={e => setInputValue(e.target.value)}
                    />
                    <button type="submit" onClick={addCheckbox}><IoIosAddCircle/></button>
                  </form>
                </div>
                </div>
                </div> {/* end of PropField */}
            </div> {/* end of propertyInfoSection */}
          <div className="footer">
            <button className="cancelBtn" onClick={() => closeModal(false)}>Cancel</button>
            <button type="submit" className="editBtn" onClick={editProperty}>Edit Property</button>
          </div>

        </div>
    </EditPropertyModalContainer>
  )
}

export default EditPropertyModal