import CustomLayout from "@/components/customer/CustomLayout";
import Product from "@/components/customer/Product";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";




export default function ProductPage() {
    const [product, setProduct] = useState('');
    const router = useRouter();
    const {id} = router.query;

    

    useEffect(() => {
        if (!id){
            return;
        }
        axios.get('/api/products?id='+id).then(
            response => {
                setProduct(response.data);
                //console.log(product);
            }
        )
    }, [id]);

    return (
        <CustomLayout>
            {product && (
                <Product {...product}/> 
            )}
        </CustomLayout>

    );
}