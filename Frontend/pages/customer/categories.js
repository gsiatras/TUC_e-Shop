import Categories from "@/components/customer/Categories";
import CustomLayout from "@/components/customer/CustomLayout";
import Products from "@/components/customer/Categories";

import axios from "axios";

export default function ProductsPage({ categoriesProducts, mainCategories, allCategories }) {
  return (
    <CustomLayout>
      <Categories categoriesProducts={categoriesProducts} mainCategories={mainCategories} allCategories={allCategories} />
    </CustomLayout>
  );
}

export async function getServerSideProps() {
  try {
    // Fetch data from the API
    const categoriesResponse = await axios.get('http://172.17.0.1:3001//api/categories');

    // Extract data from the responses
    const categories = categoriesResponse.data;
    const mainCategories = categories.filter(c => !c.parent);
    const categoriesProducts = {};

    for (const mainCat of mainCategories) {
        const mainCatId = mainCat._id.toString();
        //console.log('maincatid', mainCatId);
        //console.log('categoies', categories);
        const childCatIds = getAllSubcategories(categories, mainCatId);
        //console.log('childcats', childCatIds);
        const categoriesIds = [mainCatId, ...childCatIds];
        //console.log('beforereq', categoriesIds);
        const productsResponse = await axios.get('http://172.17.0.1:3005/products?limitCategories=' + categoriesIds);
        const products = productsResponse.data;
        categoriesProducts[mainCat._id] = products;
    }
    //console.log(categoriesProducts);

    return {
        props: {
            categoriesProducts: JSON.parse(
                JSON.stringify(categoriesProducts)
            ),
            mainCategories: JSON.parse(
                JSON.stringify(mainCategories)
            ),
            allCategories: JSON.parse(
                JSON.stringify(categories)
            ),
        },
    };
    } catch (error) {
        console.error('Error fetching data:', error);

        // You can also handle errors and return an error page
        return {
        props: {
            categoriesProducts: [],
            mainCategories: [],
            allCategories: [],
            error: 'Failed to fetch data',
        },
        };
    }
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