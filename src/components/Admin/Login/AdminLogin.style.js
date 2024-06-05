import styled from "styled-components";


export const AdminLoginContainer = styled.div`
    width: 100wv;
    height: 100vh;
    background-color: #b7d5de;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: auto;

    .side{
        height: 400px;
        width: 600px;   
        border-radius: 10px 0 0 10px;
        background-image: linear-gradient(to bottom right  , #0e7490 , #07bac8);
        display:flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;

        .imagecontainer{
            height: 150px;
            width: 150px;
        }

        .content{
            color: white;
            display:flex;
            flex-direction: column;
            text-align: center;

            h1{
                font-size: 50px;
                font-weight: bold
            }

            p{
                font-size: 30px;
            }
        }

    }

    .loginContainer{
        height: 400px;
        width: 600px; 
        background-color: white;
        border-radius: 0 10px 10px 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;

        .inputField{
            width: 400px;
            margin: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 30px;

            input{
                width: 100%;
                border: 1px solid #07bac8;
                padding: 10px 15px;
                border-radius: 10px;
                font-size: 15px;
            }

            button{
                font-size: 15px;
                width: 100%;
                background-color: #07bac8;
                color: white;
                padding: 10px 15px;
                border-radius: 10px;
            }
        }
    }
    
`