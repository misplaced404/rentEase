import styled from "styled-components";


export const NavBarContainer = styled.div`
width: 100%;

    .header{
        position: fixed;
        width: 100%;
        z-index: 2;
        padding: 0 30px;
        background-image: linear-gradient(to right, rgba(14, 116, 144,1), rgba(7, 186, 200,1));
        color: white;
    }

    li:hover{
        color: rgb(8 51 68 / var(--tw-bg-opacity));
        transition: ease-in .2s;
    }

    .navbar{
        width: 100%;
        height: 75px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .getStarted_Btn{
            background-color: white;
            color: rgba(7, 186, 200,1);
            padding: 8px 25px;
            border-radius: 20px;
            font-weight: bold;
            cursor: pointer;
    
        }
    
        .getStarted_Btn:hover{
            color: white;
            background-color: rgba(7, 186, 200,1);
            border: solid;
            border-color: white;
            border-width: 2px;
            transition: ease-in 0.2s;
        }


        @media (min-width: 992px) {
            .links{
                display: flex;
                font-size: 15px;
                gap: 3rem;
                margin-left: -120px;
                cursor: pointer;


                li{
                    font-size: 16px;
                    transition: ease .1s;
                }

                li:hover{
                    font-size: 18px;
                    font-weight:bold;
                }
            }
        }

        /*  responsive design */
        @media (max-width: 992px) {

            .links, .getStarted_Btn{
                display: none;
            }

            .toggle_btn{
                display: block;
                font-size: 30px;
            }
            
        }


    }

    .logo{
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .logo a{
        font-weight: bold;
    }

    .logoImage{
        height: 60px;
        width: auto;
        padding-right: 10px;
        display: flex;
        
    }

    .toggle_btn{
        display: none;
        font-size: 30px;
    }

   


    /* Dropdown */
    .dropdown_menu{
        position: absolute;
        display: none !important;
        right: 2rem;
        top: 60px;
        width: 300px;
        height: 0px;
        background: rgba(255,255,255,0.1);
        backdrop-filter: blur(15px);
        border-radius: 10px;
        overflow: hidden;
        transition: height .2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .dropdown_menu.open{
        height: 240px;
    }


    .dropdown_menu li{
        padding: 0.7rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }


    

`