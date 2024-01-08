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
        } else if (req.query?.recent) { 
            //console.log('yes');
            res.json(await Product.find({}, null, {sort: {'_id':-1}, limit:12}));
        } else if (req.query?.cartProducts) {
            //console.log('yes');
            const ids = req.query['ids[]'];
            res.json(await Product.find({_id:ids}));
        } else if (req.query?.limitCategories) {
            const categoryIds = req.query.limitCategories.split(',');
            res.json(await Product.find({category:categoryIds}, null, {limit: 3, sort:{'_id':-1}}))
        } else if (req.query?.categories) {
            const {categories, sort, ...filters} = req.query;
            const categoryIds = categories.split(',');

            if (Object.keys(filters).length === 0 && !sort) {
                res.json(await Product.find({category:categoryIds}, null, {sort:{'_id':-1}}))

            } else if (Object.keys(filters).length > 0 && sort){
                const [sortField, sortOrder] = sort.split('-');
                const sortOptions = {};
                sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;
                const dynamicQuery = {};
                Object.keys(filters).forEach(key => {
                    dynamicQuery[`properties.${key}`] = filters[key];
                });
                res.json(await Product.find({category:categoryIds, ...dynamicQuery},null,
                    { sort: sortOptions }));

            } else if (Object.keys(filters).length === 0 && sort) {
                const [sortField, sortOrder] = sort.split('-');
                const sortOptions = {};
                sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;
                res.json(await Product.find({category:categoryIds}, null, { sort: sortOptions }))

            } else {
                const dynamicQuery = {};
                Object.keys(filters).forEach(key => {
                    dynamicQuery[`properties.${key}`] = filters[key];
                });
                res.json(await Product.find({category:categoryIds, ...dynamicQuery}));
            }
        } else if (req.query?.search) {
            const phrase = req.query.search;
            const productsQuery = { '$or': [
                { title: { $regex: phrase, $options: 'i' } }, 
                { description: { $regex: phrase, $options: 'i' } }, 
            ] };

            res.json(await Product.find(productsQuery));


        } else {
            console.log('yes1');
            res.json(await Product.find());
        } 
    }

    if (method === 'POST') {
        const {title,description,price,quantity,seller,images,category,properties} = req.body;
        console.log(properties);
        //console.log(req.body);
        const productDoc = await Product.create({
            title,description,price,quantity,seller,images,category: category || undefined, properties,
        })
        res.json(productDoc);
    }

    if (method === 'PUT') {
        const {title,description,price,quantity,seller,images,category,properties,_id} = req.body; 
        console.log(properties);
        await Product.updateOne({_id}, {title,description,price,quantity,seller,images,
            category: category || undefined, properties});
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