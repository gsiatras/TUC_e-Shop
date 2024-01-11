import { mongooseConnect } from "@/lib/mongoose";
import axios from "axios";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import { buffer } from "micro";

const endpointSecret = "whsec_e31ca3057188643f4bff5510ff30c6bc5a6f4c06fb88244ea538659fc256815c";

export default async function handler(req,res) {
    await mongooseConnect();
    const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(await buffer(req), sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      console.log('webhook');
      const data = event.data.object;
      const orderIds = data.metadata.orderIds;
      console.log(orderIds);
      const paid = data.payment_status === 'paid';
      
      if (orderIds) {
        console.log(orderIds);
        const orderIdArray = orderIds.split(',');
        console.log(orderIdArray);
        for (const id of orderIdArray) {
            console.log(id);
            console.log(paid);
            if (id && paid) {
                //await Order.findByIdAndUpdate(id, { paid: true });
                res = await axios.put('http://172.17.0.1:3007/orders?paidId=' + id);
                console.log(res);
            }
        }
    }
      break;
    default:
    
  }
  
}


export const config = {
    api: {bodyParser:false,}
}
//acct_1OU5hwJvUVrQpHMk
//merit-clever-cute-envy
