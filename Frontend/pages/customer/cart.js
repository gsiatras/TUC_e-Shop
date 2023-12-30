import Cart from "@/components/customer/Cart";
import CustomLayout from "@/components/customer/CustomLayout";
import Header from "@/components/customer/Header";

export default function CartPage() {
    return(
    <CustomLayout>
        <Header/>
        <Cart/>
    </CustomLayout> 
    );
}