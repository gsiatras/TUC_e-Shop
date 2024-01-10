import { Order } from '../models/Order.js';

async function handleOrders(order) {
  const order_id = order.id;
  const result = order.status;

  try {
    if (result === "Success") {
      // Update order status to 'Accepted'
      await Order.findByIdAndUpdate(order_id, { status: 'Accepted' });
      console.log('success');
      return "Success";
    } else if (result === "Rejected") {
      // Update order status to 'Canceled'
      await Order.findByIdAndUpdate(order_id, { status: 'Canceled' });
      console.log('rejectd');
      return "Rejected";
    } else {
      // Handle other cases if needed
      return "UnknownResult";
    }
  } catch (error) {
    // Handle any errors that might occur during the database query
    console.error('Error handling orders:', error.message);
    // Update order status to 'Canceled' in case of an error
    await Order.findByIdAndUpdate(order_id, { status: 'Canceled' });
    return "Error";
  }
}

export { handleOrders };
