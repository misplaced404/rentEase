import styled from "styled-components";


export const PaymentHistoryTableContainer = styled.div`
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
            }
        }
    }
       
        .paymentTableBody{
            max-height: 250px;
            overflow: auto;

            .paymentTableRow{
                display:flex;
            }

            .tableData{
                width: 100%;
                padding: 15px 20px;
                display: flex;
                text-align: center;
                align-items: center;
                justify-content: center;

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
        }

    }

    

`