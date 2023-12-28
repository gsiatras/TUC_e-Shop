import Featured from "@/components/customer/Featured";
import Header from "@/components/customer/Header";
import axios from "axios";
import { useEffect, useState } from "react";





export default function CustomerHome() {
    const [productInfo, setProductInfo] = useState(null);
    const featuredProductId = '658d6f31044f7031934f1de8';
    

    useEffect(() => {
        axios.get('/api/products?id='+featuredProductId).then(
            response => {
                setProductInfo(response.data);
                console.log({productInfo});
            }
        )
    }, [featuredProductId]);


    return (
        <div>
            <Header></Header>
            {productInfo && (
                <Featured product={productInfo}/> 
            )}
        </div>
      );
}

