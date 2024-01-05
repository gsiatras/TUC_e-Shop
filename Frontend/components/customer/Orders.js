import styled from "styled-components";
import Center from "./Center";
import WhiteBox from "./WhiteBox";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import CartTable from "./CartTable";

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    margin-top: 40px;
    margin-bottom: 450px;
    
`; 



export default function Orders() {
    const [orders, setOrders] = useState([]);
    const email = Cookies.get('email');
    

    useEffect(() => {
        axios.get('/api/orders?email='+email).then(response => {
            setOrders(response.data);
        })
        console.log({orders});
    }, []);


    return (
        <>
        <Center>
            <ColumnsWrapper>
                <WhiteBox>
                    <h1>
                        Orders
                    </h1>
                    {!orders?.length && (
                        <div>No orders found</div>
                    )}
                    {orders?.length > 0 && (
                        <CartTable>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Seller</th>
                                    <th>Products</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders?.length > 0 && orders.map(order => (
                                    <tr key={order._id}>
                                        <td>{(new Date(order.createdAt)).toLocaleDateString()}</td>
                                        <td>{order.seller}</td>
                                        <td>{order.line_items.map(l => (
                                            <>
                                                {l.price_data?.product_data?.name} x {l.quantity} <br/>
                                            </>
                                        ))}
                                        </td>
                                        <td>{order.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </CartTable>
                    )}
                </WhiteBox>
            </ColumnsWrapper>
        </Center>
        </>
    )
    
}