import CustomLayout from "@/components/customer/CustomLayout";
import Featured from "@/components/customer/Featured";
import GlobalStyle from "@/components/customer/GlobalStyle";
import Header from "@/components/customer/Header";
import NewProducts from "@/components/customer/NewProducts";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";

export default function CustomerHome() {
    const [productInfo, setProductInfo] = useState(null);
    const [recentProducts, setRecentProducts] = useState([]);
    const featuredProductId = '658d6f31044f7031934f1de8';
    

    useEffect(() => {
        axios.get('/api/products?id='+featuredProductId).then(
            response => {
                setProductInfo(response.data);
                //console.log({productInfo});
            }
        )
    }, [featuredProductId]);

    useEffect(() => {
        axios.get('/api/products?recent='+true).then(
            response => {
                setRecentProducts(response.data);
                //console.log({recentProducts});
            }
        )
    }, []);


    return (
        <CustomLayout>
            <Header></Header>
            {productInfo && (
                <Featured product={productInfo}/> 
            )}
            <NewProducts recentProducts={recentProducts} />
        </CustomLayout>
      );
}

