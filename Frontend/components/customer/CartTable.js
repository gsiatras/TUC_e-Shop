import styled from "styled-components";

const StyledCartTable = styled.table`
    width: 100%;
    th{
        text-align: left;
        text-transform: uppercase;
        color: #ccc;
        font-weight: 600;
        font-size: .7rem;
    }

    td{
        border-top: 1px solid rgba(0,0,0,.1);
        max-width: 200px;
    }
`;

export default function CartTable(props) {
    return <StyledCartTable{...props}/>;
}