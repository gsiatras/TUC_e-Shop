import styled from "styled-components"
import Button from "./Button";
import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "./CartContext";


const ProductWrapper = styled.div`\
    display: flex;
    flex-direction: column;
    height: 100%; 
`;

const WhiteBox = styled(Link)`
    background-color: #fff;
    padding: 20px;
    text-align: center;
    display: flex;
    height: 140px;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    img{
        max-width:100;
        max-height:90px;
    }
`;

const Title = styled(Link)`
    font-weight: normal;
    font-size: 0.9rem;
    margin:0;
    flex-grow: 1;
`;

const ProductInfoBox = styled.div`
    margin-top:5px;
    display: flex;
    flex-direction: column;
`;

const PriceRow = styled.div`
    display: flex;
    align-items: flex-start;
    align-items: center;
    justify-content: space-between;
    margin-top: 2px;
    gap: 5px;
    @media screen and (min-width: 768px) {
        display:flex
    }
`;

const Price = styled.div`
    font-size: 1rem;
    font-weight: 700;
    text-align: right;
    @media screen and (min-width: 768px) {
        font-size: 1.3rem;
        font-weight: 700;
    }
`;

export default function ProductBox({_id,title, description,price,images}) {
    const uri = '/customer/product/'+_id;

    const {addProduct} = useContext(CartContext);
    

    return (
        <ProductWrapper>
            <WhiteBox href={uri}>
                <div>
                    <img src={images[0]}/>
                </div>
            </WhiteBox>
            <ProductInfoBox>
            <Title href={uri}>{title}</Title>
                <PriceRow>
                    <Price>{price}€</Price>
                    <Button
                        block 
                        primary={1} 
                        outline={1} 
                        onClick={() => addProduct(_id)}>
                        Add to cart 
                    </Button>
                </PriceRow>
            </ProductInfoBox>
        </ProductWrapper>
        
    )
}