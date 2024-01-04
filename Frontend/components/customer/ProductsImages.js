import { useState } from "react";
import styled from "styled-components";

const Image = styled.img`
    max-width: 100%;
    max-height: 100%;
`;

const BigImage = styled.img`
    max-width: 200px;
    max-height: 110px;
`;

const ImageButtons = styled.div`
    display:flex;
    margin-top: 10px;
    gap: 10px;
    flex-grow: 0;
`;

const ImageButton = styled.div`
    border: 2px solid #aaa;
    ${props => props.active ? `
        border-color: #ccc;
    ` : `
        border-color: transparent;
        opacity:.7;
    `}
    height: 80px;
    padding: 5px;
    cursor: pointer;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const BigImageWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default function ProductImages({images}) {
    const [activeImage, setActiveImage] = useState(images?.[0]);

    return (
        <>
            <BigImageWrapper>
                <BigImage src={activeImage}/>
            </BigImageWrapper>
            <ImageButtons>
                {images.map(image => (
                    <ImageButton 
                        active={image===activeImage}
                        onClick={() => setActiveImage(image)}
                        key={image}>
                        <Image src={image}/>
                    </ImageButton>
                ))}
            </ImageButtons>

        </>
    );
}