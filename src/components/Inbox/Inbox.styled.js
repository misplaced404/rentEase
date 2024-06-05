import styled from "styled-components";


export const InboxContainer = styled.div`
    margin-left: 250px;
    background-color: #efefef;
    color:#0e7490;
    height: 100vh;
    overflow: auto;

    .header{
        margin-left: 30px;  
        margin-top: 25px;

        h1{
            font-size: 30px;
            font-weight: bold;
        }
    }

    .body{
        margin: 20px 30px;
        width: 100wv;
        height: 820px;
        background-color: white;
        border-radius: 10px;

        .inboxArea{
            width: 100%;
            height: 820px;
            border-width: 1px; 
            border-radius: 10px;
            display:flex;
            box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;  

            .contactsContainer{
                width: 30%;
                height: 820px;
                border-width: 0 1px 0 0; 
                background-color: #6eacbc;
                border-radius: 10px 0 0 10px;
                overflow:hidden;

                .searchField{
                    display:flex;
                    justify-content: center;
                    margin-top: 20px;
                    position:relative;
                    
                    
                    span{
                        font-size: 20px;
                        border-radius: 50px 0 0 50px;
                        margin-top: 6px;
                        position:absolute;
                        left: 30px;
                        z-index: 1;
                    }

                    .search{
                        margin: 0 20px;
                        width: 100%;
                        border-radius: 50px;
                        color: black;
                        padding: 5px 5px 5px 40px;
                        box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
                    }
                }

                .contactList{
                    max-height: 720px;
                    display:flex;
                    flex-direction: column;
                    gap: 15px;
                    flex-wrap: wrap;
                    overflow-y: auto;

                    &::-webkit-scrollbar {
                        display: none;
                        
                    }
                    &::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        width: 15px;
                        height: 15px;
                        border:1px solid black;
                        ...
                     }

                    .contact{
                        height: 75px;
                        width: auto;
                        background-color: #e7f1f4   ;
                        border-radius: 10px;
                        display: flex;
                        margin: 0 20px 10px 20px;
                        gap: 10px;
                        justify-content: flex-start;
                        align-items: center;
                        padding: 10px;
                        cursor: pointer;
                        box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;

                        &:hover{
                            background-color: white;
                        }

                        .imgContainer{
                            border-radius: 50px;
                            height: 50px;
                            width: 50px;
                            flex-basis: 50px;
                            
                            img{
                                max-height: 100%;
                                max-width: 100%;
                                object-fit: cover;
                            }
                        }

                        .contactDetails{
                            display: flex;
                            flex-direction: column;
                            flex-wrap: wrap;
                            gap: 2px;
                            align-items: start;
                            justify-content: center;
                            max-width: 320px;
                            overflow: hidden;

                            .userName{
                                font-size: 16px;
                                font-weight: bold;
                                width: 300px;
                            }
                            
                            .smallMessage{
                                width: 300px;
                                max-height: 20px;
                                font-size: 14px;
                                display:inline;
                            }
                        }
                        
                    }
                }

            }

            .conversationContainer{
                width: 70%;
                height: 820px;
                display:flex;
                flex-direction: column;
                overflow: hidden;
                position:relative;

                .conversationHeader{
                    width:100%;
                    height:80px;
                    display: flex;
                    align-items:center;
                    gap: 20px;
                    margin-bottom: 10px;
                    position:absolute;
                    z-index: 5;
                    background-color: white;
                    border-radius: 0 10px 0 0;
                    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
                   

                    .imgContainer{
                        display:flex;
                        margin-top: 20px;
                        margin-left: 20px;
                        margin-bottom: 10px;
                        align-items:center;
                        border-radius: 50%;
                        height: 50px;
                        width: 50px;

                        img{
                            align-self:center;
                        }
                    }

                    .userName{
                        font-weight: bold;
                        font-size: 18px;
                    }
                }

                .conversationArea{
                    max-height: 650px;
                    display:flex;
                    flex-direction: column-reverse;
                    flex-grow: 1;
                    background-color:#cfe3e9;
                    gap: 3px;
                    overflow-y: auto;
                    margin-top:80px;

                    &::-webkit-scrollbar {
                        display: none;
                        
                    }

                    .received{
                        flex-grow: 0;
                        display:flex;
                        align-items: center;
                        gap: 10px;
                        margin-right: 150px;

                        .content{
                            display:flex;
                            align-items: center;
                            gap: 10px;
                            color:black;
                           
                            p{
                                background-color: white;
                                border-radius: 10px 10px 10px 0;
                                padding: 10px 20px;
                                box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
                            }
                        }
                        
                        .imgContainer{
                            display:flex;
                            margin-top: 20px;
                            margin-left: 20px;
                            margin-bottom: 10px;
                            align-items:center;
                            border-radius: 50%;
                            height: 50px;
                            width: 50px;
                            min-height: 50px;
                            min-width: 50px;
                            max-height: 50px;
                            max-width: 50px;
                            box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;

                        }
                        .time{
                            color: gray;
                            font-size: 12px;
                            max-height: 100%;
                            max-width: 100%;
                            object-fit: cover;
                        }
                    }

                    .sent{
                        flex-grow: 0;
                        display:flex;
                        justify-content: flex-end;
                        align-items: center;
                        gap: 10px;
                        margin-left: 150px;

                        .content{
                            display:flex;
                            align-items: center;
                            gap: 10px;
                            color:black;
                           
                            p{
                                background-color: white;
                                border-radius: 10px 10px 0px 10px;
                                padding: 10px 20px;
                                box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
                            }
                        }
                        
                        .imgContainer{
                            display:flex;
                            margin-top: 20px;
                            margin-right: 20px;
                            margin-bottom: 10px;
                            align-items:center;
                            border-radius: 50%;
                            height: 50px;
                            width: 50px;
                            min-height: 50px;
                            min-width: 50px;
                            box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;

                        }
                        .time{
                            color: gray;
                            font-size: 12px;
                            max-height: 100%;
                            max-width: 100%;
                            object-fit: cover;
                        }
                    }
                }


                .inputAreaSection{
                    display: flex;
                    align-items: center;
                    width: 100%;
                    height: 120px;
                    min-height: 120px;
                    padding: 20px;   
                    background-color: rgba(207, 227, 233, .5);
                    gap: 20px;
                    

                    .inputArea{
                        height: 60px;
                        width: 100%;
                        resize: none;
                        color: black;
                        padding: 10px;
                        border-radius: 10px;
                        box-shadow: rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;

                        &::-webkit-scrollbar {
                            display: none;
                            left: 0;
                        }
                    }

                    button{
                        padding: 10px 10px 10px 15px;
                        border-radius: 50%;
                        border: 1px;
                        background-color:white;
                        font-size: 25px;    
                        cursor: pointer;
                        transition: ease-in .1s;
                        box-shadow: rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;

                        &:hover{
                            background-color:#0e7490;
                            color: white;
                        }
                    }
                }
            }


        }
    }
    

`