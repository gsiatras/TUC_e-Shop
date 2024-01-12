import Layout from "@/components/seller/Layout";
import ProductForm from "@/components/seller/ProductForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export default  function EditProductPage() {
    const [productInfo, setProductInfo] = useState(null);
    const router = useRouter();
    const {id} = router.query;
    
    useEffect(() => {
        if (!id) {
            return;
        }
    
        axios.get('http://34.118.15.144:3005/products?id=' + id)
        .then(response => {
            setProductInfo(response.data);
        });
    }, [id]);

    return (
        <Layout>
            <h1 className="header1" >Edit Product</h1>
            {productInfo && (
                <ProductForm {...productInfo}/> 
            )}
        </Layout>
    )
}