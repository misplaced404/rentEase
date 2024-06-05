import styled from "styled-components";


export const ManagePropertyContainer = styled.div`
    position:fixed;
    overflow: auto;
    z-index:2;
    top:0;
    bottom: 0;
    right:0;
    left:0;
    display:flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);

    .modalContainer{
        width: 1500px;
        background-color: white;
        border-radius: 20px;
        position: relative;

        .modalHeader{
            width: 100%;
            background-color: #0e7490;
            border-radius: 10px 10px 0 0;
            padding: 20px;
            color: white;
            display:flex;
            align-items: center;
            text-align: center;
            justify-content: space-between;

            h1{
                margin:0;
                font-weight:bold;
                font-size: 20px;
            }

            button{
                border-radius: 50%;
                transition: ease-in .1s;
            }

            button:hover{
                background-color: rgba(0,0,0,.50);
                color: white;
            }

            .closeBtn{
                font-size: 30px;
                
            }
        }

        .modalBody{
            margin: 20px; 
            height: 750px;
            
            .table{
                width: 100%;
                margin-top: 20px;
    
                .tableHeader{
    
                    .tableRow{
                        display:flex;
                        text-align: center;
                        margin  -top:20px;
                        
                        .tableHead{
                            width: 100%;
                            font-size: 16px;
                            color: white;
                            background-color:#109475;
                            padding: 15px 20px;
                            display: flex;
                            text-align: center;
                            align-items: center;
                            justify-content: center;
                            gap: 10px;
                            
                            img{
                                height: 30px;
                                width: auto;
                            }
    
                            span{
                                text-align: center;
                                font-size: 16px;
                                font-weight: bold;
                            }
                        }
    
                        .first{
                            border-radius: 15px 0 0 0;
                        }
    
                        .last{
                            border-radius: 0  15px 0 0 ;
                        }
                    }
                    
                }

                .moreInfo{
                    display: flex;
                    border-width: 0 1px 1px 1px;
                    border-color:  #5a8687;
                }

                .paymentLog{
                    width: 50%;
                    border-width: 0px 1px 0px 0;
                    border-color:  #5a8687;
                    
                    .paymentTableHeader{ 
                        
                        
                        .paymentTableRow{
                            display:flex;
                            
                            .tableHead{
                                width: 100%;
                                font-size: 16px;
                                font-weight: bold;
                                color: #5a8687; 
                                padding: 15px 20px;
                                display: flex;
                                text-align: center;
                                align-items: center;
                                justify-content: center;
                                gap: 10px;
                                border-width: 0 0 1px 0;
                                border-color:  #5a8687;
                            }
                        }
                    }
                   
                    .paymentTableBody{
                        max-height: 186px;
                        overflow: auto;

                        .paymentTableRow{
                            display:flex;
                        }

                        .tableData{
                            width: 100%;
                            padding: 15px 20px;
                            display: flex;
                            text-align: center;
                            align-items: center;
                            justify-content: center;

                            button{
                                color: white;
                                background-color: #5a8687;
                                padding: 8px;
                                border-radius: 5px;
                                transition: ease-in .2s;
                            }

                            button:hover{
                                color: #5a8687;
                                background-color: white;
                                border: 1px solid #5a8687;
                                padding: 8px;
                                border-radius: 5px;
                            }
                        }
                    }

                }

                .renterInfo{
                    margin-left: 10px;
                    padding: 20px;
                    width: 50%;
                    position: relative;
                    h1{
                        color: #5a8687;
                        font-size: 18px;
                        font-weight: bold;
                    }

                    .info{
                        display: flex;
                        gap:10px;
                        margin-top: 10px;
                        max-height: 24px;
                        overflow:hidden;

                        span{
                            flex-basis: 175px;
                            color: #5a8687;
                           
                        }
                        
                        p{
                            max-width: 450px;
                            
                        }
                    }
                }

                .additionalBtn{
                    margin-top:10px;
                    margin-right:10px;
                    display:flex;
                    justify-content: end;
                    align-item: center;
                    text-align:center;
                    gap: 20px;

                    button{
                        display:flex;
                        justify-content: center;
                        align-item: center;
                        text-align:center;
                    }

                    .icon{
                        margin-right: 5px;
                        font-size: 20px;
                    }

                    .notice{
                        width: 120px;
                        border-radius: 15px;
                        color: white;
                        background-color:red;
                        padding: 5px 10px 5px 8px;
                    }

                    .notice:hover{
                        color: red;
                        background-color:white;
                        border: 1px solid red;
                    }

                    .message{
                        width: 120px;
                        border-radius: 15px;
                        color: white;
                        background-color: #006AFF;
                        padding: 5px 10px 5px 8px;
                    }

                    .message:hover{
                        color: #006AFF;
                        background-color:white;
                        border: 1px solid #006AFF;
                    }
                }
    
                .tableBody{
                    max-height: 680px;
                    overflow-y:auto;
                    &::-webkit-scrollbar {
                        display: none;
                        
                    }
    
                    .tableRow{
                        display:flex;
                        justify-content: space-between;
                        text-align: center;
                        align-items: center;
                        border: 1px solid #109475;
    
                        .tableData{
                            width: 100%;
                            color: black;
                            padding: 10px 20px;
                            text-align: center;
    
                            img{
                                border-radius: 10px;
                            }
    
                            .view, .hideView{
                                display:flex;
                                gap: 2px;
                                width: 150px;
                                border-radius: 15px;
                                color: white;
                                background-color:#109475;
                                padding: 5px 0px 5px 8px;
                            }
    
                            .view:hover, .hideView:hover{
                                color: #109475;
                                background-color:white;
                                border: 1px solid #109475;
                            }
    
                        }
    
                        .actionBtn{
                            display:flex;
                            justify-content: center;
                            gap: 5px;
    
                            button{
                                display:flex;
                                justify-content: center;
                                align-items:center;
                                text-align:center;
    
                                .icon{
                                    margin-right: 5px;
                                    font-size: 18px;
                                }
                            }
                            
                        }
                    }
    
                    .last{
                        border-radius: 0 0 15px 15px ;
                    }
                }
            }

        }
    }
`