import styled from "styled-components";


export const RatingModalContainer = styled.div`
    width: 100vw;
    height: 100vh;
    background-color:rgba(0, 0, 0, 0.25);
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 200;

    .modalContainer{
        width: 600px;
        height: 400px;
        padding: 20px;
        border-radius: 10px;
        background-color: white;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        display: flex;
        flex-direction: column;
        align-items: center;

        .header{
            display:flex;
            flex-direction: column;
            align-items: center;

            h3{
                color: #0e7490;
                font-size: 25px;
                font-weight: bold;
                margin-bottom: 5px;
            }
        }

        .starRating{
            width: 100%;
            display: flex !important;
            flex-direction: row !important;
            justify-content: center !important;
        }

        .comments{
            padding: 10px;
            border: 1px solid #0e7490;
            border-radius: 8px;
            resize: none;
        }

        .actions{
            display: flex;
            gap: 20px;
            margin-top: 20px;

            button{
                color: white;
                padding: 8px 20px;
                border-radius: 8px;
            }

            .cancel{
                background-color: gray;
            }

            .rate{
                background-color: #0e7490;
            }
        }
    }

 `