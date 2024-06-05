import styled from "styled-components";


export const PropertyListContainer = styled.div`
  color:#0e7490;
  margin-left: 250px;
  overflow: auto;
  height:100vh;
  background-color: #efefef;

  .header{
    display: flex;
    text-align:center;
    justify-content: space-between;

    h1{
      font-size: 28px;
      font-weight: bold;
      margin-top: 25px;
      margin-left: 30px;
    }
    .typewriterSpan{
      font-size: 15px;
      margin-top: 30px;
      margin-right: 30px;
      color:black;
    }


    p{
      margin-top: 30px;
    }

    @keyframes typing {
      from { width: 0; }
      to { width: 100%; }
    }

    .typewriterContainer{
      display:flex;
      align-items: center;
      text-align-center;
    }

    .typewriter{
      display: inline-block; /* Added this line */
    }

    .text{
      overflow: hidden;
      border-right: .50em solid darkgray;
      font-weight: bold;
      font-size: 14px;
      white-space: nowrap;
      letter-spacing: .15em;
      animation: 
      typing 2s steps(10) infinite, /* Adjusted duration here */
      .75s step-end infinite alternate;
      color: #0e7490;
      margin-right:35px;
      margin-left: -25px;
      cursor: pointer;
      text-decoration: underline; 
    }

  }

 

  .searchSection{
    display: flex;
    flex-direction: row;
    margin-top: 30px;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    gap: 10px;

    form{
      justify-self: start;
      margin-left: 30px;
  
    }
  
    form input{
      border-radius: 10px;
      border-width: 1px;
      border-color: #0e7490;
      color: black;
      width: 300px;
      padding: 4px 6px;
    }
  
    form button{
      border-radius: 15px;
      background-color: #0e7490;
      color: white;
      padding: 5px 22px;
      margin-left: 10px;
      font-size: 15px;
    }

    .filterBtn{
      display: flex;
      align-items:center;
      gap: 5px;
      border-radius: 15px;
      background-color: #0e7490;
      color: white;
      padding: 5px 20px;
      margin-left: 10px;
      font-size: 15px;
    }

    .sortSearch{
      margin-left: 10px;
      font: 15px;
      display: flex;
      align-items: center;
      gap: 10px;

      select{
        background-color:  #efefef;
        padding: 5px 6px;
        transition: ease-in .2s;

        &:focus{
          background-color:  white;
        }

        &:hover{
          background-color:  white;
        }
      }
    }

    .paginationSearch{
      margin-left: auto;
      margin-right: 30px;
    }
  }

  .filterResultSection{
    display: flex;
    gap: 10px;
    margin: 10px 30px;
    
    .filterResult{
      position: relative;
      gap: 10px;
      padding: 5px 28px 8px 15px;
      color: white;
      background-color:#0e7490;
      border-radius: 10px;


      .closeBtn{
        font-size: 20px;
        color: white;
        position: absolute;
        top: 2px;
        right: 5px;
        cursor: pointer;

        &:hover{
          color: red;
        }
      }
    }

  }

  .cardSection{
    margin-top: 30px;
    margin-bottom: 50px;
    margin-left: 30px;
    margin-right: 30px;
    display: flex;
    justify-content: start;
    flex-wrap: wrap;
    gap: 30px 50px;
  }

  .bottomPaginationSearch{
    width: 100%;
    display:flex;
    justify-content: center;
    padding: 30px;
  }
`;


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