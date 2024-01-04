import Layout from "@/components/seller/Layout";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const seller = Cookies.get('username');
    
    useEffect(() => {
        axios.get('/api/orders?seller='+seller).then(response => {
            setOrders(response.data);
        })
    }, []);

    return(
        <Layout>
            <h1 className="header1">Orders</h1>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Recipient</th>
                        <th>Products</th>
                        <th>Paid</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 && orders.map(order => (
                        <tr>
                            <td>{(new Date(order.createdAt)).toLocaleString()}</td>
                            <td>
                                {order.name} {order.email} <br/>
                                {order.city} {order.postalCode} {order.country}<br/>
                                {order.streetAddress}
                            </td>
                            <td>
                                {order.line_items.map(l => (
                                    <>
                                        {l.price_data?.product_data?.name} x {l.quantity} <br/>
                                    </>
                                ))}
                            </td>
                            <td className={order.paid ? 'text-green-600' : 'text-red-400'}> 
                                {order.paid ? 'YES' : 'NO'}
                            </td>
                            <td>
                                {order.status}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>

    );
}