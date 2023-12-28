import styled from "styled-components";
import Center from "./Center";
import GlobalStyle from "./GlobalStyle";


const Bg = styled.div`
    background-color: #222;
    color: #fff;
    padding: 50px 0;
`;

const Title = styled.h1`
    margin:0;
    font-weight:normal;
`;

const Desc = styled.p`
    color:#aaa;
    font-size:.8rem;
`;

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 0.8fr 1.2fr;
    gap: 40px;
    img{
        max-width: 100%; 
    }
    
`;
const Column = styled.div`
    display: flex;
    align-items: center;
`;


export default function Featured() {
    return (
        <>
        <GlobalStyle/>
        <Bg>
            <Center>
                <Wrapper>
                    <Column>
                        <div>
                        <Title>Pro anywhere</Title>
                        <Desc>Οθόνη Super Retina XDR
Οθόνη Super Retina XDR 6,7 ιντσών με λειτουργία Always-On και ProMotion. Ενεργοποιείται με νέο ρυθμό ανανέωσης 1Hz και διαθέτεις τεχνολογίες μείωσης κατανάλωσης ενέργειας, ανάλογα με την χρήση. Διατηρεί την ώρα, τα widgets και τις δραστηριότητες άμεσα προσβάσιμες. Επιπλέον, υποστηρίζει ρύθμιση φωτεινότητας έως 2000 nits η οποία είναι διπλάσια από τη φωτεινότητα του iPhone 13 Pro και Ceramic Shield για αντοχή της οθόνης σε πτώσεις, σκόνη και νερό.</Desc>
                        </div>   
                    </Column>
                    <Column>
                        <img src="http://localhost:9000/tuc-eshop/1703768133660.png">
                        </img>
                    </Column>
                </Wrapper>
                
            </Center>
            
        </Bg>
        </>
    );
}