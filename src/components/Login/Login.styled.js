
import styled from "styled-components";

export const LoginContainer = styled.div`
    width: 100% !important;
    height: 100vh;
    display: flex;
    

    .content{
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        display: flex;
        flex-direction: column;
        width: 100% !important;
        height: 100% !important;
        background-image: linear-gradient(to right , #0e7490 , #07bac8);
        background-size: cover;
        justify-content: center;
        align-items: center;
        color: white;

        img{
            height: 130px;
            width: auto;
            margin-bottom: 20px;
            margin-top: -20px;
        }

        .loginFormContainer{
            margin-bottom: 150px;
            display: flex;
            flex-direction: column;

            .loginForm{
                margin-bottom: 10px;
                background-color: hsl(0, 0%, 100%, 85%);
                width: 450px;
                height: 320px;
                border-radius: 10px;
                padding-top: 40px;
                padding-left: 50px;
                padding-right: 50px;
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

                .submitBtn{
                    background-color: rgb(14 116 144); 
                    flex: auto;
                    flex-direction: row;
                    justify-content: space-between;
                    width: 100%;
                    font-size: 15px;
                    color: white;
                    border-radius: 10px;
                    margin-top: 20px;
                    margin-bottom: 10px;
                    padding: 7px 15px 7px 15px;
                }

                button:hover{
                    background-color: hsla(200, 100%, 30%, 0.75);
                    color: white;
                }

                a{
                    flex: auto;
                    flex-direction: row;
                    color: hsla(200, 100%, 30%, 0.75);
                }

                a:hover{
                    color: hsla(200, 100%, 50%, 0.75);
                    transition: ease-in 0.1s;
                }
            
                
            }


            .signup{
                margin-top: 10px;
                text-align: center;
                background-color: hsl(0, 0%, 100%, 85%);
                border-radius: 10px;
                padding: 10px;
                font-size: 15px;

                p{
                    color: black;
                }

                a{
                    color: hsla(200, 100%, 30%, 0.75);
                }

                a:hover{
                    color: hsla(200, 100%, 50%, 0.75);
                    transition: ease-in 0.1s;
                }

                
            }

        }
    }


`