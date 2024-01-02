const { Schema, model, models } = require("mongoose");

const OrderSchema = new Schema({
    seller:{type:String, required:true},
    line_items:{type:Object, required:true},
    name:String,
    city:String,
    email:String,
    postalCode:String,
    streetAddress:String,
    country:String,
    paid:{type:Boolean},
    status:{type:String, default:"Pending"},
}, {
    timestamps:true,
});

export const Order = models?.Order || model('Order', OrderSchema);