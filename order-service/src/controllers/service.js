import express from 'express';
import { mongooseConnect } from '../lib/mongoose.js';
import { Order } from '../models/Order.js';
import axios from 'axios';
import stripePackage from 'stripe';
import kafka from '../lib/kafka.js';
import '../lib/kafka.js';

const app = express();
const PORT = 3007; // You can use any port you prefer
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY || "sk_test_51OU5hwJvUVrQpHMkIU7tDBk3WAxZjVw0bNMhuMPy9w1a6iB5V9MR6Cr1zUYLvTILHSmMh9P73ZPf20SpLexSlOtO00npckONT4");


// Middleware to parse JSON in request bodies
app.use(express.json());

// Middleware to handle CORS if needed
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Your route handling
app.get('/orders', async (req, res) => {
    if (req.query?.seller) {
        res.json(await Order.find({seller:req.query.seller}).sort({createdAt:-1}));
    } else if (req.query?.email) {
        res.json(await Order.find({email:req.query.email}).sort({createdAt:-1}));
    }
});

app.post('/orders', async (req, res) => {
    //console.log('sadasd');
    const {name,email,city,postalCode,streetAddress,country,
        cartProducts,sellers} = req.body;
    const productIds = cartProducts;
    const uniqueIds = [... new Set(productIds)];
    const response = await axios.get('http://172.17.0.1:3005/products', {
                params: {
                    cartProducts: true,
                    ids: uniqueIds,
    }});
    const productsInfos = response.data;
    //console.log(productsInfos);
    

    let line_items = [];
    for (const productId of uniqueIds) {
        const productInfo = productsInfos.find(p => p._id.toString() === productId);
        const quantity = productIds.filter(id => id === productId)?.length || 0;
        if (quantity > 0 && productInfo) {
            line_items.push({
                quantity, 
                price_data: {
                    currency: 'eur',
                    product_data: {name:productInfo.title},
                    unit_amount: productInfo.price * 100,
                }
            })
        }
    }

    let orderIds = [];
    for (const seller of sellers) {
        let seller_line_items = [];
        let seller_products = [];
        for (const productId of uniqueIds) {
            const productInfo = productsInfos.find(p => p._id.toString() === productId && p.seller === seller.sellerName);
            const quantity = productIds.filter(id => id === productId)?.length || 0;
            let product = {id:productInfo._id, quantity:quantity};
            seller_products.push(product);
            if (quantity > 0 && productInfo) {
                seller_line_items.push({
                    quantity, 
                    price_data: {
                        currency: 'eur',
                        product_data: {name:productInfo.title},
                        unit_amount: productInfo.price * 100,
                    }
                })
            }
        }
        const orderDoc = await Order.create({
            seller:seller.sellerName,line_items:seller_line_items,name,email,city,postalCode,
            streetAddress,country,paid:false,status:'Pending',
        });
        console.log('order created');

        const msg = {
            id: orderDoc._id,
            products: seller_products,
        }

        await kafka.kafkaProducer(msg);
        
        

        if (orderDoc) {
            orderIds.push(orderDoc._id.toString());
        }
        
    }
    

    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        customer_email: email,
        success_url: 'http://localhost:3000/customer/cart?success=1',
        cancel_url: 'http://localhost:3000/customer/cart?canceled=1',
        metadata: {orderIds: orderIds.join(','),},
    })

    res.json({
        url:session.url,
    })
});

app.put('/orders', async (req, res) => {
    if (req.query?.orderId) {
        const id  = req.query.orderId;
        const status = req.body.status;
        res.json(await Order.findByIdAndUpdate(id, { status: status }));
    }  else {
        console('error');
    }
});

app.delete('/orders', async (req, res) => {
  console.log('not implemented');
});

// Start the server
app.listen(PORT, async () => {
  await mongooseConnect();
  console.log(`Server is running on port ${PORT}`);
});
