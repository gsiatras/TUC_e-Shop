import Layout from "@/components/seller/Layout";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const seller = Cookies.get('username');
    const [orderStatus, setOrderStatus] = useState('');
    const [newOrders, setNewOrders] = useState(orders);
    const orderStatuses = ['Shipped', 'Canceled', 'Completed', 'Pending'];
    const [selectedStatuses, setSelectedStatuses] = useState({});


    
    useEffect(() => {
        axios.get('http://34.118.68.24:3007/orders?seller=' + seller).then(response => {
            setOrders(response.data);
        });
    }, [seller]);

    

    function changeOrderStatus(orderId, newStatus, oldOrders){
        if (!orderId || !newStatus || !orders.length > 0) {
            console.log('Error');
            return 
        } else {
            const orderIndex = oldOrders.findIndex(order => order._id === orderId);
            if (orderIndex !== -1) {
                // If the order ID is found in the array, update the status
                oldOrders[orderIndex].status = newStatus;
                setOrders(oldOrders);
                setSelectedStatuses(prevStatuses => ({
                    ...prevStatuses,
                    [orderId]: newStatus,
                }));
                //console.log(`Order ${orderId} status changed to ${orders[orderIndex].status}`);
            } else {
                console.log(`Order ${orderId} not found`);
            }
        }
    }

    function saveChanges() {
        Object.keys(selectedStatuses).forEach(orderId => {
            const newStatus = selectedStatuses[orderId];
            //console.log(newStatus);
            // Make an axios request to update the order on the server
            axios.put('http://34.118.68.24:3007/orders?orderId=' + orderId, { status: newStatus }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    // Add other headers as needed
                  },
            })
                .then(response => {
                    // console.log(`Order ${orderId} updated successfully`);
                })
                .catch(error => {
                    console.error(`Error updating order ${orderId}:`, error);
                });

        });
    }
    

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
                        <tr key={order._id}>
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
                            <select 
                                onChange={ev => changeOrderStatus(order._id, ev.target.value, orders)} 
                                value={selectedStatuses[order._id] || order.status}
                            >
                                {order.status && (
                                    <option value="">{order.status}</option>
                                )}
                                {orderStatuses
                                    .filter(status => status !== order.status) // Exclude the current order status
                                    .map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                            </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {Object.keys(selectedStatuses).length > 0 && (
                <button className="btn-default mt-2" onClick={() => saveChanges()}>Save changes</button>
            )}
        </Layout>

    );
}