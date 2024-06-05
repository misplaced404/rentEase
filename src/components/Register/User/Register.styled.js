import styled from "styled-components";

export const RegisterContainer = styled.div`
    width: 100%;
    height: 100vh;
    padding: 0;
    margin: 0;
    
    
    .content{
        width: 100%;
        height: 100%;  // Subtract the top margin from the height
        padding-top: 75px;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        display: flex;
        flex-direction: column;
        background-image: linear-gradient(to right , #0e7490 , #07bac8);
        justify-content: center;
        align-items: center;
        color: white;
        overflow: hidden;

        img{
            height: 130px;
            width: auto;
            margin-bottom: 20px;
            margin-top: 20px;
        }
    }

    .success {
        color: green;
    }
    

    .signUpForm{
        background-color: hsl(0, 0%, 100%, 85%);
        width: 450px;
        height: 580px;
        border-radius: 10px;
        padding-top: 30px;
        padding-left: 50px;
        padding-right: 50px;
        margin-bottom: 100px;
        color: black;
        font-size: 15px;

        h2{
            color: rgb(14 116 144);
            font-size: 25px;
            font-weight: bold;
        }

        input{
            background-color: white !important;
            border-color: rgb(14 116 144);
            border-width: 0.1px;
            border-radius: 5px;
            padding: 5px;
            padding-left: 10px;
            margin-top: 20px;
            height: 40px;
            width: 100%;
        }

        .formBtn{
            flex: auto;
            flex-direction: row;
            justify-content: space-between;
            font-size: 15px;
        }

        .submitBtn{
            background-color: rgb(14 116 144); 
            color: white;
            border-radius: 10px;
            margin-top: 30px;
            padding: 8px 15px 8px 15px;
            margin-left: 176px;
        }

        .cancelBtn{
            background-color: rgb(128, 128, 128); 
            color: white;
            border-radius: 10px;
            margin-top: 30px;
            padding: 8px 15px 8px 15px;
            margin-right: auto;
        }

        .submitBtn:hover{
            background-color: hsla(200, 100%, 30%, 0.75);
            color: white;
        }

        .cancelBtn:hover{
            background-color: rgb(107, 107, 107);
            color: white;
            
        }
        
    }

`