import styled from "styled-components"
import Center from "./Center";
import ProductBox from "./ProductBox";
import GlobalStyle from "./GlobalStyle";

const ProductsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 20px;
`;

const Title = styled.h1`
    font-size: 2rem;
    font-weight: 500;
    margin: 30px 0 20px;
`;

export default function NewProducts({recentProducts}) {
    return (
        <>
        <GlobalStyle/>
        <Center>
            <Title>New arrivals</Title>
            <ProductsGrid>
                {recentProducts?.length > 0 && recentProducts.map(product => (
                    <ProductBox key={product._id} {...product}/>
                ))}
            </ProductsGrid>
        </Center>
        </>
        
        
    )
}