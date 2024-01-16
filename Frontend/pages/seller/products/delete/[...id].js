import Layout from "@/components/seller/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProductPage(){
    const router = useRouter();
    const {id} = router.query;
    const [productInfo,setProductInfo] = useState();
    
    useEffect(() => {
        if (!id) {
        return;
        } else {
        axios.get('http://34.118.97.132:3005/products?id=' + id)
            .then(response => {
            setProductInfo(response.data);
            });
        }
    }, [id]);
    
    function goBack() {
        router.push('/seller/products');
    }
    
    async function deleteProduct() {
        await axios.delete('http://34.118.97.132:3005/products?id=' + id);
        goBack();
    }

    return (
        <Layout>
            <h1 className="text-center">Do you really want to delete &nbsp;"{productInfo?.title}"?</h1>
            <div className="flex gap-2 justify-center">
                <button 
                    className="btn-red"
                    onClick={deleteProduct}>
                    Yes
                </button>
                <button 
                    className="btn-default" 
                    onClick={goBack}>
                    No
                </button>
            </div>
            
        </Layout>
    )
}