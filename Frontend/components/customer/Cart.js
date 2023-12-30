import { useContext } from "react";
import Button from "@/components/customer/Button";
import { CartContext } from "@/components/customer/CartContext";
import Center from "@/components/customer/Center";
import styled from "styled-components";

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1.2fr .8fr;
    gap: 40px;
    margin-top: 40px;
`; 

const Box = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding:  30px;
`;


export default function Cart() {
    const {cartProducts} = useContext(CartContext);
    return(
        <Center>
                <ColumnsWrapper>
                    <Box>
                        {!cartProducts?.length && (
                            <div>Your cart is empty</div>
                        )}
                        {cartProducts?.length > 0 && (
                            <>
                                <h1>Cart</h1>
                            </>
                        )}
                    </Box>
                    {!!cartProducts?.length && (
                        <Box>
                            <h1>Order information</h1>
                            <input type="text" placeholder="Address"/>
                            <input type="text" placeholder="Address 2"/>
                            <Button black block>Continue to payment</Button>
                        </Box>
                    )}
                </ColumnsWrapper>
            </Center>
    );
}