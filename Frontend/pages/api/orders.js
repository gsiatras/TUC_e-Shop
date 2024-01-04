import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    await mongooseConnect();
    if (req.method === 'GET') {
        if (req.query?.seller) {
            res.json(await Order.find({seller:req.query.seller}).sort({createdAt:-1}));
        }
    }

    if (req.method === 'POST') {
        const {name,email,city,postalCode,streetAddress,country,
            cartProducts,seller} = req.body;
        
        const productIds = cartProducts;
        const uniqueIds = [... new Set(productIds)];
        const productsInfos = await Product.find({_id:uniqueIds});
    
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
        
        const orderDoc = await Order.create({
            seller,line_items,name,email,city,postalCode,
            streetAddress,country,paid:false,status:'Pending',
        });
    
        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            customer_email: email,
            success_url: process.env.PUBLIC_URL + '/cart?success=1',
            cancel_url: process.env.PUBLIC_URL + '/cart?canceled=1',
            metadata: {orderId:orderDoc._id.toString()},
        })
    
        res.json({
            url:session.url,
        })
    }
}