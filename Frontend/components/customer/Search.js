import styled from "styled-components";
import Center from "./Center";
import Input from "./Input";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import ProductsGrid from "./ProductsGrid";
import { debounce } from "lodash";
import Spinner from "./Spinner";

const SearchInput = styled(Input)`
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 1.4rem;
`;

const InputWrapper = styled.div`
    position: sticky;
    top: 70px;
    margin: 25px 0;
    padding: 5px 0;
    background-color: #eeeeeeaa;
`;

const ProductWrapper = styled.div`
    margin-bottom: 840px;
`;

export default function Search() {
    const [phrase, setPhrase] = useState('');
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const debouncedSearch = useCallback(debounce(phrase => searchProducts(phrase), 500), []);

    useEffect(() => {
        if (phrase.length > 0){
            setIsLoading(true);
            debouncedSearch(phrase);
        } else {
            setProducts([]);
        }
    },[phrase]);


    function searchProducts(phrase) {
        const url = `http://34.118.15.144:3005/products?search=${encodeURIComponent(phrase)}`;
    
        axios.get(url).then(res => {
            setProducts(res.data);
            setIsLoading(false);
        });
    }
    

   
    

    return (
        <Center>
            <InputWrapper>
                <SearchInput 
                    value={phrase}
                    autoFocus
                    onChange={ev => setPhrase(ev.target.value)}
                    placeholder="Search Product...">
                </SearchInput>
            </InputWrapper>
            <ProductWrapper>
                {phrase !== '' && products.length === 0 && !isLoading && (
                    <h2>No products found for query "{phrase}"</h2>
                )}
                {isLoading && (
                    <Spinner fullWidth={true}></Spinner>
                )}
                {!isLoading && products.length > 0 && phrase && (
                    <ProductsGrid products = {products}/>
                )}
            </ProductWrapper>
        </Center>
    );
}