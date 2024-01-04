import styled from "styled-components";
import { primary } from "@/lib/colors";

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 50vh;
    margin-top: 20px;
    background-color: #222;
    color: #fff;
    align-items: center;
    justify-content: flex-start;

    p {
        margin: 10px;  // Remove default margin from <p> element
    }

    a {
        color: ${primary};
    }
`;

export default function Information() {
    return (
        <StyledDiv>
            <footer >
                <p >
                Created <i className="fa fa-heart"></i> by{' '}
                <a target="_blank" rel="noopener noreferrer" href="https://github.com/gsiatras">Georgios Michail Siatras</a>
                - Full stack e shop project for TUC Cloud Computing class{' '}
                <a target="_blank" rel="noopener noreferrer" href="https://github.com/gsiatras/TUC_e-Shop">here</a>.
                </p>
            </footer>
        </StyledDiv>
    );
}