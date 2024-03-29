import Center from "./Center";
import Title from "@/components/customer/Title";
import WhiteBox from "@/components/customer/WhiteBox";
import { useContext, useState } from "react";
import styled from "styled-components";
import ProductImages from "./ProductsImages";
import Button from "./Button";
import CartIcon from "./icons/CartIcon";
import { CartContext } from "./CartContext";
import { primary } from "@/lib/colors";


const ColWrapper = styled.div`
    display:grid;
    grid-template-columns: 1fr;
    gap: 40px;
    margin-top: 40px;
    margin-bottom: 20px;
    @media screen and (min-width: 768px) {
        grid-template-columns: .9fr 1.1fr;
    }
`;

const ColWrapper2 = styled.div`
    display:grid;
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 5px;
    div:nth-child(1) {
        order:2;
    }
    @media screen and (min-width: 768px) {
        grid-template-columns: 1.2fr 0.8fr;
        div:nth-child(1){
            order:0;
        }
    }
`;

const PriceRow = styled.div`
    display:flex;
    gap: 20px;
    align-items: center;
`;

const Price = styled.span`
    font-size: 2rem;
`;

const Att = styled.a`
    color: ${primary};
    font-weight: 900;
`;

const Att2 = styled.a`
    font-weight: 900;
`;

const InformationBox = styled.div`
    margin-top: 0px;
    margin-bottom: 450px;
`;

const WhiteBox2 = styled.div`
    background-color: #fff;
    border-radius: 5px;
    padding: 20px 10px;
`;

const Selector = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 10px;
`;

const SelectorButton = styled.div`
    ${props => props.active ? `
        
    ` : `
        color: #bbb;
    `}
    cursor: pointer;
    display: inline-flex;
    padding: 5px 15px;
    font-weight: 600;
`;

export default function Product({product}) {
    const {addProduct} = useContext(CartContext);
    const [activeSelector, setActiveSelector] = useState('Des');
    
    

    return (
        <Center>
            <ColWrapper>
                <WhiteBox>
                    <ProductImages images = {product.images}/>
                </WhiteBox>
                <div>
                    <Title>{product.title}</Title>
                    <p>{product.description}</p>
                </div>
            </ColWrapper>
            <WhiteBox2>
                <ColWrapper2>
                    <div>
                        <p><Att2>Seller: </Att2> <Att>{product.seller}</Att> </p>
                    </div>
                    <div>
                        <PriceRow>
                            <div>
                                <Price>{product.price} €</Price>
                            </div>
                            <div>
                                <Button 
                                    primary={1}
                                    onClick={() => addProduct(product._id)}>
                                    <CartIcon/>Add to cart
                                </Button>
                            </div>
                        </PriceRow>
                        {product?.quantity > 0 && (
                            <p>Less than <Att>{product.quantity}</Att> available!</p>
                        )}
                        {product?.quantity === 0 && (
                            <p>Out of stock!</p>
                        )}
                        
                    </div>
                </ColWrapper2>
            </WhiteBox2>
            <Selector>
                <SelectorButton active={activeSelector==='Des'} onClick={() => setActiveSelector('Des')}>
                    Description
                </SelectorButton>
                <SelectorButton active={activeSelector==='Fea'} onClick={() => setActiveSelector('Fea')}>
                    Features
                </SelectorButton>
            </Selector>
            <InformationBox>
                <WhiteBox2>
                    {activeSelector === 'Des' && (
                        <div>
                            {product.description}
                        </div>
                    )}
                    {activeSelector === 'Fea' && (
                        <div>
                            <ul>
                                {Object.entries(product.properties).map(([property, value]) => (
                                    <li key={property}>
                                        {property}: {value}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </WhiteBox2>
            </InformationBox>
        </Center>
    );

}