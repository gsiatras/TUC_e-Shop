import styled from "styled-components";
import Center from "./Center";
import ProductBox from "./ProductBox";
import Title from "./Title";

const ProductsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 60px;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
`;

export default function Products({ products }) {
    return(
        <Center>
            <Title>
                All products
            </Title>
            <ProductsGrid>
                {products?.length > 0 && products.map(product => (
                    <ProductBox  {...product}/>
                ))}
            </ProductsGrid>
        </Center>
    );
}
