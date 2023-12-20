import {model, Schema, models} from "mongoose";

const ProductSchema = new Schema({
    title: {type: String, required: true},
    description: String,
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    seller: {type: String, required: true},
    images: [{type:String}],
});

export const Product = models.Product || model('Product', ProductSchema);