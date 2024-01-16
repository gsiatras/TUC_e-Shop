import express from 'express';
import { mongooseConnect } from '../lib/mongoose.js';
import { Product } from '../models/Product.js';
import "../lib/kafka.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { decodeJwt } from '../utils/jwtUtils.js';

const app = express();
const PORT = 3005; // You can use any port you prefer

// Middleware to parse JSON in request bodies
app.use(express.json());
app.use(cookieParser());

// Middleware to handle CORS if needed
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(cors({
    origin: 'http://34.118.97.132:3001',  // Update with the origin of your frontend app
    credentials: true,
  }));

// Your route handling
app.get('/products', async (req, res) => {
    if (req.query?.id) {
        res.json(await Product.findOne({_id:req.query.id}));
    } else if (req.query?.seller) {
        res.json(await Product.find({seller:req.query.seller}));
    } else if (req.query?.recent) { 
        //console.log('yes');
        res.json(await Product.find({}, null, {sort: {'_id':-1}, limit:12}));
    } else if (req.query?.cartProducts) {
        const ids = req.query.ids;
        console.log(ids);
        //console.log(req.query);
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
        res.json(await Product.find());
    }
});

app.post('/products', async (req, res) => {
    const {title,description,price,quantity,seller,images,category,properties} = req.body;
    const token = req.cookies.access_token;
    const decodeToken =  await decodeJwt(token);
    const roles = decodeToken.realm_access.roles;
    const rl = roles.includes("Customer") ? "Customer" :
                roles.includes("Seller") ? "Seller" : null;
    if (rl !== 'Seller') {
        console.log('Not authenticated access');
        res.json('Not authinticated Access');
        
    }
    //console.log(req.body);
    const productDoc = await Product.create({
        title,description,price,quantity,seller,images,category: category || undefined, properties,
    })
    res.json(productDoc);
});

app.put('/products', async (req, res) => {
    const {title,description,price,quantity,seller,images,category,properties,_id} = req.body; 
    const token = req.cookies.access_token;
    const decodeToken =  await decodeJwt(token);
    const roles = decodeToken.realm_access.roles;
    const rl = roles.includes("Customer") ? "Customer" :
                roles.includes("Seller") ? "Seller" : null;
    if (rl !== 'Seller') {
        console.log('Not authenticated access') 
        res.json('Not authinticated Access');
    }
    await Product.updateOne({_id}, {title,description,price,quantity,seller,images,
        category: category || undefined, properties});
    //console.log("sucess");
    res.json(true);
});

app.delete('/products', async (req, res) => {
    if (req.query?.id) {
        await Product.deleteOne({_id:req.query.id});
        res.json(true);
    } 
});

// Start the server
app.listen(PORT, async () => {
  await mongooseConnect();
  console.log(`Server is running on port ${PORT}`);
});
