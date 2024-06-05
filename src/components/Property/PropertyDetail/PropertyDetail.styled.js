import styled from "styled-components";


export const PropertyListContainer = styled.div`
  color:#0e7490;
  margin-left: 250px;
  position:relative;
  height: 100vh;
  overflow: auto;
  background-color: #efefef;
  padding-top: 20px;

  .backLink{
    display:inline-flex;
    font-size: 16px;
    
    margin-left: 30px;
  }

  .backLinkIcon{
    font-size: 25px;
    margin-right: 5px;
  }

  .header{
    display:flex;
    justify-content: space-between;
    width:100wv;
    margin-left: 30px; 
    margin-right:30px;

    .headerButtons{
      display:flex;
      gap: 10px;
      
      
      button{
        border: 1px solid;
        border-radius: 18px;
        display:flex;
        gap: 5px;
        flex-direction: row;
        align-items: center;
        padding: 3px 20px;
        transition: ease-in .2s;
      }

      .renter{
        color: white;
        background-color: #0e7490;
      }

      .renter:hover{
        color: #0e7490;
        background-color: white;
      }

      .message{
        color:	white;
        background-color: #006AFF;
      }

      .message:hover{
        color:	#006AFF;
        background-color: white;
      }

      .like{
        color: white;
        background-color:red;
      }

      .like:hover{
        color: red;
        background-color: white;
      }

      .pay{
        color: white;
        background-color: #00b050;
      }

      .pay:hover{
        color:	#00b050;
        background-color: white;
      }

      .headerIcon{
        font-size: 20px;
      }
      
    }
  }

  h1{
    font-size: 28px;
    font-weight: bold;
    margin-top: 5px;
  }

  .detailBody{
    display: flex;
    flex-wrap:wrap;
    justify-content: flex-start;
    gap: 25px;
  }

  .secondSection{
    margin-top: 20px;
    margin-left: 30px;  
    width: 730px;
    height: 100%;

  }
  

`

export const Carousel = styled.div`
    margin-top: 20px;
    width: 775px;
    height: 500px;
    margin-left: 30px;
    position: relative;

    .slider{
      width: 775px;
      height: 500px;
      display: flex;
      flex-wrap:wrap;
      align-items: center;
      overflow: hidden;
      position:relative;
    }

    .slideImage{
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      object-fit: cover;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      transition: opacity 0.5s ease-in-out;
    }

    .slide-visible{
      opacity: 1;
    }

    .slide-next {
      opacity: 0;
    }

    img{
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 10px;
    }
    
    .slideBtn{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        gap: 80%;
        position: relative;
        bottom: 250px;
        z-index: 1;
    }

    .slideBtnBack,.slideBtnForward{
      font-size: 60px;
      color: white;
      border-radius: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    }

    .arrowBack{
      padding-right: 5px;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 100%;
    }

    .arrowForward{
      padding-left: 5px;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 100%;
    }

    .slideBtnBack:hover,.slideBtnForward:hover{
      background-color: rgba(0, 0, 0, 0.75);
      
    }

    .indicators{
      display: flex;
      position: absolute;
      bottom: 1rem;
      left: 50%;
      transform: translateX(-50%);
    }

    .indicator{
      background-color: #0e7490;
      height: 10px;
      width:  30px;
      border-radius: 20px;
      border: 2px solid white;
      outline: none;
      box-shadow: 0px 0px 5px #555;
      margin: 0 0.2rem;
      cursor: pointer;

     
    }

    .indicator-inactive{
      background-color: rgba(0, 0, 0, 0.50);
      border: 2px solid white;
    }

    .indicator:hover{
      background-color: #0e7490;
      border-color: white;
    }
    

`

