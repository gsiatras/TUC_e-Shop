import Layout from "@/components/seller/Layout";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./seller/Spinner";
import { ReactSortable } from "react-sortablejs";


export default function ProductForm({
    _id,
    title:existingTitle,
    description:existingDescription,
    price:existingPrice,
    quantity:existingQuantity,
    images:existingImages,
    category:assignedCategory,
    properties:assignedProperties
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [quantity, setQuantity] = useState(existingQuantity || '');
    const [category, setCategory] = useState(assignedCategory || '');
    const [productProperties, setProductProperties] = useState(assignedProperties || {});
    const [goToProducts, setGoToProducts] = useState(false);
    const [images, setImages] = useState(existingImages || []);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();
    const seller = Cookies.get('username');
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }, []);

    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }

            const res = await axios.post('/api/images', data)
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false);
        }
    }
    
    
    async function saveProduct(ev) {
        ev.preventDefault();
        console.log('save props', productProperties);
        const data = {
            title,description,price,quantity,seller,images,category,
            properties:productProperties
        };
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

    function deleteImage(link) {
        // Log the array before removal
        //console.log('Before:', images);
      
        // Remove the specified link from the array
        const updatedImages = images.filter(image => image !== link);
      
        // Set the updated array in the state
        setImages(updatedImages);
        axios.delete('/api/images?image='+link);
      
        // Log the array after removal
        //console.log('After:', updatedImages);
      }

    const propertiesToFill = [];
    if (categories.length > 0 && category) {
        let selCatInfo = categories.find(({_id}) => _id === category);
        propertiesToFill.push(...selCatInfo.properties);
        while(selCatInfo?.parent?._id) {
            const parentCat = categories.find(({_id}) => _id === 
            selCatInfo.parent._id);
            propertiesToFill.push(...parentCat.properties);
            selCatInfo = parentCat;
        }
        //console.log('proptofill', propertiesToFill);
    }

    function setProductProp(propName,value) {
        setProductProperties(prev => {
            const newProductProps = {...prev};
            newProductProps[propName] = value;
            //console.log('new props', newProductProps);
            return newProductProps;
        });
    }
      
    

    return (
        <form onSubmit={saveProduct}>
            <label>Product Name</label>
            <input className="input1" type="text" 
                placeholder="product name"
                value={title} 
                onChange={ev => setTitle(ev.target.value)}
            />
            <label>Category</label>
            <select 
                value={category} 
                onChange={ev => setCategory(ev.target.value)}>
                <option value="">Uncategorized</option>
                {categories.length > 0 && categories.map(c => (
                    <option value={c._id}>{c.name}</option>
                ))}
            </select>
            {propertiesToFill.length > 0 && propertiesToFill.map(p => (
                <div className="flex gap-1">
                    <div>{p.name}</div>
                    <select
                        value={productProperties[p.name]}
                        onChange={ev => 
                            setProductProp(p.name, ev.target.value)}>
                        {p.values.map(v => (
                            <option value={v}>{v}</option>
                        ))}
                    </select>
                </div>
            ))}
            <label>Photos</label>
            <div className="mb-2 flex flex-wrap gap-1">
                <ReactSortable 
                    list={images} 
                    setList={updateImagesOrder}
                    className="flex flex-wrap gap-1">
                    {!!images?.length && images.map(
                        link => (
                            <div key={link} className="relative h-24">
                            {/* Your image goes here */}
                                <img src={link} alt="" className="w-full h-full object-cover rounded-lg" />
                            
                            {/* Circle containing the SVG, positioned on top of the image */}
                                <div
                                    className="absolute top-1 right-1 p-2 rounded-full cursor-pointer hover:bg-gray-100"
                                    onClick={() => deleteImage(link)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div> 
                    ))} 
                </ReactSortable>
                {isUploading && (
                    <div className="h-24 p-1 flex items-center rounded-lg">
                        <Spinner/>
                    </div>
                )}
                <label className="w-24 h-24 cursor-pointer text-center flex flex-col
                    items-center justify-center text-gray-600 rounded-lg bg-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" data-slot="icon" className="w-6 h-6">
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