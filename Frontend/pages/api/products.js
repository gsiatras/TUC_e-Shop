import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();

    if (method === 'GET'){
        if (req.query?.id) {
            res.json(await Product.findOne({_id:req.query.id}));
        } else if (req.query?.seller) {
            res.json(await Product.find({seller:req.query.seller}));
        } else {
            res.json(await Product.find());
        } 
    }

    if (method === 'POST') {
        const {title,description,price,quantity,seller,images,category,properties} = req.body;
        console.log(properties);
        //console.log(req.body);
        const productDoc = await Product.create({
            title,description,price,quantity,seller,images,category,properties,
        })
        res.json(productDoc);
    }

    if (method === 'PUT') {
        const {title,description,price,quantity,seller,images,category,properties,_id} = req.body; 
        console.log(properties);
        await Product.updateOne({_id}, {title,description,price,quantity,seller,images,category,properties});
        //console.log("sucess");
        res.json(true);
    }

    if (method === 'DELETE') {
        if (req.query?.id) {
           await Product.deleteOne({_id:req.query.id});
           res.json(true);
        } 
    }
}