import Cookies from "js-cookie";

const { createContext, useState, useEffect } = require("react");

export const CartContext = createContext({});

export function CartContextProvider({children}) {
    const [cartProducts, setCartProducts] = useState([]);

    useEffect(() => {
        if (cartProducts?.length > 0) {
            Cookies.set("cart", JSON.stringify(cartProducts), { expires: 1 / 24 });
            //console.log(cartProducts);
        }
    }, [cartProducts]);

    useEffect(() => {
        if (Cookies.get("cart")) {
            setCartProducts(JSON.parse(Cookies.get("cart")));
            //console.log('Cookie products:', cartProducts);
        } 
    }, []);

    function addProduct(productId) {
        setCartProducts(prev => [...prev, productId]);
    }

    function removeProduct(productId) {
        setCartProducts(prev => {
            const pos = prev.indexOf(productId);
            if (pos !== -1) {
                const updatedProducts = prev.filter((value, index) => index !== pos);
                if (!updatedProducts.length > 0) {
                    Cookies.remove("cart");
                }
                return updatedProducts;
            } else {
                //console.log('products in context', cartProducts);
                return prev;
            }
        })
    }

    function emptyCart() {
        Cookies.remove("cart");
    }
    

    return (
        <CartContext.Provider value={{cartProducts, 
        setCartProducts, addProduct, removeProduct, emptyCart}}>
            {children}
        </CartContext.Provider>
    );
}