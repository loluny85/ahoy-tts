import React from 'react';
import Header from "../components/Header/Header"
import { Body } from './layoutStyles'

const BaseLayout = ({ children }) => {
    return (
        <>
            <Header />
            <Body>
                {children}
            </Body>
        </>
    );
};

export default BaseLayout;