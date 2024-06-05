import styled from "styled-components";


export const AdminUserManagementContainer = styled.div`
    width: 100wv;
    height: 100vh;
    background-color:#e7f1f4;

    .navBar{
        width: 100wv;
        height: 70px;
        color: white;
        background-color:#0e7490;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 30px;

        .logo{
            display:flex;
            gap: 10px;
            align-items: center;

            img{
                width: 50px;
                height: 50px;
            }
            span{
                font-weight: bold;
                font-size: 25px; 
            }
        }

        .logout{
            font-size: 18px;
        }

        .logout:hover{
            color:black;
            text-decoration: underline;
        }
    }

    .header{
        margin-top: 3   0px;
        display: flex;

        .tab{  
            background-color: white;
            cursor: pointer;
            padding: 10px 20px;
            color: white ;
            border: 1px solid #569eb1;
        }

        .active{
            background-color:#569eb1;
            h1{
                color: white;
            }
        }

        h1{
            font-size: 18px;
            color: #0e7490;
            font-weight: bold;
        }
    }

    .body{
        margin-top: 20px;
        margin-left: 20px;
        margin-right: 30px;
        height: 830px;
        

        .table{
            background-color:#569eb1;
            border-radius: 0 10px 10px 10px;
            width: 100%;
            overflow: auto;
            padding: 10px;

            .tableHeader{
                background-color: #569eb1;
                color: white;
                width: 100%;
                border-radius: 10px 10px 0 0;

                .headerRow{
                    width: 100%;
                    display: flex;
                    justify-content: space-around;
                     flex: 1 1 auto;

                    .headerData{
                        width: 16.7%;
                        display: flex;
                        justify-content: center;
                        padding: 15px 0;
                        font-size: 16px;
                    }
                }

            }

            .tableBody{
                border-radius:10px;
                background-color: white;
                color: black;
                width: 100%;
                margin-top: 10px;
                height: 700px;
                max-height: 700px;
                overflow: auto;

                .bodyRow{
                    width: 100%;
                    display: flex;
                    justify-content: space-around;
                    border: 1px solid #569eb1;

                    .tableData{
                        width: 16.7%;
                        display:flex;
                        justify-content: center;
                        align-items: center;
                        padding: 15px 0;
                        font-size: 16px;

                        .actionBtns{
                            display: flex;
                            flex-direction: column;
                            gap: 5px;
                            

                            .view{
                                padding: 5px 30px;
                                border-radius: 20px;
                                background-color:#0e7490;
                                color: white;
                            }

                            .edit,.approve{
                                padding: 6px 40px;
                                border-radius: 20px;
                                background-color: #00b050;
                                color: white;

                            }

                            .delete,.reject{
                                padding: 6px 40px;
                                border-radius: 20px;
                                background-color: red;
                                color: white;


                            }
                        }
                        
                    }
                }
            }
        }
    }
`