/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useRef, useContext } from 'react'
import { IoIosClose,IoIosAddCircle,IoIosCloseCircle } from "react-icons/io";
import { IoTrash } from "react-icons/io5";
import { FaFileUpload } from "react-icons/fa";
import { HiMiniDocumentMagnifyingGlass } from "react-icons/hi2";
import {ModalBackground} from '../PropertyManagement.styled'
import { collection, getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, uploadBytesResumable, getDownloadURL, ref } from 'firebase/storage';
import { getAuth } from "firebase/auth";
import Swal from 'sweetalert2';
import RegistrationContext from '../../../../context/RegistrationContext';



function AddPropertyModal({closeModal}) {
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

  const { setPropertyId } = useContext(RegistrationContext);

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
  const [qrCodes, setQrCodes] = useState({
    onlineBankTransfer: '',
    gcash: '',
  });
  const [propertyImageURLs, setPropertyImageURLs] = useState([]);
  const [propertyContract, setPropertyContract] = useState('');
  const [mapLocation, setMapLocation] = useState('');
  



  const handleDelete = (method) => {
    setFileName(prevState => ({ ...prevState, [method]: '' }));
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

  // deleting images
  function deleteImages (index){
    setImages((prevImages) => 
      prevImages.filter((_, i) => i !== index)
    );
  }


  // for additional checkboxes
  const [amenitiesCheckboxes, setAmenitiesCheckboxes] = useState([]); // Start with no checkboxes
  const [inputValue, setInputValue] = useState(''); // Start with empty input

  // adding checkbox function
  const addCheckbox = () => {
    event.preventDefault();
    if (inputValue.trim() !== '') { // Check if the input is not empty
      setAmenitiesCheckboxes([...amenitiesCheckboxes, { name: inputValue, checked: true }]); // Add a new checkbox with the current input value and checked by default
      setInputValue(''); // Clear the input field
    }
  };

  // deleting checkbox function
  const deleteCheckbox = index => () => {
    const newCheckboxes = [...amenitiesCheckboxes];
    newCheckboxes.splice(index, 1);
    setAmenitiesCheckboxes(newCheckboxes); // Update the state with the new checkbox array
  };

  const [property, setProperty] = useState({
    propertyOwner: '',
    propertyType: '',
    propertyName: '',
    propertyRate: '',
    rateType: '',
    propertyAvailability: '',
    availabilityType: '',
    propertyLocation: '',
    propertyDescription: '',
    contactNum: '',
    email: '',
    propertyVerification: '',
    mapLocation: '',

  });

  const handleFileUpload = async (event, method) => {
    const file = event.target.files[0];
    setFileName(prevState => ({ ...prevState, [method]: file.name }));
  
    // Define the directory path
    const directoryPaths = {
      onlineBankTransfer: 'Property added/payment/',
      gcash: 'Property added/payment/',
      propertyContract: 'Property added/contracts/',
      propertyImage: 'Property added/image/'
    };
  
    const directoryPath = directoryPaths[method];
  
    // Create a reference to the file in the specific directory
    const storage = getStorage();
    const fileRef = ref(storage, directoryPath + file.name);
    const uploadTask = uploadBytesResumable(fileRef, file);
  
    uploadTask.on('state_changed', 
      (snapshot) => {
        // Handle the upload progress
      }, 
      (error) => {
        // Handle unsuccessful uploads
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (method === 'propertyImage') {
            setPropertyImageURLs(prevPropertyImageURLs => [
              ...prevPropertyImageURLs,
              downloadURL,
            ]);
          } else if (method === 'propertyContract') {
            setPropertyContract(downloadURL);
          } else {
            setQrCodes(prevQrCodes => ({
              ...prevQrCodes,
              [method]: downloadURL,
            }));
          }
        });
      }
    );
  };
  

  const handleContractUpload = (event) => {
    handleFileUpload(event, 'propertyContract');
  };

  const handleViewContract = () => {
    if (propertyContract) {
      window.open(propertyContract, '_blank');
    }
  };

  
  const addProperty = async () => {
    if (!property || !propertyOwner || !propertyName || !propertyType || !propertyRate || !rateType || !propertyAvailability || !availabilityType || !propertyLocation || !propertyDescription || !contactNum || !email || !qrCodes || !amenitiesCheckboxes || !propertyImageURLs) {
      Swal.fire({
        title: "Notice!",
        text: "Please fill up all the fields",
        icon: "warning",
        confirmButtonColor: '#0e7490',
    });
      return;
    }
  
    const db = getFirestore();
    const auth = getAuth();
    const userId = auth.currentUser.uid;
  
    const docRef = doc(collection(db, "properties"));
  
    const propertyWithFormData = {
      ...property,
      userId: userId,
      propertyId: docRef.id,
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
      propertyVerification: "pending",
      mapLocation,
      addedAt: new Date()
    };
    await setDoc(docRef, propertyWithFormData);
    setPropertyId(docRef.id);
    console.log("Document written with ID: ", docRef.id);
  
    setProperty({});
    setPropertyOwner('');
    setPropertyType('');
    setPropertyName('');
    setPropertyRate('');
    setRateType('');
    setPropertyAvailability('');
    setAvailabilityType('');
    setPropertyLocation('');
    setPropertyDescription('');
    setContactNum('');
    setEmail('');
    setQrCodes({});
    setAmenitiesCheckboxes([]);
    setPropertyImageURLs([]);
    setMapLocation(''); 
  
    Swal.fire({
      title: "Registration Completed!",
      text: "Your Property is now under review, You will be notified when your property has been verfied by the Admin",
      icon: "success",
      allowOutsideClick:false,
      confirmButtonColor: '#0e7490',
    });
  };
  
  


  return (
    <ModalBackground>
        <div className="modalContainer">
          <div className="title">
            <h1>Add Property</h1>
            <button onClick={() => closeModal(false)} className="titleCloseIcon"><IoIosClose/></button>
          </div>
          <div className="body">
            <div className='propertyImageSection'>
              <h2>Property Image Upload</h2>
              <div className="uploadContainer">
                <div className="drag-area" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
                  {
                    isDragging ? (
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
                  {images.map((images, index) => (
                    <div className="imgPreview" key={index}>
                      <span><IoIosCloseCircle className='deleteImage' onClick={() => deleteImages(index)}/></span>
                      <img src={images.url} alt={images.name} />
                    </div>

                  ))}
                  
                </div>
              </div>

              <div className="contractSection">
                <h2>Contract Upload<span className="optional">(Optional)</span></h2>
                <div className='contractField'>
                <input type='file' name='contract' onChange={handleContractUpload}></input> 
                  <button className='viewContract' onClick={handleViewContract}><HiMiniDocumentMagnifyingGlass/></button>
                  <button className='removeContract' onClick={() => {setPropertyContract('');}}><IoTrash/></button>
                </div>  
              </div>

              <div className="map-section">
                <h2>Google Maps</h2>
                <input 
                  type='text' 
                  placeholder='Place Google Map Location Link Here'
                  value={mapLocation} 
                  onChange={(e) => setMapLocation(e.target.value)}
                />
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
                      <option value=""></option>
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
                    <option value=""></option>
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
                      <input type="checkbox" onChange={() => setShowUploadButton(prevState => ({ ...prevState, onlineBankTransfer: !prevState.onlineBankTransfer }))} />
                      <span className="checkmark"></span>
                    </label>
                    {showUploadButton.onlineBankTransfer && (
                      <div className="qrcode">
                        <input type="file" id="fileUploadOnlineBankTransfer" style={{ display: 'none' }} onChange={(event) => handleFileUpload(event, 'onlineBankTransfer')} />
                        <button className="qrcodeBtn" onClick={() => document.getElementById('fileUploadOnlineBankTransfer').click()}><span><FaFileUpload /></span>Upload Image</button>
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
                      <input type="checkbox" onChange={() => setShowUploadButton(prevState => ({ ...prevState, gcash: !prevState.gcash }))} />
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
                              const newCheckboxes = [...amenitiesCheckboxes];
                              newCheckboxes[index].checked = !newCheckboxes[index].checked;
                              setAmenitiesCheckboxes(newCheckboxes);
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
                  
                </div> {/* end of PropField */}
              </div>
            </div> {/* end of propertyInfoSection */}
          </div>
          <div className="footer">
            <button className="cancelBtn" onClick={() => closeModal(false)}>Cancel</button>
            <button type="submit" className="registerBtn" onClick={addProperty}>Add Property</button>
          </div>
        </div>
    </ModalBackground>
  )
}

export default AddPropertyModal