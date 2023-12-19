import Layout from "@/components/seller/Layout";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProductForm({
    _id,
    title:existingTitle,
    description:existingDescription,
    price:existingPrice,
    quantity:existingQuantity,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [quantity, setQuantity] = useState(existingQuantity || '');
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();
    const seller = Cookies.get('username');
    
    
    async function saveProduct(ev) {
        ev.preventDefault();
        
        const data = {title, description, price, quantity, seller,};
        console.log(data);
        if (_id){
            //update
            await axios.put('/api/products', {...data, _id});
        } else {
            //create
            await axios.post('/api/products', data);
        }
        setGoToProducts(true);
    }

    if(goToProducts) {
        router.push('/seller/products')
    }

    return (
        <form onSubmit={saveProduct}>
            <label>Product Name</label>
            <input className="input1" type="text" 
                placeholder="product name"
                value={title} 
                onChange={ev => setTitle(ev.target.value)}
            />
            <label>Description</label>
            <textarea 
                placeholder="description"
                value={description}
                onChange={ev => setDescription(ev.target.value)}
            />
            <label>Price (Euros)</label>
            <input className="input1" type="number" 
                placeholder="price"
                value={price}
                onChange={ev => setPrice(ev.target.value)}
            />
            <label>Quantity</label>
            <input className="input1" type="number"
                placeholder="quantity"
                value={quantity}
                onChange={ev => setQuantity(ev.target.value)}
            />
            <button 
                type="submit"
                className="btn-primary">
                Save
            </button>
        </form>  
    );
}