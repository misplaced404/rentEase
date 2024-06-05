import styled from "styled-components";

export const PaymentsContainer = styled.div`
    margin-left: 250px;
    background-color: #efefef;
    color:#0e7490;
    height: 100vh;
    overflow: auto;

    .header{
        margin-left: 30px;  
        margin-top: 25px;

        h1{
            font-size: 30px;
            font-weight: bold;
        }
    }

    .body{
        margin: 30px; 
        height: 750px;
        
        .paymentTableContainer{
            border-width: 1px;
            border-color:  #0e7490;
            border-radius: 15px;
                
            .paymentTableHeader{   
                background-color: #0e7490; 
                border-radius: 13px 13px 0 0;
        
                .paymentTableRow{
                    display:flex;
                    
                    .tableHead{
                        width: 100%;
                        font-size: 16px;
                        font-weight: bold;
                        color:white;
                        padding: 15px 20px;
                        display: flex;
                        text-align: center;
                        align-items: center;
                        justify-content: center;
                        gap: 10px;
                        border-color:  #0e7490;
                        flex: 1;
                    }

                    .person{
                        flex:2;
                    }

                    .propertyName{
                        display:flex;
                        flex: 3;
                    }
                }
            }
               
            .paymentTableBody{
                height: 750px;
                max-height: 750px;
                overflow: auto;
                background-color: white;

                .emptyTable{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    gap: 10px;

                    .icon{
                        font-size: 50px;
                    }

                    .emptyText{
                        font-size: 25px;
                    }
                }
    
                .paymentTableRow{
                    display:flex;
                    height: 64px;
                    overflow:hidden;   
                    border-width: 0 0 2px 0;
                    border-color: lightgray;
                }
    
                .tableData{
                    width: 100%;
                    padding: 15px 20px;
                    display: flex;
                    text-align: center;
                    justify-content: center;
                    color: black;
                    max-height: 40px;
                    overflow: hidden;  
                    flex: 1; 
    
                    button{
                        color: white;
                        background-color: #0e7490;
                        padding: 8px;
                        border-radius: 5px;
                        transition: ease-in .2s;
                    }
    
                    button:hover{
                        color: #0e7490;
                        background-color: white;
                        border: 1px solid #0e7490;
                        padding: 8px;
                        border-radius: 5px;
                    }
                }

                .person{
                    flex:2;
                }

                .propertyName{
                    display:flex;
                    flex: 3;
                }
            }
        
        }
    }

`