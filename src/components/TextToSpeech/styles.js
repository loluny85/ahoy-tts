import styled from 'styled-components'

export const Input = styled.input`
    font-size: 32px;
    font-weight: 600;
    font-style: italic;
    font-family: emoji;
    border: none;
    border-bottom: 1px solid #c1c0c0;
    width: 100%;
    padding: 8px;
`;

export const InputHint = styled.div`
    display: flex;
    justify-content: flex-end;
    font-size: 14px;
    font-style: italic;
    margin-top: 8px;
`;

export const Speak = styled.img`
    height: 48px;
    margin-left: 24px;
`;

export const Loader = styled.img`
    height: 48px;
`;

export const Underline = styled.div`
    width: 40px;
    height: 1px;
    border-top: 4px solid #FF0102;
    margin-top: -12px;
`;

export const AudioText = styled.div`
    width: 140px;
    padding-left: 16px;
    font-style: italic;
    font-size: 14px;
`;
export const ErrorMsg = styled.div`
    margin-top: 8px;
    color: #D8000C;
    font-size: 14px;
`;