export const ReviewArea = styled.div`
  margin-top: 20px;
  margin-left: 30px;
  height: 280px;
  border: 1px solid #0e7490;
  border-radius: 10px;
  background-color: white;

  .reviewHeader{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #0e7490;
    color: white;
    border-radius:10px 10px 0 0;

    .title{
      font-size: 18px;
      font-weight: bold;
      padding: 10px 20px;
    }

    .starRating{
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 10px 20px;
    }
  }

  .reviewBody{
    max-height: 225px;
    overflow: auto;
  
    .reviewEntry{
      padding: 10px 30px;
      display:flex;
      height:120px;
      max-height:120px;
      max-width:750px;
      gap: 20px;
      flex-direction: row;
      justify-content: flex-start
      border-color: #0e7490;
      border-width: 0 0 1px 0;

      .userRate{
        display:flex;
        gap: 5px;
        flex-direction: column;

        .rating{
          display: flex;
          gap: 5px;
          align-items: center;
          margin-right: 20px;
  
          .icon{
            color: yellow;
          }
        }
      }

      .message{
        max-width:750px;
        overflow: auto;
      }

      
    }

    .emptyReview{
      height: 225px;
      display: flex;
      justify-content: center;
      text-align: center;
      align-items: center;
      gap: 5px;
      font: 20px;

      .icon{
        font-size: 25px;
      }
    }
  }
`

export const PropertyInfo = styled.div`
  width: 775px;

  h2{
    font-weight: bold;
  }

  .propertyInfoHeader{
    width:100%;
    background-color: #0e7490;
    padding: 10px 20px;
    border-radius: 10px 10px 0 0;
    font-size: 18px;
    color: white; 
  }

  .body{
    border-radius: 0 0 10px 10px;
    border-color:#0e7490;
    border-width: 1px;
    background-color: white;
    padding: 0px 20px 20px 20px;
    display:flex;
    flex-direction: column;

    h3{
      margin: 20px 0px 5px 0;
      font-size: 15px;
      font-weight: bold;
      color: black;
    }

    
  }

  .mapsInfoSection{
    margin-top: 20px;
    display:flex;
    justify-content:center;
    align-items: center;
  }

  .maps{
    width: 300px;
    display:flex;
    align-items: center;
    border-width: 1px;
    border-radius: 15px;
    padding: 5px 20px;
    color: white;
    background-color: #0e7490;
    justify-content: center;

    .mapIcon{
      font-size: 25px;
      margin-right: 5px;
    }
  }

  .infoSection{
    display:flex;
    flex-direction:column;
    gap: 10px;
    overflow-y: auto;

    .infoSectionField{
      display:flex;
      flex-direction: row;
      
      span{
        flex-basis: 150px;
      }

      p{
        color: black;
      }

      a{
        color:blue;
      }

      .description{
        width:590px;
        max-width: 590px;
        min-height: 24px;
        max-height: 100px;
        overflow-y: auto;
      }
    }

    .sub1, .sub2{
      display:flex;
      flex-direction: column;
      justify-content:center;
      text-align: left;

      h3{
        margin-bot: 20px;
      }

      span{
        width: 150px;
      }

      p{
        max-width: 290px;
        overflow: hidden;
      }
    }

  }

  .special{
    display:flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .Payment{
    display:flex;
    flex-direction:row;
    gap: 25px;
  }

  .amenitiesSection{
    
    .noAmenities{
      width: 730px;
      border-color:#0e7490;
      border-width: 1px;
      background-color: white;
      padding: 20px 20px 20px 20px;
      display: flex;
      justify-content: center;
      align-items:center;
      gap: 5px;
      font-size: 15px;

      .icon{
        font-size: 20px;
      }
    }

    .amenitiesBody{
      width: 730px;
      max-height: 170px;
      overflow-y:auto;
      border-color:#0e7490;
      border-width: 1px;
      background-color: white;
      padding: 20px 20px 20px 20px;
      display: flex;
      flex-direction: row !important;
      justify-content: flex-start;
      flex-wrap:wrap;
      gap: 10px 20px;

      .amenitiyItem{
        width: 210px !important;
        display:flex;
        gap: 2px;
        color:black;
        width: 160px; 

        .icon{
          color: green;
          font-size: 18px;
        }
      }
    }

  }

`


export const StyledSelect = styled.select`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #0e7490;
  border-radius: 10px;
  // Add more styles as needed
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #0e7490;
  border-radius: 10px;
  // Add more styles as needed
`;