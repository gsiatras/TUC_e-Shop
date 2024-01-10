import Category from "@/components/customer/Category";
import CustomLayout from "@/components/customer/CustomLayout";
import axios from "axios";
import { json } from "micro";

export default function CategoryPage({category, products, subCategories}) {
    return (
        <CustomLayout>
            <Category category={category} subCategories={subCategories} products={products}></Category>
        </CustomLayout>
    );
}

export async function getServerSideProps(context) {
    try {
        const categoryResponse = await axios.get('http://localhost:3000//api/categories?id='+context.query.id);
        const category = categoryResponse.data;
        const categoriesResponse = await axios.get('http://localhost:3000//api/categories');
        const categories = categoriesResponse.data;
        const subCategories = getAllSubcategories(categories, category._id);
        const categoriesIds = [category._id, ...subCategories];
        const productApiUrl = 'http://localhost:3005/products';
        const productsResponse = await axios.get(`${productApiUrl}?categories=${categoriesIds}`);
        const products = productsResponse.data;
        


        return {
            props:{
                category: JSON.parse(JSON.stringify(category)),
                subCategories: JSON.parse(JSON.stringify(subCategories)),
                products: JSON.parse(JSON.stringify(products)),
            } 
        };
    } catch (error) {
        console.error('Error fetching data:', error);

        // You can also handle errors and return an error page
        return {
        props: {
            category: [],
            products: [],
            subCategories: [],
            error: 'Failed to fetch data',
        },
        };
    };
    
}

const getAllSubcategories = (categories, categoryId) => {
    const subcategories = categories
        .filter(c => c?.parent?._id.toString() === categoryId)
        .map(c => c._id.toString());

    for (const subcategory of subcategories) {
        subcategories.push(...getAllSubcategories(categories, subcategory));
    }

    return subcategories;
};