import Cookies from "js-cookie";

const { createContext, useState, useEffect } = require("react");

export const CartContext = createContext({});

export function CartContextProvider({children}) {
    const [cartProducts, setCartProducts] = useState([]);

    useEffect(() => {
        if (cartProducts?.length > 0) {
            Cookies.set("cart", JSON.stringify(cartProducts), { expires: 1 / 24 });
          }
    }, [cartProducts]);

    useEffect(() => {
        if (Cookies.get("cart")) {
            setCartProducts(JSON.parse(Cookies.get("cart")));
          }
    }, []);

    function addProduct(productId) {
        setCartProducts(prev => [...prev, productId]);
    }

    function removeProduct(productId) {
        setCartProducts(prev => {
            const pos = prev.indexOf(productId);
            if (pos !== -1) {
                console.log('products in context', cartProducts);
                return prev.filter((value, index) => index !== pos);
            } else {
                console.log('asd');
                console.log('products in context', cartProducts);
                return prev;
            }
        })
    }
    

    return (
        <CartContext.Provider value={{cartProducts, setCartProducts, addProduct, removeProduct}}>
            {children}
        </CartContext.Provider>
    );
}