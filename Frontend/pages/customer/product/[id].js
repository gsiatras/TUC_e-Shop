import CustomLayout from "@/components/customer/CustomLayout";
import Product from "@/components/customer/Product";
import axios from "axios";





export default function ProductPage({product}) {
    return (
        <CustomLayout>
            <Product product={product}/> 
        </CustomLayout>
    );
}

export async function getServerSideProps(context) {
    try {
        const productResponse = await axios.get(`http://localhost:3005/products?id=${context.query.id}`);
        const product = productResponse.data;
        return {
            props:{
                product: JSON.parse(JSON.stringify(product)),
            } 
        };
    } catch (error) {
        console.error('Error fetching data:', error);

        // You can also handle errors and return an error page
        return {
            props: {
                products: '',
                error: 'Failed to fetch data',
            },
        };
    };
}