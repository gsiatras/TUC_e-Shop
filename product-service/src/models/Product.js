import mongoose from "mongoose";
const {model, Schema, models} = mongoose;

const ProductSchema = new Schema({
    title: {type: String, required: true},
    description: String,
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    seller: {type: String, required: true},
    images: [{type:String}],
    category: {type:mongoose.Types.ObjectId, ref:'Category'},
    properties: {type:Object},
}, {
    timestamps: true,
});

export const Product = models.Product || model('Product', ProductSchema);