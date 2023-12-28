import Link from "next/link";
import styled from "styled-components";
import GlobalStyle from "./GlobalStyle";
import Center from "./Center";

const StyledHeader = styled.header`
        background-color: #222;
    `;

const Logo = styled(Link)`
    color:#fff;
    text-decoration:none;
`;

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
`;

const StyledNav = styled.nav`
    display: flex;
    gap: 15px;

`;

const NavLink = styled(Link)`
    color: #aaa;
    text-decoration:none;
`;

export default function Header() {
    return (
        <>
            <GlobalStyle/>
            <StyledHeader>
                <Center>
                    <Wrapper>
                        <Logo href={'/customer'}>TUCshop</Logo>
                        <StyledNav>
                            <NavLink href={'/customer'}>Home</NavLink>
                            <NavLink href={'/customer/products'}>All products</NavLink>
                            <NavLink href={'/customer/categories'}>Categories</NavLink>
                            <NavLink href={'/customer/account'}>Account</NavLink>
                            <NavLink href={'/customer/cart'}>Cart (0)</NavLink>
                        </StyledNav>
                    </Wrapper>
                </Center>
            </StyledHeader>
        </>
        
    )
}