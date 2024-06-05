    import styled from "styled-components";


export const PropertyManagementContainer = styled.div`
    margin-left: 250px;
    color:#0e7490;
    background-color: #efefef;
    height: 100vh;
    overflow: auto;

    h1{
        font-size: 28px;
        font-weight: bold;
        padding-top: 25px;
        margin-left: 30px;  
    }

    .cardContainer{
        margin-top: 30px;
        margin-left: 30px;
        display: flex;
        justify-content: flex-start;
        gap: 30px 50px;
        flex-wrap: wrap;
    }

    .addButtonCard{
        height: 500px;
        width: 360px;
        border-width: 1px;
        border-radius: 10px;  
        // border-color:#0e7490;
        background-color: white;
        display:flex;
        flex-direction: column;
        transition: ease-in .1s;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); 

        .addProperty{
            align-items: center;
            text-align: center;
            display:flex;
            flex-direction: column;
            align-items: center;
            font-size: 15px;
            height: 525px;
            justify-content: center;
        }
        .addPropertyIcon{
            font-size: 30px;
            margin-bottom: 10px;
        }
    }

    .addButton:hover{
        .addButtonCard{
            background-color:#0e7490;
            color: white;
        }
    }


    
`


export const PropertyCard = styled.div`
    height: 500px;
    width: 360px;
    border-width: 1px;
    border-radius: 10px;  
    background-color: white;
    display:flex;
    flex-direction: column;
    overflow:hidden;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    position: relative;

    .greyed{
        height: 100%;
        width: 100%;
        z-index: 100;
        background-color: rgba(128, 128, 128, .9);
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    
        h1{
            margin:0;
            padding: 0;             
            color: white;
        }
    }


    .propImage{
        padding-bottom: 10px;
    }

    img{
        width: 360px;
        height: 220px;
        object-fit: cover;
        border-radius: 10px 10px 0 0;
        z-index: 0; 
    }

    .propRate{
        font-size: 15px;
        border-radius: 10px 0 0 10px;
        background-color: rgba(14, 116, 144,0.75);
        color: white;
        padding: 5px 20px;
        float: right;
        margin-top: -33px;
        position: relative;
        z-index: 1;
    }

    .propInfo{
        flex-grow:2;
        margin: 0px 20px;
        height: 150px;
        overflow: hidden;

        .propertyName{
            font-size: 18px;
            font-weight: bold;
            margin-top: 10px;
        }

        .location{
            font-size: 18px;
        }

        .type{
            font-size: 16px;
            color: black;
        }

        .amenities{
            max-height: 150px;
            overflow: hidden;
            font-size: 15px;
            color: gray;
        }
    }


    hr{
        border: 1.5px solid lightgray;
    }

    .propFooter{
        margin: 20px 20px;
        display:flex;
        flex-direction: row;
        justify-content: space-between;

        a:hover{
            color:black;
        }
    }

    .footerDate{
        display: flex;
        color: gray;

        .dateIcon{
            margin-right: 10px;
            font-size: 20px;
            align-self: center;
        }
    }

  .footerAction {
    font-size: 15px;
    span{
        color: black;
        padding: 0px 5px;
    }

    button{
        color: red;
    }

    button:hover{
        color: black;
    }

    .manageBtn{
        color: #177245;
    }

    .editBtn{
        color: #0e7490;
    }

    
  } 

`

