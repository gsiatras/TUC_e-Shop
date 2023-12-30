import Link from "next/link";
import styled from "styled-components";
import GlobalStyle from "./GlobalStyle";
import Center from "./Center";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useContext } from "react";
import { CartContext } from "./CartContext";

const router = useRouter;
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

const NavButton = styled.button`
    color: #aaa;
    text-decoration:none;
`;

export default function Header() {
    async function signOut() {
        try {
            const refreshToken = Cookies.get('refreshToken');
            const logoutUrl = `http://localhost:8080/auth/realms/eshop/protocol/openid-connect/logout`;
            var urlencoded = new URLSearchParams();
            urlencoded.append("client_id", "client");
            urlencoded.append("client_secret", "3I5qTlVtM7oS4q8802rwJaKlRsiqD6Qp");
            urlencoded.append('refresh_token', refreshToken);
            

            const response = await fetch(logoutUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: urlencoded,
            })

            if (response.ok) {
                //§console.log('succes')
                Cookies.remove('role');
                Cookies.remove('username');
                Cookies.remove('email');
                Cookies.remove('refreshToken');
                router.push('/');
            } else {
                const err = await response.json();
                console.log(err);
            }
        } catch (error) {
            console.log('Error during loging: ', error)
        }
    }

    const {cartProducts} = useContext(CartContext);
    

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
                            <NavLink href={'/customer/cart'}>Cart ({cartProducts?.length})</NavLink>
                            <NavButton onClick={() => signOut()}>Logout</NavButton>
                        </StyledNav>
                    </Wrapper>
                </Center>
            </StyledHeader>
        </>
        
    )
}