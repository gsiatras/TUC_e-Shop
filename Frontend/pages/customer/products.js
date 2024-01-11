import CustomLayout from "@/components/customer/CustomLayout";
import Products from "@/components/customer/Products";

import axios from "axios";

export default function ProductsPage({ products}) {
  return (
    <CustomLayout>
      <Products products={products} />
    </CustomLayout>
  );
}

export async function getServerSideProps() {
  try {
    // Fetch data from the API
    const productsResponse = await axios.get('http://172.17.0.1:3005/products');

    

    // Extract data from the responses
    const products = productsResponse.data;
    
    return {
      props: {
        products: JSON.parse(
          JSON.stringify(products)
        ),
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);

    // You can also handle errors and return an error page
    return {
      props: {
        products: [],
        error: 'Failed to fetch data',
      },
    };
  }
}
