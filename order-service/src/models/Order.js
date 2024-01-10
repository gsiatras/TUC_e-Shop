import mongoose from "mongoose";
const {model, Schema, models} = mongoose;


const OrderSchema = new Schema({
    seller:{type:String, required:true},
    line_items:{type:Object, required:true},
    name:{type:String, required:true},
    city:String,
    email:{type:String, required:true},
    postalCode:String,
    streetAddress:String,
    country:String,
    paid:{type:Boolean},
    status:{type:String, default:"Pending"},
}, {
    timestamps:true,
});

export const Order = models?.Order || model('Order', OrderSchema);