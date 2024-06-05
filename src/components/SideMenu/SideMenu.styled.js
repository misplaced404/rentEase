import styled from "styled-components";

export const SideMenuContainer = styled.div`
  background-color: #0e7490;
  width: 250px; 
  height: 100%;
  color: white;
  font-size: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  float: left;
  overflow-y: auto;
  flex-grow:1;
  align-content: space-between;

  .upperMenu{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .lowerMenu{
    width: 100%;
    margin-top: auto;
    
    .premiumLink{
      text-align: center;
      font-size: 15px;

      .premium{
        color: yellow;
      }

      .danger{
        color:red
      }
    }
    
    .accountInfo{
      padding: 25px 0px;
      display:flex;
      justify-content: start;
      align-items: center;
      height: 100px;
    }

  }

  .userIcon{
    padding: 10px;
    border: 2px solid white;
    border-radius: 50px;
    margin-left: 20px;
    margin-right: 20px;
    font-size: 25px;
    transition: ease-in .1s;
  }

  .userIcon:hover{
    cursor: pointer;
    background-color: #efefef;
    color:#0e7490;
  }


  .dropupContent{
    font-size: 15px;
    position: absolute;
    background-color: white;
    color:black;
    min-width: 160px;
    padding-left: 10px;
    padding-bottom: 10px;
    padding-top: 7px;
    bottom: 80px;
    left: 50px;
    margin-bottom: 5px;
    z-index: 1;
    cursor: pointer;
    border-radius: 10px 10px 10px 0px;
  }

  .dropupContent li{
    padding: 4px;
    margin-right: 10px;
    border-radius: 5px;
    font-size: 15px;
  }

  .dropupContent li:hover{
    background-color: #1083a3;
    color: white;
    
  }

  .userInfo{
    margin-top: -10px;
  }

  .userName{
    font-size:16px;
    font-weight: bold;
  }

  .userType{
    font-size:12px;
  }

  .menuBars{
    margin-right: -20px;
    margin-top: 10px;
  }

  img{
    width: 60px;
    height: auto;
    margin-top: 10px;
    margin-right: 10px;
    margin-left: -10px;
  }

  .logo{
    display: flex;
    text-align: center;
    align-items: center;
    padding: 10px;
  }

  .logoName{
    margin-bottom:-10px;
    margin-right: 10px;
    font-weight: bold;
    font-size: 30px;
  }

  hr{
    color: white;
    width: 100%;
    margin-top: 5px;
  }

  .tabItems{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 10px;

    .active{
      background-color:#efefef;
      color: #0e7490;
    }
  
  }


  #tabList{
    margin: 18px 0px;
  }

`

export const Tabs = styled.div`
  display: flex;
  justify-content: space-between;
  width: 250px;
  padding-left: 20px;
  padding-right: 20px;
  transition: ease-in .1s;

  &:hover{
    color:#0e7490;
    background-color: #efefef;
    
  }

 
`

export const Icon = styled.span`
  font-size: 25px;
  margin-right: 10px;
`

export const TabName = styled.span`
  display: flex;
  font-size: 15px;

`
