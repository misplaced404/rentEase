import styled from "styled-components";


export const RentManagementContainer = styled.div`
    margin-left: 250px;
    color:#0e7490;
    background-color: #efefef;
    height: 100vh;
    overflow: auto;

    .header{
        margin-left: 30px;  

        h1{
            font-size: 28px;
            font-weight: bold;
            padding-top: 25px;
            
        }
    
        h3{
            font-size: 18px;
            padding-top: 10px;
        }

    }

    .body{
        display: flex;
        flex-direction: column;
        overflow: auto;
        margin: 20px 30px; 
        display: flex;
        flex-wrap:wrap;

        .tabContainer{
            display: flex;
            margin-top: 10px;
            
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

        .likedCardsContainer{
            display:flex;
            justify-content: start;
            flex-wrap:wrap;
            gap: 30px 50px;
            overflow: auto;
            background-color:#87bac8;
            padding: 20px;
            border-radius: 0 10px 10px 10px;
            height: 780px;
            max-height: 780px;


        }

        .rentedCardsContainer{
            display:flex;
            flex-wrap:wrap;
            overflow: auto;
            background-color:#87bac8;
            padding: 10px 20px;
            border-radius: 0 10px 10px 10px;
            height: 780px;

            .rentCard{
                background-color: white;
                height: 450px;
                width: 750px;
                border-radius: 15px;
                margin: 15px 15px 15px 5px;
                display: flex;
                flex-direction:column;
                box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;  
                
    
                .rentCardBody{
                    display: flex;
                    gap: 30px;
                    padding: 20px 20px 0 20px; 
                }
    
                
                .col1{
                    overflow: auto;
                    height: 100%;
                    width: 300px;
                    display:flex;
                    flex-wrap: wrap;
                    flex-direction: column;
                    gap: 5px;
    
                    img{
                        height: 240px;
                        width: 100%;
                        object-fit: cover;
                        border-radius: 15px;
                        
    
                    }
    
                    h2{
                        margin-top:5px;
                        font-size: 20px;
                        font-weight: bold;
                        max-height: 30px;
                        overflow:hidden
                    }
    
                    h3{
                        font-size: 18px;
                        max-height: 54px;
                        overflow:hidden
                    }
    
                    span{
                        color: black;
                    }
            
    
                }
    
                .col2{
                    width: 350px;
                    display:flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-top: -5px;
    
                    h2{
                        font-size: 20px;
                        font-weight: bold;
                    }
    
                    .history{
                        cursor: pointer;
                    }
    
                    .history:hover{
                        text-decoration: underline;
                        color: black;
                    }
    
                    .infoSection{
                        width: 100%;
                        display: flex;
                        flex-wrap: nowrap;
    
                        span{
                            min-width: 160px;
                            flex-basis: 160px;
                        }
    
                        p{
                            color: black;
                            max-width: 350px;
                            max-height: 24px;
                            overflow:hidden;
                            font-size: 15px;
                        }
                    }
    
                }
    
                .rentCardFooter{
                    display: flex;
                    gap: 30px;
                    justify-content: flex-end;
                    margin-top: auto;
                    margin-right: 20px;
                    margin-bottom:20px;
    
                    .actionBtn{
                      margin-top: auto;
                      display: flex;
                      gap: 10px;    
    
                      button{
                          color: white;
                          background-color:#0e7490;
                          padding: 5px 25px;
                          border-radius: 10px;
                          display: flex;
                          gap: 5px;  
                          align-items:center;
  
                          
                      }
  
                      .message{
                          background-color:#006AFF;
                          color: white;
                          transition: ease-in .2s;
                      }
  
                      .message:hover{
                          background-color:white;
                          color: #006AFF;
                          border: 1px solid #006AFF;
                      }
  
                      .pay{
                          background-color:#109475;
                          color: white;
                          transition: ease-in .2s;
                      }
  
                      .pay:hover{
                          background-color:white;
                          color: #109475;
                          border: 1px solid #109475;
                      }

                      .rate{
                        background-color:#ffd20c;
                        color: white;
                        transition: ease-in .2s;
                      }

                      .rate:hover{
                          background-color:white;
                          color: #ffd20c;
                          border: 1px solid #ffd20c;
                      }
                    }
                }
                
            }
        }

        

        
    }

    

`

export const PropertyCard = styled.div`
  height: 500px;
  width: 360px;
  border-width: 1px;
  border-radius: 10px;  
  // border-color:#0e7490;
  background-color: white;
  display:flex;
  flex-direction: column;
  overflow:hidden;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  

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

  .starRate{
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 15px;
    border-radius: 0 8px 8px 0;
    background-color: rgba(14, 116, 144,0.75);
    color: white;
    padding: 5px 20px;
    float: left;
    margin-top: -33px;
    position: relative;
    z-index: 1;
  }

  .heartBtn{
    font-size: 18px;
    border-radius: 50%;
    background-color: rgba(14, 116, 144,0.75);
    color: white;
    padding: 9px 8px 8px 8px;
    float: right;
    margin-top: -210px;
    margin-right: 10px;
    position: relative;
    z-index: 1;
    cursor: pointer;
  }

  .active{
    color: red;
  }

  .propInfo{
    flex-grow:2;
    margin: 0px 20px;
    height: 150px;
    overflow: hidden;
  }

  .propInfo .propertyName{
    font-size: 18px;
    font-weight: bold;
    margin-top: 10px;
  }

  .propInfo .location{
    font-size: 18px;
  }

  .propInfo .type{
    font-size: 16px;
    color: black;
  }

  .propInfo .amenities{
    max-height: 150px;
    overflow: hidden;
    font-size: 15px;
    color: gray;
  }

  hr{
    border: 1.5px solid lightgray;
  }

  .propFooter{
    margin: 20px 20px;
    display:flex;
    justify-content: space-between;
  }

  .footerDate{
    display: flex;
    color: gray;
  }

  .footerDate .dateIcon{
    margin-right: 10px;
    font-size: 20px;
    align-self: center;
  }


  .propFooter a:hover{
    color:black;
  }

`