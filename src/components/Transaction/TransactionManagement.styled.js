import styled from "styled-components";

export const TransactionContainer = styled.div`
    margin-left: 250px;
    background-color: #efefef;
    color:#0e7490;
    height: 100vh;
    overflow: auto;

    .header{
        padding-top: 25px;
        margin-left: 30px;

        h1{
            font-size: 30px;
            font-weight: bold;
            
        }
    }

    .body{
        margin-left: 30px;
        margin-right: 30px;
        padding-bottom: 30px;

        .tabContainer{
            display: flex;
            margin-top: 20px;
            
            .tab{
                padding: 10px 20px;
                color:#0e7490;
                background-color: white;
                cursor: pointer;  
                transition: ease-in .2s;

                &:hover{
                    color: white;
                    background-color:#87bac8;
                }
                
            }

            .active{
                color: white;
                background-color:#87bac8;
            }
        }

        h2{
            padding-top: 20px;
            padding-left: 20px;
            font-size: 20px;
            font-weight: bold;  
            color: white;
        }

        .ownerContent, .renterContent{
            background-color:#87bac8;
        }

        .table{
            width: 100%;
            margin-top: 20px;
            

            .tableHeader{

                .tableRow{
                    display:flex;
                    text-align: center;
                    box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;     
                    margin: 0 10px; 
                    
                    .tableHead{
                        width: 100%;
                        font-size: 16px;
                        color: white;
                        background-color:#0e7490;
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

                        a{
                            color: #0e7490;
                            cursor: pointer;
                            text-decoration: underline;
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

            .tableBody{
                height: 650px;
                max-height: 650px;
                overflow-y:auto;
                border-radius: 0 0 10px 10px;
                margin: 0 10px 10px 10px;
                background-color:#cfe3e9;

                .tableRow{
                    height: 180px;
                    background-color: white;
                    display:flex;
                    justiify-content: space-between;
                    text-align: center;
                    align-items: center;
                    margin-top: 15px;
                    border: 1px #0e7490;
                    box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;                    



                    .tableData{
                        width: 100%;
                        color: black;
                        background-color:;
                        margin: 10px 10px;
                        text-align: center;
                        display:flex;
                        flex-direction:column;
                        flex-basis: 199px;

                        .imgContainer{
                            height: 160px;
                            display:flex;
                            align-items:center;
                            border-radius: 10px;
                            flex-basis: 199px;
                        }

                        img{
                            border-radius: 10px;
                            height: 160px;
                            flex-basis:  199px;
                            object-fit: cover;
                        }

                        .danger{
                            color: red;
                        }

                        .success{
                            color: #00b050;
                        }

                        .view, .info{
                            width: 120px;
                            border-radius: 15px;
                            color: white;
                            background-color:#0e7490;
                            padding: 5px 10px 5px 8px;
                        }

                        .view:hover, .info:hover{
                            color: #0e7490;
                            background-color:white;
                            border: 1px solid #0e7490;
                        }

                        .remove{
                            width: 120px;
                            border-radius: 15px;
                            color: white;
                            background-color:red;
                            padding: 5px 10px 5px 8px;
                        }

                        .remove:hover{
                            color: red;
                            background-color:white;
                            border: 1px solid red;
                        }

                        .accept, .refresh, .payment{
                            width: 120px;
                            border-radius: 15px;
                            color: white;
                            background-color: #00b050;
                            padding: 5px 10px 5px 8px;
                        }

                        .accept:hover, .refresh:hover, .payment:hover{
                            color: #00b050;
                            background-color:white;
                            border: 1px solid #00b050;
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

                        .reject{
                            width: 120px;
                            border-radius: 15px;
                            color: white;
                            background-color:red;
                            padding: 5px 10px 5px 8px;
                        }

                        .reject:hover{
                            color: red;
                            background-color:white;
                            border: 1px solid red;
                        }

                        a{
                            color: #0e7490;
                            cursor: pointer;
                            text-decoration: underline;
                        }

                    }

                    .actionBtn{
                        display:flex;
                        flex-direction: column;
                        gap: 5px;

                        button{
                            margin:auto;
                            display:flex;
                            justify-content: center;
                            align-items: center;
                            text-align:center;
                            font-size: 14px;

                            .icon{
                                margin-right: 5px;
                                font-size: 20px;
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
`