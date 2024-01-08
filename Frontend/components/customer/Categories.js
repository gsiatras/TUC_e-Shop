import styled from "styled-components";
import Center from "./Center";
import ProductBox from "./ProductBox";
import Title from "./Title";
import Link from "next/link";

const ProductsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    @media screen and (min-width: 768px) {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
`;

const CategoryWrapper = styled.div`
    margin-bottom: 40px;
`;

const CategoryTitle = styled.div`
    margin-top: 5px;
    margin-bottom: 0px;
    display: flex;
    align-items: center;
    gap: 15px;
    a{
        color: #555;
        text-decoration: underline;
    }
`;

const ShowAllSquare = styled(Link)`
    background-color: #ddd;
    height: 140px;
    border-radius: 10px;
    align-items: center;
    display: flex;
    justify-content: center;
    color: #555;

`;

const BigWrapper = styled.div`
    margin-bottom: 320px;
`;

export default function Categories({ categoriesProducts, mainCategories, allCategories }) {
    return (
        <Center>
            <BigWrapper>
                {mainCategories.map(cat => (
                    <CategoryWrapper>
                        <CategoryTitle>
                            <Title>
                                {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                            </Title>
                            <div>
                                <Link href={'/customer/categories/'+cat._id}>Show all</Link>
                            </div>
                        </CategoryTitle>
                        <ProductsGrid>
                            {categoriesProducts[cat._id].map(p => (
                                <ProductBox {...p}/>
                            ))}
                        <ShowAllSquare href={'/customer/categories/'+cat._id}>
                                Show All &rarr;
                        </ShowAllSquare>
                        </ProductsGrid>
                    </CategoryWrapper>
                ))}
            </BigWrapper>
        </Center>
    );
}