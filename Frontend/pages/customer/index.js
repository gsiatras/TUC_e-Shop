import CustomLayout from "@/components/customer/CustomLayout";
import Featured from "@/components/customer/Featured";
import GlobalStyle from "@/components/customer/GlobalStyle";
import Header from "@/components/customer/Header";
import Information from "@/components/customer/Information";
import NewProducts from "@/components/customer/NewProducts";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";

export default function CustomerHome({featuredProduct, recentProducts}) {
    return (
        <CustomLayout>
            <Featured product={featuredProduct}/> 
            <NewProducts recentProducts={recentProducts} />
        </CustomLayout>
      );
}

export async function getServerSideProps() {
    try {
        const featuredProductId = '659fcbea75d16d7f8e8c3fd8';
        const featuredProductResponse = await axios.get('http://172.17.0.1:3005/products?id=' + featuredProductId);
        const featuredProduct = featuredProductResponse.data;
        
        const recentProductsResponse = await axios.get('http://172.17.0.1:3005/products?recent=true');
        const recentProducts = recentProductsResponse.data;
        
  
        return {
            props: {
                featuredProduct: JSON.parse(
                    JSON.stringify(featuredProduct)
                ),
                recentProducts: JSON.parse(
                    JSON.stringify(recentProducts)
                ),
            },
        };
        } catch (error) {
            console.error('Error fetching data:', error);
    
            // You can also handle errors and return an error page
            return {
            props: {
                featuredProduct: '',
                recentProducts: [],
                error: 'Failed to fetch data',
            },
            };
        }
    }