export const ModalBackground = styled.div`
    width: 100vw;
    height: 100vh;
    background-color:rgba(0, 0, 0, 0.5);
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 200;
    transition: opacity 0.5s ease-in-out;

    .modalContainer {
        width: 1360px;
        height: 880px;
        border-radius: 20px 10px;
        background-color: white;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        display: flex;
        flex-direction: column;
    }

    .modalContainer .title {
        display: flex;
        justify-content: space-between;
        border-radius: 10px 10px 0px 0px;
        padding:20px;
        background-color:#0e7490;

        h1{
            color: white;
            font-size: 20px;
            font-weight: bold;
        }

        button {
            background-color: transparent;
            border: none;
            font-size: 30px;
            color: white;
            cursor: pointer;
        }
        
    }

    .modalContainer .body {
        max-height: 880px;
        overflow-y:auto;
        margin-top: 10px;
        margin-left: 20px;
        margin-right: 20px;
        display: flex;
        justify-contents: space-between;
        font-size: 15px;

        h2{
            font-weight: bold;
            font-size: 18px;
            width: 100%;
            color:#0e7490;
        }

        .propertyImageSection{
            width:650px;
            margin-right: 30px;
            

            .uploadContainer{
                margin-top: 10px;
                
                .drag-area{
                    height: 280px;
                    width: 650px;
                    color:#0e7490;
                    font-size:20px;
                    border: 2px dashed #0e7490;
                    border-radius: 10px;
                    display: flex;
                    flex-direction: column;
                    align-items:center;
                    justify-content:center;
                    gap: 5px;
                    user-select: none;
                    -webkit-user-select: none;
                    background-color: rgba(0, 0, 0, 0.05);

                    .dragText{
                        display: flex;
                        gap:10px;
                    }


                    span{
                        font-size:25px;
                    }

                    button{
                        font-size: 18px;
                        color: white;
                        background-color: #0e7490;
                        padding: 4px 30px;
                        border-radius: 14px;
                        border-width: 1px;
                        transition: ease-in .2s;
                    }

                    button:hover{
                        color: #0e7490;
                        background-color: white;
                        border-width: 1px;
                        border-color: #0e7490;

                    }
                }

                .previewSection{
                    display:flex;
                    gap:10px;
                    overflow-x:auto;

                    .imgPreview{
                        min-width:100px;
                        min-height: 100px;
                        max-width: 100px;
                        max-height: 100px;
                        position: relative;
                        margin-top: 10px;

                        img{
                            width: 100%;
                            height: 100%;
                            border-radius: 10px;
                            border-width: 2px;
                            border-color: #0e7490;
                        }

                        .deleteImage{
                            background-color: rgba(255, 255, 255, 0.5);
                            color: black;
                            border-radius: 50%;
                            font-size: 20px;
                            cursor: pointer;
                            position: absolute;
                            top: 2px;
                            right: 5px;
                            z-index: 50;
                        }

                        .deleteImage:hover{
                            color: red;
                        }
                    }

                }

                input,
                .drag-area .on-drop,
                .drag-area.dragover .visible{
                    display:none;
                }
               
            }

            .contractSection{
                margin-top: 20px;

                .optional{
                    margin-left: 5px;
                    font-size: 13px;
                    color: gray;
                }

                .contractField{
                    display:flex;
                    align-items: center;
                    gap: 5px;

                    input{
                        margin-top: 10px;
                        width: 580px;
                        margin-top: 5px;
                        border-width: 1px;
                        border-color: #0e7490;
                        border-radius: 8px;
                        padding: 1px 10px 1px 0px;
                        margin-right: 20px
                        font-size: 15px;
                    }

                    button{
                        color: white;
                        font-size: 30px;
                    }

                    .viewContract{
                        color: #0e7490;
                        
                    }

                    .removeContract{
                        color: red;
                        font-size: 28px;
                    }

                }

                
            }

            .map-section{
                margin-top: 20px;

                input{
                    margin-top: 10px;
                    width: 100%;
                    margin-top: 5px;
                    border-width: 1px;
                    border-color: #0e7490;
                    border-radius: 8px;
                    padding: 5px 10px;
                    margin-right: 20px
                    font-size: 15px;
                }
            }
        }

        .propertyInfoSection{
            display:flex;
            flex-wrap: wrap;
            width:50%;

            .checkboxFields{
                width: 100%;
                display:flex;
                justify-content: space-between;
    
                .propFields{
                    width: 310px;
                }

                .qrcodeBtn{
                    font-size: 15px;
                    color: white;
                    background-color:#0e7490;
                    padding: 5px 15px;
                    border-radius: 14px;
                    border-width: 1px;
                    display:flex;
                    align-items: center;
                    gap: 5px;
                    transition: ease-in .2s;
                }

                .qrcodeBtn:hover{
                    color: #0e7490;
                    background-color: white;
                    border-width: 1px;
                    border-color: #0e7490;
    
                }

                .fileNameSection{
                    margin-top: 5px;
                    display:flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap:wrap;

                    .fileName{
                        width:280px;
                        max-width: 280px;
                        max-height: 30px;
                        border-color: #0e7490;
                        border-width: 1px;
                        border-radius: 5px;
                        padding: 2px 5px;
                        overflow-x: hidden;
                        white-space: nowrap;
                    }
                    
                    .fileNameBtn{
                        background-color: white;
                        color: red;
                        font-size: 22px;
                    }
                    
                }
    
                .amenitiesPropField{
                    max-height: 250px;
                    overflow-y: auto;
                    position: relative;
    
                    h2{
                        background-color: white;
                        position: sticky;
                        top: 0;
                        z-index:2;
                    }
                }
            }
    
            .propFields{
                display:flex;
                flex-direction: column;
                margin-top: 5px;
                margin-right: 10px;
                max-height: 240px:
                overflow-y: auto;
    
                label{
                    font-size: 15px;
                    color: #0e7490;
                }
    
                input{
                    width: 310px;
                    margin-top: 5px;
                    border-width: 1px;
                    border-color: #0e7490;
                    border-radius: 8px;
                    padding: 1px 10px;
                    margin-right: 20px
                    font-size: 15px;
                }
    
                select{
                    margin-top: 5px;
                    width: 310px;
                    border-width: 1px;
                    border-color: #0e7490;
                    border-radius: 8px;
                    padding: 2px 10px;
                }
    
                textarea{
                    margin-top: 5px;
                    width: 630px;
                    border-width: 1px;
                    border-color: #0e7490;
                    border-radius: 12px;
                    padding: 5px 10px;
                    max-height: 80px;
                }

                .rateFields, .availabilityFields{
                    display:flex;
                    gap:5px;
                    

                    input[type=number]{
                        width:205px;
                        -moz-appearance: textfield;

                    }

                    input::-webkit-outer-spin-button,
                        input::-webkit-inner-spin-button {
                        -webkit-appearance: none;
                        margin: 0;
                    }   
    
                    select{
                        width:100px;
                    }

                }

               
    
                .address, .propertyName{
                    width: 630px;
                }
    
                .additionalCheckbox{
                    display:flex;
                    justify-content: space-between;
                    align-items: center;
    
                    button{
                        color:red;
                        font-size: 25px;
                    }
                }
    
                .amenitiesCheckbox{
                    display:flex;
                    justify-content: flex-start;
                    align-items: center;
                    gap: 10px;
    
                    input{
                        width: 270px;
                    }
    
                    button{
                        color: #0e7490;
                        font-size: 25px;
                    }
                }
    
                /* Customize the label (the container) */
                .container {
                    display: block;
                    position: relative;
                    padding-left: 35px;
                    margin-bottom: 12px;
                    margin-top: 10px;
                    cursor: pointer;
                    font-size: 15px;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                    
                    /* Hide the browser's default checkbox */
                    input {
                        position: absolute;
                        opacity: 0;
                        cursor: pointer;
                        height: 0;
                        width: 0;
                    }
                }
    
                /* Create a custom checkbox */
                .checkmark {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 25px;
                    width: 25px;
                    background-color: #eee;
                    border-color: gray;
                    border-width: 1px;
                }
    
                /* On mouse-over, add a grey background color */
                .container:hover input ~ .checkmark {
                    background-color: #ccc;
                }
    
                /* When the checkbox is checked, add a blue background */
                .container input:checked ~ .checkmark {
                    background-color: #0e7490;
                }
    
                /* Create the checkmark/indicator (hidden when not checked) */
                .checkmark:after {
                    content: "";
                    position: absolute;
                    display: none;
                }
    
                /* Show the checkmark when checked */
                .container input:checked ~ .checkmark:after {
                    display: block;
                }
    
                /* Style the checkmark/indicator */
                .container .checkmark:after {
                    left: 9px;
                    top: 5px;
                    width: 5px;
                    height: 10px;
                    border: solid white;
                    border-width: 0 3px 3px 0;
                    -webkit-transform: rotate(45deg);
                    -ms-transform: rotate(45deg);
                    transform: rotate(45deg);
                }
            }
        }


     

        
    }
      
    .modalContainer .footer {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top:auto;
        margin-bottom: 20px;
    }
      
    .modalContainer .footer button {
        padding: 5px 25px;
        margin: 0px 10px;
        border: none;
        color: white;
        border-radius: 15px;
        font-size: 18px;
        cursor: pointer;
    }
      
    .footer .cancelBtn {
        background-color: gray;
    }

    .footer .registerBtn {
        background-color: #0e7490;
    }
      

`