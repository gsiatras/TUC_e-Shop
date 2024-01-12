import styled from "styled-components";
import Center from "./Center";
import Header from "./Header";
import ProductsGrid from "./ProductsGrid";
import Title from "./Title";
import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import Spinner from "./Spinner";


const BigWrapper = styled.div`
    margin-bottom: 650px;
`;

const CategoryHeader = styled.div`
    display: flex;
    align-items: center;
    Title: {
        font-size: 1.5em;
    }
    justify-content: space-between;
    margin-bottom: 20px;
`;

const FilterWrapper = styled.div`
    margin-left: 20px;
    display: flex;
    gap: 10px;
`;

const Filter = styled.div`
    background-color: #ddd;
    padding: 5px 10px;
    border-radius: 5px;
    display: flex;
    gap: 5px;
    align-items: center;
    color: #444;
    select{
        border: 0;
        background-color: transparent;
        font-size: inherit;
        color: #444;
        padding-top: 0;
        padding-bottom: 0;
        padding-left: ;
        padding-right: 0;
        margin-bottom: 0;
        border-radius: 0;
    }
`;

const filterReducer = (state, action) => {
    switch (action.type) {
        case "update":
            return state.map((p) => ({
                name: p.name,
                value: p.name === action.filterName ? action.filterValue : p.value,
            }));
        default:
            return state;
    }
};


export default function Category({category, subCategories, products:originalProducts}) {
    const defaultSorting = '_id-des';
    const defaultFilterValues = category.properties.map((p) => ({
        name: p.name,
        value: "All",
    }))
    const [filterValues, dispatch] = useReducer(filterReducer, defaultFilterValues);

    const [sort, setSort] = useState(defaultSorting);
    
    const [products, setProducts] = useState(originalProducts);

    const [loadingProducts, setLoadingProducts] = useState(false);

    const [filtersChanged , setFiltersChanged] = useState(false);

    
    function handleFilterChange(filterName, filterValue) {
        setFiltersChanged(true);
        dispatch({ type: "update", filterName, filterValue });
    }
    

    useEffect(() => {
        if (!filtersChanged) {
            return;
        }
        setLoadingProducts(true);
        const categoriesIds = [category._id, ...(subCategories || [])];
        const params = new URLSearchParams; 
        params.set('categories', categoriesIds);
        params.set('sort', sort);
        filterValues.forEach(f => {
            if (f.value !== 'All') {
                params.set(f.name, f.value)
            }
            }
        );
        const url = `http://34.118.15.144:3005/products?${params.toString()}`;
        axios.get(url).then(res => {
            setProducts(res.data);
            setTimeout(() => {
                setLoadingProducts(false);
            }, 1000);
        });
    },[filterValues, sort, filtersChanged]);
    
    

    return (
        <Center>
            <BigWrapper>
                <CategoryHeader>
                    <Title>{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</Title>
                    <FilterWrapper>
                        {category.properties.map(prop => (
                            <Filter key={prop.name}>
                                <span>
                                    {prop.name}:
                                </span>
                                <select 
                                    value={filterValues.find((f) => f.name === prop.name).value}
                                    onChange={ev => handleFilterChange(prop.name, ev.target.value)}
                                    >
                                    <option value="All">All</option>
                                    {prop.values.map(val => (
                                        <option key={val} value={val}>
                                            {val}
                                        </option>
                                    ))}
                                </select>
                            </Filter>
                            
                        ))}
                        <Filter >
                            <span>
                                Sort:
                            </span>
                            <select 
                                value={sort}
                                onChange={ev => {setSort(ev.target.value); setFiltersChanged(true);}}
                                >
                                <option value="price-asc">Price, ascending</option>
                                <option value="price-des">Price, descending</option>
                                <option value="_id-des">newest first</option>
                                <option value="_id-asc">oldest first</option>
                            </select>
                        </Filter>
                    </FilterWrapper>
                </CategoryHeader>
                {loadingProducts && (
                    <Spinner fullWidth/>
                )}
                {!loadingProducts && (
                    <div>
                        {products?.length > 0 && (
                            <ProductsGrid products={products}/>
                        )}
                        {products?.length === 0 && (
                            <div>
                                Sorry, no products found
                            </div>
                        )}
                    </div>

                )} 
            </BigWrapper>
        </Center>
    );
}