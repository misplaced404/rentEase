import styled from "styled-components";


export const RegistrationModalBackdrop = styled.div`
    position:fixed;
    overflow: auto;
    z-index:2;
    top:0;
    bottom: 0;
    right:0;
    left:0;
    display:flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);

    .ModalContainer{
        width: 670px;
        background-color: white;
        border-radius: 20px;
        position: relative;

        .modalHeader{
            background-color: #0e7490;
            border-radius: 10px 10px 0 0;
            padding: 20px;
            color: white;
            display:flex;
            align-items: center;
            text-align: center;
            justify-content: space-between;

            h1{
                margin:0;
                font-weight:bold;
                font-size: 20px;
            }

            button{
                border-radius: 50%;
                transition: ease-in .1s;
            }

            button:hover{
                background-color: rgba(0,0,0,.50);
                color: white;
            }

            .closeBtn{
                font-size: 30px;
                
            }
        }
    }
`