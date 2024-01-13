import { useContext, useEffect, useState } from "react";
import Button from "@/components/customer/Button";
import { CartContext } from "@/components/customer/CartContext";
import Center from "@/components/customer/Center";
import styled from "styled-components";
import axios from "axios";
import CartTable from "./CartTable";
import Input from "./Input";
import Cookies from "js-cookie";
import Header from "./Header";
import WhiteBox from "./WhiteBox";



const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    margin-top: 40px;
    margin-bottom: 550px;
    0px;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1.3fr .7fr;
    }
`; 


const ProductInfoCell = styled.td`
    padding: 10px 0;
`;

const ProductImageBox = styled.div`
    width: 100px;
    heigth: 100px;
    padding: 10px;
    border: 1px solid rgba(0,0,0,.1); 
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    img{
        max-width: 80px;
        max-height: 80px;
    }
`;

const QuantityLabel = styled.span`
    padding: 0 2px;
`;

const CityHolder = styled.div`
    display: flex;
    gap: 5px;
`;

const SellerHeader = styled.div`
    margin-bottom: 5px;
`;

const SellerCart = styled.div`
    margin-top: 30px;
    border-top: 1px solid rgba(0,0,0,.3);
`;

const OrderTotalDiv = styled.div`
    margin-top: 20px;
    border-top: 1px solid rgba(0,0,0,1);
    text-align: right;
    font-weight: 700;
`;




export default function Cart() {
    const {cartProducts, addProduct, removeProduct, emptyCart} = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [country, setCountry] = useState('');
    const [email, setEmail] = useState(Cookies.get('email'));
    const [success, setSuccess] = useState(false);
    const [uniqueSellers, setUniqueSellers] =  useState([]);


    useEffect(() => {
        if (cartProducts?.length > 0) {
            axios.get('http://34.116.170.68:3005/products', {
                params: {
                    cartProducts: true,
                    ids: cartProducts
                }
            }).then(response => {
                //console.log(cartProducts);
                //console.log('adasd',response.data);
                setProducts(response.data);
                // console.log('products', cartProducts);
            });
        } else {
            setProducts([]);
        }
    }, [cartProducts]);

    useEffect(() => {
        if (products?.length > 0) {
            const sellers = [...new Set(products.map(product => product.seller))];
    
            const initializedSellers = sellers.map(seller => ({ sellerName: seller, total: 0 }));
    
            for (const productId of cartProducts) {
                const product = products.find(p => p._id === productId);
                if (product) {
                    const sellerIndex = initializedSellers.findIndex(s => s.sellerName === product.seller);
                    if (sellerIndex !== -1) {
                        initializedSellers[sellerIndex].total += product.price || 0;
                    }
                }
            }
    
            setUniqueSellers(initializedSellers);
        } else {
            setUniqueSellers([]);
        }
    }, [products, cartProducts]);
    

    function moreOfThisProduct(id) {
        addProduct(id);
    }

    function lessOfThisProduct(id) {
        removeProduct(id);
        //console.log('Products after remove 2: c',cartProducts);
    }

    
    let total = 0;
    for (const productId of cartProducts) {
        const price = products.find(p => p._id === productId)?.price || 0;
        total += price;
    }

    
    
    

    async function goToPayment() {
        const res = await axios.post('http://34.116.170.68:3007/orders', {
            name,
            email,
            city,
            postalCode,
            streetAddress,
            country,
            cartProducts,
            sellers: uniqueSellers,
        }, { withCredentials: true });

        if (res.data.url) {
            window.location = res.data.url;
        }
    }
    
    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.href.includes('success')) {
            setSuccess(true);
            emptyCart();
        }
    }, [])

    if (success) {
        return (
            <>
            <Center>
                <ColumnsWrapper>
                    <WhiteBox>
                        <h1>
                            Thanks for your order!
                        </h1>
                        <p>
                            Seller will contact you soon.
                        </p>
                    </WhiteBox>
                </ColumnsWrapper>
            </Center>
            </>
        )
    } 

    return(
        <Center>
                <ColumnsWrapper>
                    <WhiteBox>
                        <h1>Cart</h1>
                        {!cartProducts?.length && (
                            <div>Your cart is empty</div>
                        )}
                        {uniqueSellers?.length > 0 && uniqueSellers.map(sel => (
                            <SellerCart key={sel.sellerName}>
                                <SellerHeader>
                                    <p>Seller: {sel.sellerName}</p>
                                </SellerHeader>
                                {cartProducts?.length > 0 && (
                                    <CartTable>
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.filter(product => product.seller === sel.sellerName).map(product => (
                                                <tr key={product._id}> 
                                                    <ProductInfoCell>
                                                        <ProductImageBox>
                                                            <img src={product.images[0]}></img>
                                                        </ProductImageBox>
                                                        {product.title}
                                                    </ProductInfoCell>
                                                    <td>
                                                        <QuantityLabel>
                                                            <Button 
                                                                onClick={() => lessOfThisProduct(product._id)}>
                                                                -
                                                            </Button>
                                                            {cartProducts.filter(id => id ===
                                                            product._id).length}
                                                            <Button 
                                                                onClick={() => moreOfThisProduct(product._id)}>
                                                                +
                                                            </Button>
                                                        </QuantityLabel>
                                                    </td>
                                                    <td>
                                                        {cartProducts.filter(id => id ===
                                                        product._id).length * product.price} €
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td>Total</td>
                                                <td></td>
                                                <td>{sel.total} €</td>
                                            </tr>
                                        </tbody>
                                    </CartTable>
                                )}
                            </SellerCart>
                        ))}
                        {products?.length > 0 && (
                            <OrderTotalDiv>
                                Order Total: {total} €
                            </OrderTotalDiv>
                        )} 
                    </WhiteBox>
                    {!!cartProducts?.length && (
                        <WhiteBox>
                            <h1>Order information</h1>
                            <Input 
                                type="text" 
                                placeholder="Email" 
                                value={email}
                                name="email"
                            />
                            <Input 
                                type="text" 
                                placeholder="Name" 
                                value={name}
                                onChange={ev => setName(ev.target.value)}
                                name="name"
                            />
                            <CityHolder>
                                <Input 
                                    type="text" 
                                    placeholder="City" 
                                    value={city}
                                    onChange={ev => setCity(ev.target.value)}
                                    name="city"
                                />
                                <Input 
                                    type="text" 
                                    placeholder="Postal Code" 
                                    value={postalCode}
                                    onChange={ev => setPostalCode(ev.target.value)}
                                    name="postalCode"
                                />
                            </CityHolder>
                            <Input 
                                type="text" 
                                placeholder="Country" 
                                value={country}
                                onChange={ev => setCountry(ev.target.value)}
                                name="country"
                            />
                            <Input 
                                type="text" 
                                placeholder="Street Address" 
                                value={streetAddress}
                                onChange={ev => setStreetAddress(ev.target.value)}
                                name="streetAddress"
                            />
                            <Button 
                                black={1} 
                                block={1} 
                                onClick={goToPayment}>
                                Continue to payment
                            </Button>
                        </WhiteBox>
                    )}
                </ColumnsWrapper>
            </Center>
    );
}