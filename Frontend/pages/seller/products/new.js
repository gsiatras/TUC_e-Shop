import Layout from "@/components/seller/Layout";
import ProductForm from "@/components/ProductForm";

export default function NewProduct() {
    return (
    <Layout>
        <h1 className="header1" >New Product</h1>
        <ProductForm />
    </Layout>
    ); 
}