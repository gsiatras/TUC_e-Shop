import styled from "styled-components";
import Center from "./Center";
import GlobalStyle from "./GlobalStyle";
import Button from "./Button";
import { useContext, useEffect, useState } from "react";
import ButtonLink from "./ButtonLink";
import CartIcon from "./icons/CartIcon";
import { CartContext } from "./CartContext";


const Bg = styled.div`
    background-color: #222;
    color: #fff;
    padding: 10px 0;
`;

const Title = styled.h1`
    margin:0;
    font-weight:normal;
    font-size: 1.5rem;
    @media screen and (min-width: 768px) {
        font-size:3rem;
    }
`;

const Desc = styled.p`
    color:#aaa;
    font-size:.8rem;
`;

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr ;
    gap: 40px;
    img{
        max-width: 100%; 
        max-height: 250px;
    }
    div:nth-child(2) {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    div:nth-child(1) {
        order:2;
    }
    @media screen and (min-width: 768px) {
        grid-template-columns: 1.2fr 0.8fr;
        div:nth-child(1){
            order:0;
        }
        img{
            max-width: 100%; 
        }
    }
`;

const ButtonsWrapper = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 25px;
`;



const Column = styled.div`
    display: flex;
    align-items: center;
`;


export default function Featured({product}) {
    const {addProduct} = useContext(CartContext);
    
    function addFeaturedToCart(){
        addProduct(product._id);
    }
    
    return (
        <>
        <Bg>
            <Center>
                <ColumnsWrapper>
                    <Column>
                        <div>
                            <Title>{product.title}</Title>
                            <Desc>{product.description} </Desc>
                            <ButtonsWrapper>
                                <ButtonLink 
                                    href={'/customer/product/'+product._id} 
                                    outline={1} white={1}>
                                    Read more
                                </ButtonLink>
                                <Button white={1} onClick={addFeaturedToCart} >
                                    <CartIcon/>
                                    Add to cart
                                </Button>
                            </ButtonsWrapper>
                        </div>   
                    </Column>
                    <Column>
                        <img src={product.images[0]}>
                        </img>
                    </Column>
                </ColumnsWrapper>
                
            </Center>
            
        </Bg>
        </>
    );
}