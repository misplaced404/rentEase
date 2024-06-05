import styled from "styled-components";

export const OwnerRegistrationContainer = styled.div`
    color:#0e7490;

    .content{
        display: flex;
        justify-content: flex-start;
        position: relative;
    }

    .content h2{
        font-size: 20px;
        font-weight: 600;
        margin-left: 20px;
        margin-top: 20px;
        text-align: left;
    }

    .actionBtns{
        display:flex;
        gap: 20px;
    }

    .register{
        border-width: 1px;
        border-radius: 20px;
        padding: 5px 30px;
        background-color: #0e7490;
        color: white;
        position: relative;
        margin-top: 20px;
    }

    .cancel{
        border-width: 1px;
        border-radius: 20px;
        padding: 5px 30px;
        background-color: gray;
        color: white;
        position: relative;
        margin-top: 20px;
    }
 
    // section 

    .section{
        display: flex;
        flex-direction: column;
        align-items: center;
        border-width: 2px;
        padding: 0px 10px 25px 0px;
        width: 670px;
        border-radius: 0 0 10px 10px;  
        border-color:#0e7490;
        background-color: white;
    }
    
    .basicInfo{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin: 0px auto;
    }

    .inputField{
        margin-top: 10px;
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        text-align: left;

        .required{
            color: red;
        }
        
    }

    label{
        font-size: 16px;
    }

    .inputField input{
        background-color: white;
        border-color: rgb(14 116 144);
        border-width: 0.1px;
        border-radius: 5px;
        padding: 5px;
        padding-left: 10px;
        height: 30px;
        width: 300px;
        color:black;
    }

    .inputField input[type="text"]:disabled{
        background-color: lightgray;
        cursor: not-allowed;
    }

    .inputField .address{
        width: 620px;
    }

    // validation section

    .validationSection{
        width: 100%;
    }

    .uploads{
        margin-top: 10px;
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding-top:5px;
    }

    .uploadField{
        display:flex;
        flex-direction:row;
        align-items: center;
        margin-right: 20px;
        width: 100%;
        flex-wrap:wrap;

        .uploadSection,
        .fileNameSectionContainer{
            display:flex;
            flex-direction:row;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            text-align: left;

            .required{
                color: red;
            }
        }

        .uploadSection{
            margin-top: 5px;
            display: flex;
            justify-content: space-between;
            gap: 10px;
           
        }

        .fileNameSectionContainer{
            max-width: 620px;
            margin-top:4px;

            button{
                color: red;
                font-size: 20px;
                background:none;
                border:none;
            }

            .fileNameSection{
                width: 620px;
                border: 1px solid #0e7490;
                border-radius: 8px;
                padding: 2px 6px;
                overflow-x:auto;
                margin-top: 10px;
                font-size: 14px;

                ::-webkit-scrollbar-track {
                    background-color: orange; 
                }
                ::-webkit-scrollbar-thumb {
                    background: #888;
                  }
            }
        }
    }

    .uploads button{
        display:flex;
        align-items: center;
        font-size: 14px;
        background-color: #0e7490;
        color: white;
        border-width: 1px;
        border-radius: 10px;
        padding: 2px 10px;
        gap: 5px;
        transition: ease-in .2s;
    }

    .uploads button:hover{
        background-color: white;
        color: #0e7490;
        border-color: #0e7490;
        border-width: 1px;
    }

    // message
    .backdrop{
        position:absolute;
        height auto;
        margin-left: 250px;
        z-index:5000;
        top:0;
        bottom: 0;
        right:0;
        left:0;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .message{
        border-color: #0e7490;
        border-radius: 15px;
        margin: 200px auto;
        position: relative;
        background-color: white;
        width: 550px;
        height: auto;
        padding-top: 20px;
        padding-bottom: 40px;
        position: relative;
    }

    .message h2{
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0px 0px 10px 20px;
        font-size: 24px;
        font-weight: bold;
    }

    .message p{
        margin: 20px;
        line-height: 1.8;
        font-size: 18px;
    }

    .message button{
        font-size: 18px;
        border-radius: 20px;
        background-color: #0e7490;
        color: white;
        padding: 4px 25px;
        margin-right: 20px;
        position: absolute;
        bottom: 20px; 
        right: 5px;
        transition: all .2s;
    }

    .message button:hover{
        border-radius: 20px;
        border-color: #0e7490;
        border-width: 1px;
        background-color: white;
        color: #0e7490;
    }

    hr{
        border-color: gray;
        border-width: 1px;
    }

`