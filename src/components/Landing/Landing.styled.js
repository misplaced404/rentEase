
import styled from "styled-components";
import headerPic from "../../assets/landing/apartment.png"


export const LandingContainer = styled.div`
    display: flex;
    flex-direction: column;

    .header{
        padding: 20px;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 900px;
        justify-content: center;
        align-items: center;
        color: white;
        position: relative;
        background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url(${headerPic});
        background-size: cover;
        background-position: center center;

        .layer{
            width: 700px;
            height: 250px;
            padding: 20px;
            background-image: linear-gradient(to bottom right, rgba(14, 116, 144, 0.8), rgba(7, 186, 200, 0.8));
            display:flex;
            flex-direction: column;
            justify-content: center;
            border-radius: 10px;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        }

        h1{
            font-weight: bold;
            font-size: 50px;
            text-align: center;
            z-index: 1;
        }

        h2{
            font-size: 30px;
            text-align: center;
            z-index: 1;
        }

    }

    .aboutUs{
        background-image: linear-gradient(to bottom right, rgba(14, 116, 144, 0.8), rgba(7, 186, 200, 0.8));
        height: 850px;
        width: 100%;
        padding: 40px;
        display:flex;
        justify-content: space-evenly;
        align-items: center;
        text-align: center;

        h2{
            margin-top: 20px;
            font-size: 30px;
            font-weight: bold;
            color: #0e7490;
        }

        p{
            text-align: left;
            font-size: 18px;
        }

        li {
            margin-bottom: 10px;
            text-align: left;
            position: relative;
            padding-left: 20px; /* To make space for the custom bullet */
        
            &::before {
              content: ''; /* This is necessary for the pseudo-element to work */
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%); /* Center the bullet vertically */
              width: 8px;
              height: 8px;
              background-color: black; /* Change this to whatever color you want the bullet to be */
              border-radius: 50%; /* Makes the bullet circular */
            }

            span{
                color: #0e7490;
                font-weight: bold;
                font-size: 18px;
            }
        }

        .layer{
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: center;
            width: 800px;
            height: 700px;
            gap: 30px;
            padding: 40px 80px;
            background-color: rgba(255,255,255,.85);
            border-radius: 10px;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

            .logoArea{
                margin-top: 20px;
                display: flex;
                align-items: center;
                gap: 10px;

                span{
                    font-size: 45px;
                    font-weight: bold;
                    color: #0e7490;
                }

                img{
                    margin-bot: -20px;
                    width: 80px;
                    height: 80px;
                }

                .logo{
                    font-size: 60px;
                    border: 4px solid #0e7490;
                    border-radius: 50px;
                    padding: 10px;
                }
            }
            
            
        }
    }

    

`

