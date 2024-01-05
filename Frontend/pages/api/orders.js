import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    await mongooseConnect();
    if (req.method === 'GET') {
        if (req.query?.seller) {
            res.json(await Order.find({seller:req.query.seller}).sort({createdAt:-1}));
        } else if (req.query?.email) {
            res.json(await Order.find({email:req.query.email}).sort({createdAt:-1}));
        }
    }

    if (req.method === 'PUT') {
        if (req.query?.orderId) {
            const id  = req.query.orderId;
            const status = req.body.status;
            res.json(await Order.findByIdAndUpdate(id, { status: status }));
        }  else {
            console('error');
        }
    }

    if (req.method === 'POST') {
        const {name,email,city,postalCode,streetAddress,country,
            cartProducts,sellers} = req.body;
        
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

        let orderIds = [];
        for (const seller of sellers) {
            let seller_line_items = [];
            for (const productId of uniqueIds) {
                const productInfo = productsInfos.find(p => p._id.toString() === productId && p.seller === seller.sellerName);
                const quantity = productIds.filter(id => id === productId)?.length || 0;
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
            if (orderDoc) {
                orderIds.push(orderDoc._id.toString());
            }
        }
        

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            customer_email: email,
            success_url: process.env.PUBLIC_URL + '/cart?success=1',
            cancel_url: process.env.PUBLIC_URL + '/cart?canceled=1',
            metadata: {orderIds: orderIds.join(','),},
        })
    
        res.json({
            url:session.url,
        })
    }
}