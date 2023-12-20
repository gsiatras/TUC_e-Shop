import Layout from "@/components/seller/Layout";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useState } from "react";
import Spinner from "./seller/Spinner";
import { ReactSortable } from "react-sortablejs";


export default function ProductForm({
    _id,
    title:existingTitle,
    description:existingDescription,
    price:existingPrice,
    quantity:existingQuantity,
    images:existingImages,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [quantity, setQuantity] = useState(existingQuantity || '');
    const [goToProducts, setGoToProducts] = useState(false);
    const [images, setImages] = useState(existingImages || []);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();
    const seller = Cookies.get('username');

    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }

            const res = await axios.post('/api/upload', data)
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false);
        }
    }
    
    
    async function saveProduct(ev) {
        ev.preventDefault();
        const data = {title, description, price, quantity, seller, images};
        //console.log(data);
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

    function updateImagesOrder(images) {
        setImages(images);
    }
    

    return (
        <form onSubmit={saveProduct}>
            <label>Product Name</label>
            <input className="input1" type="text" 
                placeholder="product name"
                value={title} 
                onChange={ev => setTitle(ev.target.value)}
            />
            <label>Photos</label>
            <div className="mb-2 flex flex-wrap gap-1">
                <ReactSortable 
                    list={images} 
                    setList={updateImagesOrder}
                    className="flex flex-wrap gap-1">
                    {!!images?.length && images.map(
                        link => (
                        <div 
                            key={link}
                            className="h-24">
                            <img src={link} alt="" className="rounded-lg"/>
                        </div>
                    ))} 
                </ReactSortable>
                {isUploading && (
                    <div className="h-24 p-1 bg-gray-300 flex items-center rounded-lg">
                        <Spinner/>
                    </div>
                )}
                <label className="w-24 h-24 cursor-pointer text-center flex flex-col
                    items-center justify-center text-gray-600 rounded-lg bg-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" dataSlot="icon" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>Upload</div>
                    <input type="file" 
                        onChange={uploadImages} className="hidden"
                    />
                </label>
            </div>
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