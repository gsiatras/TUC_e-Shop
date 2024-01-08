import Link from "next/link";
import styled from "styled-components";
import GlobalStyle from "./GlobalStyle";
import Center from "./Center";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import axios from "axios";
import BarsIcaon from "./icons/Bars";
import SearchIcon from "./icons/Search";
import { useSearchParams } from "next/navigation";


const StyledHeader = styled.header`
    background-color: #222;
`;

const Logo = styled(Link)`
    color:#fff;
    text-decoration:none;
    position: relative;
    z-index: 3;
`;

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
    align-items: center;
`;

const StyledNav = styled.nav`
    ${props => props.mobileNavActive ? `
        display: block;
    ` : ` 
        display: none;
    `}
    gap: 15px;
    position:fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 70px 20px 20px;
    background-color: #222;
    @media screen and (min-width: 768px) {
        display:flex;
        position: static;
        padding: 0;
    }

`;

const NavLink = styled(Link)`
    display: block;
    color: #aaa;
    text-decoration:none;
    padding: 10px 0;
    @media screen and (min-width: 768px) {
        padding: 0;
    }
    svg {
        height: 20px;
    }
`;

const NavButton = styled.button`
    color: #aaa;
    text-decoration:none;
    padding: 10px 0;
    @media screen and (min-width: 768px) {
        padding: 0;
    }
`;

const NavButton2 = styled.button`
    border: 0;
    color: white;
    cursor: pointer;
    position: relative;
    z-index: 3;
    @media screen and (min-width: 768px){
       display: none;
    }
`;

const SideIcons = styled.div`
    display: flex;
    a{
        display: inline-block;
        min-width: 20px;
        color: white;
        align-items: center;
        svg{
            width: 16px;
            heigth: 16px;
        }
    }

`;

export default function Header() {
    const router = useRouter();

    async function signOut() {
        const res = await axios.post('/api/login?logout='+true);
        console.log(res);
        if (res.statusText==="OK"){
            //§console.log('succes')
            Cookies.remove('role');
            Cookies.remove('username');
            Cookies.remove('email');
            router.push('/');
          }
          else {
            alert("Logout failed!");
            console.log(res);
          }
    }

    const {cartProducts} = useContext(CartContext);
    const [mobileNavActive, setMobileNavActive] = useState(false);

    return (
        <>
            <GlobalStyle/>
            <StyledHeader>
                <Center>
                    <Wrapper>
                        <Logo href={'/customer'}>TUCshop</Logo>
                        <StyledNav mobileNavActive={mobileNavActive}>
                            <NavLink href={'/customer'}>Home</NavLink>
                            <NavLink href={'/customer/products'}>Products</NavLink>
                            <NavLink href={'/customer/categories'}>Categories</NavLink>
                            <NavLink href={'/customer/orders'}>Orders</NavLink>
                            <NavLink href={'/customer/cart'}>Cart ({cartProducts?.length || 0})</NavLink>
                            <NavButton onClick={() => signOut()}>Logout</NavButton>
                        </StyledNav>
                        <SideIcons>
                            <Link href={'/customer/search'}>
                                <SearchIcon/>
                            </Link>
                            <NavButton2 onClick={() => setMobileNavActive(prev => !prev)}>
                                    <BarsIcaon/>
                            </NavButton2>
                        </SideIcons>
                    </Wrapper>
                </Center>
            </StyledHeader>
        </>
        
    )
}